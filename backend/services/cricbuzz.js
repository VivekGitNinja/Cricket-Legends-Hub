/**
 * Cricbuzz live-data service.
 *
 * Fetches real match data (live scores, upcoming fixtures with real dates,
 * completed results and full scorecards) by reading Cricbuzz's server-rendered
 * pages. No API key, no cost — Cricbuzz embeds its match data as JSON inside
 * the Next.js flight payload of each page.
 *
 * The service is resilient:
 *   - direct fetch first, r.jina.ai reader as a proxy fallback
 *   - in-memory cache with a short TTL so live pages stay fresh but we never
 *     hammer the source
 *   - every method throws on failure so callers can fall back to seeded data
 */
import axios from 'axios';

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0 Safari/537.36';

const cache = new Map(); // key -> { ttl, value }

function getCached(key) {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value;
  if (hit) cache.delete(key);
  return undefined;
}

function setCached(key, value, ttlMs) {
  cache.set(key, { value, expires: Date.now() + ttlMs });
  // keep the cache small
  if (cache.size > 40) {
    const oldest = cache.keys().next().value;
    cache.delete(oldest);
  }
}

/** Fetch a page: direct first, then the jina reader proxy. */
async function fetchPage(path, { timeout = 12000 } = {}) {
  const url = `https://www.cricbuzz.com${path}`;
  try {
    const res = await axios.get(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html,*/*', 'Accept-Language': 'en-US,en;q=0.9' },
      timeout,
      maxRedirects: 5,
    });
    if (res.status === 200 && res.data && res.data.length > 20000) return res.data;
    throw new Error(`cricbuzz direct fetch failed: HTTP ${res.status}`);
  } catch (err) {
    // Fall back through the jina reader (fetches from their network).
    const proxy = await axios.get(`https://r.jina.ai/${url}`, {
      headers: { Accept: 'text/markdown,text/html,*/*' },
      timeout: timeout + 10000,
    });
    if (proxy.status === 200 && proxy.data && proxy.data.length > 20000) return proxy.data;
    throw new Error(`cricbuzz fetch failed (direct + proxy): ${err.message}`);
  }
}

/**
 * Decode the Next.js flight payload into one big string.
 * Each chunk is self.__next_f.push([1,"<escaped>"]);
 */
function decodeFlight(html) {
  const chunks = [];
  const re = /self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g;
  let m;
  while ((m = re.exec(html)) !== null) chunks.push(m[1]);
  if (!chunks.length) throw new Error('no flight payload found');
  return JSON.parse(`"${chunks.join('')}"`);
}

/**
 * Find `"key":` inside the decoded flight string and return the JSON value
 * that follows — either a quoted string or a balanced-brace object/array.
 */
function findJsonValue(s, key) {
  const needle = `"${key}":`;
  let start = s.indexOf(needle);
  // RSC payloads often repeat; prefer the LAST (largest) occurrence for lists.
  let last = s.lastIndexOf(needle);
  if (start === -1) throw new Error(`key "${key}" not found in payload`);
  let from = start + needle.length;
  const chooseLargest = last > start;
  if (chooseLargest) from = last + needle.length;
  const seg = s.slice(from);
  let i = 0;
  while (i < seg.length && /\s/.test(seg[i])) i++;
  const c0 = seg[i];
  if (c0 === '"') {
    // string value (possibly containing escaped JSON)
    i++;
    let out = '';
    for (; i < seg.length; i++) {
      const c = seg[i];
      if (c === '\\') {
        out += seg[i + 1] ?? '';
        i++;
        continue;
      }
      if (c === '"') break;
      out += c;
    }
    const trimmed = out.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return JSON.parse(trimmed);
      } catch {
        return trimmed;
      }
    }
    return out;
  }
  if (c0 === '{' || c0 === '[') {
    let depth = 0;
    let inStr = false;
    let esc = false;
    for (; i < seg.length; i++) {
      const c = seg[i];
      if (esc) { esc = false; continue; }
      if (c === '\\' && inStr) { esc = true; continue; }
      if (c === '"') { inStr = !inStr; continue; }
      if (inStr) continue;
      if (c === c0) depth++;
      else if ((c0 === '{' && c === '}') || (c0 === '[' && c === ']')) {
        depth--;
        if (depth === 0) {
          i++;
          break;
        }
      }
    }
    return JSON.parse(seg.slice(0, i));
  }
  // bare token (numbers, true, $undefined etc.)
  const match = /^[$\w.\-]+/.exec(seg.slice(i));
  return match ? match[0] : undefined;
}

function inningsOf(score) {
  if (!score) return [];
  const list = [];
  for (const key of ['inngs1', 'inngs2', 'inngs3', 'inngs4']) {
    if (score[key]) list.push(score[key]);
  }
  return list;
}

function normalizeMatch(raw) {
  const info = raw.matchInfo || {};
  const score = raw.matchScore || {};
  const t1 = info.team1 || {};
  const t2 = info.team2 || {};
  const batTeamId = info.currBatTeamId;
  const s1 = inningsOf(score.team1Score).map((inn, i) => ({ ...inn, innings: i + 1 }));
  const s2 = inningsOf(score.team2Score).map((inn, i) => ({ ...inn, innings: i + 1 }));
  const liveScore = [];
  if (s1.length) liveScore.push({ teamId: score.team1Score?.batTeamId, name: t1.teamSName, runs: s1[s1.length - 1].runs, wickets: s1[s1.length - 1].wickets, overs: s1[s1.length - 1].overs });
  if (s2.length) liveScore.push({ teamId: score.team2Score?.batTeamId, name: t2.teamSName, runs: s2[s2.length - 1].runs, wickets: s2[s2.length - 1].wickets, overs: s2[s2.length - 1].overs });
  return {
    matchId: String(info.matchId),
    seriesId: info.seriesId,
    seriesName: info.seriesName || '',
    matchDesc: info.matchDesc || '',
    matchFormat: info.matchFormat || '',
    state: info.state || 'Upcoming',
    status: info.status || info.shortStatus || '',
    shortStatus: info.shortStatus || info.status || '',
    startDate: info.startDate ? new Date(info.startDate).toISOString() : null,
    endDate: info.endDate ? new Date(info.endDate).toISOString() : null,
    isTimeAnnounced: !!info.isTimeAnnounced,
    venue: info.venueInfo ? `${info.venueInfo.ground || ''}, ${info.venueInfo.city || ''}`.replace(/^, /, '') : '',
    teams: [
      { id: t1.teamId, name: t1.teamName, shortName: t1.teamSName, imageId: t1.imageId },
      { id: t2.teamId, name: t2.teamName, shortName: t2.teamSName, imageId: t2.imageId },
    ],
    liveScore,
    currBatTeamId: batTeamId,
    source: 'cricbuzz',
  };
}

/** Live + recent + upcoming matches listed on the live-scores page. */
export async function getMatches({ ttl = 15000 } = {}) {
  const cached = getCached('matches');
  if (cached) return cached;
  const html = await fetchPage('/live-cricket-scores');
  const s = decodeFlight(html);
  const list = findJsonValue(s, 'matchesList');
  const raw = (list.matches || []).map((x) => x.match || x).filter(Boolean);
  // The page also carries a complete list grouped by series — merge it in.
  try {
    const grouped = findJsonValue(s, 'seriesMatches') || [];
    for (const g of grouped) {
      const wrapped = g.seriesAdWrapper || g;
      for (const m of wrapped.matches || []) raw.push(m.match || m);
    }
  } catch {
    /* grouped list is optional */
  }
  const seen = new Set();
  const unique = [];
  for (const m of raw) {
    const id = m.matchInfo?.matchId;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    unique.push(m);
  }
  const matches = unique.map(normalizeMatch);
  const out = { source: 'cricbuzz', fetchedAt: Date.now(), matches };
  setCached('matches', out, ttl);
  return out;
}

/** Upcoming fixtures with real start dates. */
export async function getUpcoming({ ttl = 300000 } = {}) {
  const cached = getCached('upcoming');
  if (cached) return cached;
  const html = await fetchPage('/cricket-match/schedule');
  const s = decodeFlight(html);
  const list = findJsonValue(s, 'matchesList');
  const raw = (list.matches || []).map((x) => x.match || x).filter(Boolean);
  const matches = raw.map(normalizeMatch);
  const out = { source: 'cricbuzz', fetchedAt: Date.now(), matches };
  setCached('upcoming', out, ttl);
  return out;
}

function normalizeScorecard(raw, match) {
  const bat = raw.batTeamDetails || {};
  const bowl = raw.bowlTeamDetails || {};
  const innings = raw.scoreDetails || raw.inningsData || {};
  const batsmen = Object.values(bat.batsmenData || {}).map((b) => ({
    name: b.batName,
    id: b.batId,
    runs: b.runs,
    balls: b.balls,
    fours: b.fours,
    sixes: b.sixes,
    sr: b.strikeRate,
    out: b.outDesc || null,
    isCaptain: b.isCaptain,
    isKeeper: b.isKeeper,
    isOut: !!b.wicketCode,
  }));
  const bowlers = Object.values(bowl.bowlersData || {}).map((b) => ({
    name: b.bowlName,
    id: b.bowlerId,
    overs: b.overs,
    maidens: b.maidens,
    runs: b.runs,
    wickets: b.wickets,
    econ: b.economy,
    noBalls: b.no_balls,
    wides: b.wides,
  }));
  const wickets = Object.values(raw.wicketsData || {}).map((w) => ({
    batsman: w.batName,
    bowler: '',
    over: w.wktOver,
    score: w.wktRuns,
    number: w.wktNbr,
  }));
  const extras = raw.extrasData || {};
  const extrasTotal = (extras.byes ?? 0) + (extras.legByes ?? 0) + (extras.noBalls ?? 0) + (extras.wides ?? 0) + (extras.penalty ?? 0);
  return {
    matchId: String(raw.matchId || match?.matchId),
    inningsId: raw.inningsId,
    battingTeam: bat.batTeamName || (match?.teams && match.teams[0]?.name) || 'Team A',
    bowlingTeam: bowl.bowlTeamName || (match?.teams && match.teams[1]?.name) || 'Team B',
    runs: innings.runs ?? 0,
    wickets: innings.wickets ?? 0,
    overs: innings.overs ?? 0,
    runRate: innings.runRate ?? 0,
    batters: batsmen,
    bowlers,
    fallOfWickets: wickets,
    extras: extrasTotal,
    partnerships: Object.values(raw.partnershipsData || {}).map((p) => ({
      bat1: p.bat1Name,
      bat1Runs: p.bat1Runs,
      bat2: p.bat2Name,
      bat2Runs: p.bat2Runs,
      runs: p.totalRuns,
      balls: p.totalBalls,
    })),
    updatedAt: raw.timeScore ? new Date(raw.timeScore).toISOString() : null,
  };
}

/** Full scorecard for one match (all innings). */
export async function getScorecard(matchId, { ttl = 20000 } = {}) {
  const key = `scorecard:${matchId}`;
  const cached = getCached(key);
  if (cached) return cached;
  const html = await fetchPage(`/live-cricket-scorecard/${matchId}`);
  const s = decodeFlight(html);
  const data = findJsonValue(s, 'scorecardApiData');
  const innings = (data.scoreCard || []).map((sc) => normalizeScorecard(sc));
  const out = { source: 'cricbuzz', matchId: String(matchId), fetchedAt: Date.now(), innings };
  setCached(key, out, ttl);
  return out;
}

export { fetchPage, decodeFlight, findJsonValue };
