/**
 * Live match hub.
 *
 * Polls Cricbuzz for real match data every POLL_MS and broadcasts changes to
 * every connected client over Server-Sent Events. Clients get the update the
 * instant the poll sees a new score — no client-side polling delay.
 *
 * Falls back gracefully: if the source is unreachable we keep serving the last
 * good snapshot (marked `stale`) so the UI never blanks out.
 */
import { getMatches } from './cricbuzz.js';

const POLL_MS = 12000;
const HEARTBEAT_MS = 15000;
const MAX_STALE_MS = 15 * 60 * 1000;

const clients = new Set(); // express res objects
let snapshot = { source: 'cricbuzz', fetchedAt: Date.now(), matches: [], stale: false };
let lastSignature = '';
let timer = null;
let heartbeat = null;
let lastGoodAt = Date.now();

const FORMAT_LABELS = {
  HUN: 'Hundred',
  TEST: 'Test',
  ODI: 'ODI',
  T20: 'T20',
  T10: 'T10',
  TNPL: 'T20',
  CPL: 'T20',
  LPL: 'T20',
  BBL: 'T20',
  IPL: 'T20',
  PSL: 'T20',
  SA20: 'T20',
  MLC: 'T20',
  ILT20: 'T20',
};

function formatLabel(code) {
  const c = String(code || '').toUpperCase();
  return FORMAT_LABELS[c] || c || 'T20';
}

function statusOf(state) {
  if (state === 'In Progress') return 'Live';
  if (state === 'Preview') return 'Scheduled';
  return 'Completed';
}

/** Build the frontend-facing shape for a normalized cricbuzz match. */
function toFrontendMatch(m) {
  const t1 = m.teams[0] || {};
  const t2 = m.teams[1] || {};
  const [s1, s2] = m.liveScore || [];
  const status = statusOf(m.state);
  const live =
    status === 'Live'
      ? {
          phase: 'live',
          score1: s1 ? { runs: s1.runs, wickets: s1.wickets, overs: s1.overs } : null,
          score2: s2 ? { runs: s2.runs, wickets: s2.wickets, overs: s2.overs } : null,
          summary: [s1 ? `${s1.name} ${s1.runs}/${s1.wickets}` : null, s2 ? `${s2.name} ${s2.runs}/${s2.wickets}` : null, m.status].filter(Boolean).join(' · '),
          lastUpdated: new Date(m.fetchedAt || Date.now()).toISOString(),
        }
      : null;
  return {
    _id: m.matchId,
    id: m.matchId,
    matchId: m.matchId,
    source: 'cricbuzz',
    real: true,
    series: m.seriesName || `${t1.name || ''} vs ${t2.name || ''}`,
    format: formatLabel(m.matchFormat),
    status,
    state: m.state,
    date: m.startDate,
    startDate: m.startDate,
    team1: { name: t1.name, shortName: t1.shortName },
    team2: { name: t2.name, shortName: t2.shortName },
    teams: [t1, t2],
    venue: { name: m.venue, city: '' },
    liveScore: live,
    scorecard: null,
    result: null,
  };
}

/** Signature used to detect score changes between polls. */
function signature(matches) {
  return matches
    .map((m) => {
      const s = (m.liveScore || []).map((x) => `${x.name}:${x.runs}/${x.wickets}/${x.overs}`).join('|');
      return `${m.matchId}:${m.state}:${s}`;
    })
    .join(';');
}

async function poll() {
  try {
    const data = await getMatches();
    const matches = data.matches.map(toFrontendMatch);
    snapshot = { source: 'cricbuzz', fetchedAt: data.fetchedAt || Date.now(), matches, stale: false };
    lastGoodAt = Date.now();
    const sig = signature(data.matches);
    if (sig !== lastSignature) {
      lastSignature = sig;
      broadcast();
    }
  } catch (err) {
    // Keep serving the last good snapshot, but mark it stale after a while.
    snapshot = { ...snapshot, stale: Date.now() - lastGoodAt > MAX_STALE_MS };
    console.error('[liveHub] poll failed:', err.message);
  }
}

function broadcast() {
  const payload = `data: ${JSON.stringify({ type: 'update', matches: snapshot.matches, fetchedAt: snapshot.fetchedAt, stale: snapshot.stale })}\n\n`;
  for (const res of clients) {
    try {
      res.write(payload);
    } catch {
      clients.delete(res);
    }
  }
}

/** Attach an SSE response; returns a cleanup function. */
export function subscribe(res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.write(`retry: 8000\n\n`);
  // Send the current snapshot immediately so the client renders without waiting.
  res.write(`data: ${JSON.stringify({ type: 'snapshot', matches: snapshot.matches, fetchedAt: snapshot.fetchedAt, stale: snapshot.stale })}\n\n`);
  clients.add(res);
  const ping = setInterval(() => {
    try {
      res.write(`: ping\n\n`);
    } catch {
      /* connection gone */
    }
  }, HEARTBEAT_MS);
  res.on('close', () => {
    clearInterval(ping);
    clients.delete(res);
  });
  return () => {
    clearInterval(ping);
    clients.delete(res);
  };
}

export function getSnapshot() {
  return snapshot;
}

export function start() {
  if (timer) return;
  poll();
  timer = setInterval(poll, POLL_MS);
  heartbeat = setInterval(() => {
    // push a heartbeat even without changes so proxies keep the stream open
    for (const res of clients) {
      try {
        res.write(`: ping\n\n`);
      } catch {
        clients.delete(res);
      }
    }
  }, HEARTBEAT_MS);
}

export function stop() {
  if (timer) clearInterval(timer);
  if (heartbeat) clearInterval(heartbeat);
  timer = null;
  heartbeat = null;
  for (const res of clients) {
    try {
      res.end();
    } catch {
      /* noop */
    }
  }
  clients.clear();
}
