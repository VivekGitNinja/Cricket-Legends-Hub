import Match from '../models/Match.js';
import Team from '../models/Team.js';
import Player from '../models/Player.js';

/** Deterministic PRNG (mulberry32) so live scores are stable per ball but advance with time. */
function seededRand(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

const MAX_OVERS = { T20: 20, IPL: 20, ODI: 50, T10: 10, Test: 90 };

/** Precompute a deterministic ball-by-ball innings for a match id. */
function inningsFromSeed(seed, balls) {
  const rng = seededRand(seed);
  const events = [];
  let runs = 0;
  let wickets = 0;
  let ballsBowled = 0;
  for (let b = 0; b < balls && wickets < 10; b++) {
    const r = rng();
    let event;
    if (r < 0.021) {
      wickets += 1;
      event = { type: 'wicket', runs: 0 };
    } else if (r < 0.075) {
      runs += 4;
      event = { type: 'four', runs: 4 };
    } else if (r < 0.1) {
      runs += 6;
      event = { type: 'six', runs: 6 };
    } else if (r < 0.25) {
      runs += 1;
      event = { type: 'single', runs: 1 };
    } else if (r < 0.3) {
      runs += 2;
      event = { type: 'two', runs: 2 };
    } else if (r < 0.32) {
      runs += 3;
      event = { type: 'three', runs: 3 };
    } else {
      event = { type: 'dot', runs: 0 };
    }
    ballsBowled += 1;
    events.push(event);
  }
  return { runs, wickets, ballsBowled, events };
}

function overLabel(ballIndex) {
  const over = Math.floor(ballIndex / 6);
  const ball = (ballIndex % 6) + 1;
  return `${over}.${ball}`;
}

function commentaryText(event, shortName) {
  switch (event.type) {
    case 'wicket':
      return 'OUT! The middle stump is pegged back — huge roar from the crowd!';
    case 'four':
      return 'FOUR! Punched off the back foot and raced to the fence.';
    case 'six':
      return 'SIX! Launched into the stands — that has cleared the rope with ease!';
    case 'single':
      return 'Quick single taken, sharp running between the wickets.';
    case 'two':
      return 'Two more! Worked into the gap, they come back for the second.';
    case 'three':
      return 'Three runs! Excellent running, the fielder is chasing it down.';
    default:
      return 'No run, beaten outside off — good bowling.';
  }
}

/**
 * Simulated live match state: deterministic per ball, advancing with real time.
 * Phase 1 = first innings, phase 2 = chase, phase 3 = complete.
 */
export function simulateLiveMatch(match) {
  const now = Date.now();
  const start = new Date(match.date || Date.now()).getTime();
  const format = match.format || 'T20';
  const maxOvers = MAX_OVERS[format] || 20;
  const totalBalls = maxOvers * 6;
  const matchSeed = hashString(String(match._id || match.id || 'match'));

  const in1 = inningsFromSeed(matchSeed, totalBalls);
  const in2 = inningsFromSeed(matchSeed ^ 0x9e3779b9, totalBalls);
  const target = in1.runs + 1;

  const elapsedMin = Math.max(0, (now - start) / 60000);
  const halfMatchMin = maxOvers * 3.2; // first innings window
  const totalMatchMin = halfMatchMin * 2;

  let phase = 'innings-1';
  if (elapsedMin >= totalMatchMin) phase = 'complete';
  else if (elapsedMin >= halfMatchMin) phase = 'chase';

  const buildScore = (inning, ballsBowled) => {
    const runs = inning.events.slice(0, ballsBowled).reduce((s, e) => s + e.runs, 0);
    const wickets = inning.events.slice(0, ballsBowled).filter((e) => e.type === 'wicket').length;
    const overs = ballsBowled / 6;
    const runRate = ballsBowled > 0 ? (runs / overs).toFixed(2) : '0.00';
    return { runs, wickets, ballsBowled, overs: overs.toFixed(1), runRate };
  };

  let score1, score2 = null;
  let commentary = [];
  let summary = '';

  if (phase === 'innings-1') {
    const balls = Math.max(0, Math.min(in1.ballsBowled, Math.floor((elapsedMin / halfMatchMin) * in1.ballsBowled)));
    score1 = buildScore(in1, balls);
    const from = Math.max(0, balls - 10);
    commentary = in1.events.slice(from, balls).map((e, i) => ({
      over: overLabel(from + i),
      text: commentaryText(e),
      runs: e.runs
    })).reverse();
    summary = `${match.team1?.name || 'Home'} are batting`;
  } else if (phase === 'chase') {
    score1 = buildScore(in1, in1.ballsBowled);
    const balls = Math.max(0, Math.min(in2.ballsBowled, Math.floor(((elapsedMin - halfMatchMin) / halfMatchMin) * in2.ballsBowled)));
    score2 = buildScore(in2, balls);
    const from = Math.max(0, balls - 10);
    commentary = in2.events.slice(from, balls).map((e, i) => ({
      over: overLabel(from + i),
      text: commentaryText(e),
      runs: e.runs
    })).reverse();
    const needed = target - score2.runs;
    summary = `${match.team2?.name || 'Away'} need ${Math.max(0, needed)} to win`;
  } else {
    score1 = buildScore(in1, in1.ballsBowled);
    score2 = buildScore(in2, in2.ballsBowled);
    const r1 = score1.runs;
    const r2 = score2.runs;
    const w2 = score2.wickets;
    summary =
      r2 > target
        ? `${match.team2?.name || 'Away'} won by ${10 - w2} wickets`
        : r2 === r1
          ? 'Match tied'
          : `${match.team1?.name || 'Home'} won by ${r1 - r2} runs`;
    commentary = in2.events.slice(-8).map((e, i) => ({
      over: overLabel(in2.ballsBowled - 8 + i),
      text: commentaryText(e),
      runs: e.runs
    })).reverse();
  }

  return {
    phase,
    format,
    maxOvers,
    target: phase === 'complete' ? null : target,
    battingTeam: phase === 'chase' ? (match.team2?._id || match.team2?.id) : (match.team1?._id || match.team1?.id),
    score1,
    score2,
    summary,
    commentary,
    lastUpdated: new Date().toISOString()
  };
}

const POPULATE = [
  { path: 'team1', select: 'name shortName' },
  { path: 'team2', select: 'name shortName' },
  { path: 'result.winner', select: 'name shortName' },
  { path: 'manOfTheMatch', select: 'name' },
  { path: 'tossWinner', select: 'name' },
  { path: 'live.battingTeam', select: 'name shortName' }
];

const attachLive = (matches) =>
  matches.map((m) => {
    const doc = m.toObject ? m.toObject() : m;
    if (doc.status === 'Live' || doc.live?.inProgress) {
      doc.liveScore = simulateLiveMatch(doc);
    }
    return doc;
  });

// ----------------------------------------------------------------
// Scorecard generation (deterministic, mirrors the live engine)
// ----------------------------------------------------------------
const squadCache = new Map();
const SQUAD_TTL = 10 * 60 * 1000;

function fallbackSquad(teamName) {
  return Array.from({ length: 12 }).map((_, i) => ({
    name: `${teamName || 'Team'} Player ${i + 1}`,
    role: i < 6 ? 'Batsman' : 'Bowler'
  }));
}

async function getSquadFor(teamName) {
  const key = String(teamName || '');
  const hit = squadCache.get(key);
  if (hit && Date.now() - hit.at < SQUAD_TTL) return hit.players;
  // Prefer exact team membership (keeps men's and women's squads separate).
  let players = await Player.find({ teams: key }).select('name role isLegend').lean();
  if (!players.length) {
    players = await Player.find({
      country: key,
      teams: { $nin: [`${key} Women`, `${key} Men`] }
    }).select('name role isLegend').lean();
  }
  const list = players.length ? players : fallbackSquad(key);
  squadCache.set(key, { at: Date.now(), players: list });
  return list;
}

function shuffled(list, seed) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seededRand(seed ^ i)() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const DISMISSALS = ['b', 'c', 'lbw', 'run out', 'stumped'];

function buildInningsCard(battingSquad, bowlingSquad, inning, ballsBowled, maxOvers, seed) {
  const roleTier = (role) =>
    /Wicket/.test(role || '') ? 0 : (role || '') === 'Batsman' ? 0 : /All/.test(role || '') ? 1 : 2;
  // Prefer active (non-legend) players for match XIs; legends stay in profiles.
  const ordered = [...battingSquad]
    .sort((a, b) => Number(Boolean(a.isLegend)) - Number(Boolean(b.isLegend)) || roleTier(a.role) - roleTier(b.role))
    .slice(0, 11);
  const batters = shuffled(ordered, seed);
  const bowlers = shuffled(
    bowlingSquad.filter((p) => /Bowler|All/.test(p.role || '')).length
      ? bowlingSquad.filter((p) => /Bowler|All/.test(p.role || ''))
      : bowlingSquad.slice(-5),
    seed ^ 0x51ed270b
  ).slice(0, 5);
  if (bowlers.length < 2) bowlers.push(...fallbackSquad('Bowler').slice(0, 2));

  const lines = [];
  let striker = 0;
  let nonStriker = 1;
  let nextBatter = 2;
  let ballsInOver = 0;
  let totalRuns = 0;
  let totalWickets = 0;
  let extras = 2 + (seed % 5); // deterministic wides/nbs
  const fallOfWickets = [];
  const bowlerStats = bowlers.map((b) => ({
    name: b.name,
    balls: 0,
    runs: 0,
    wickets: 0,
    maidens: 0
  }));
  const batterStats = batters.map((b) => ({
    name: b.name,
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    out: null
  }));

  const deliveries = Math.min(ballsBowled, inning.events.length);
  for (let i = 0; i < deliveries; i++) {
    const ev = inning.events[i];
    const b = batterStats[striker];
    const bowler = bowlerStats[Math.floor(i / 6) % bowlerStats.length];
    bowler.balls += 1;
    bowler.runs += ev.runs;
    totalRuns += ev.runs;
    b.balls += 1;
    b.runs += ev.runs;
    if (ev.type === 'four') b.fours += 1;
    if (ev.type === 'six') b.sixes += 1;

    ballsInOver += 1;
    if (ev.runs % 2 === 1) [striker, nonStriker] = [nonStriker, striker];
    if (ballsInOver === 6) {
      ballsInOver = 0;
      [striker, nonStriker] = [nonStriker, striker];
    }

    if (ev.type === 'wicket') {
      totalWickets += 1;
      const over = overLabel(i);
      b.out = `${over} ${DISMISSALS[(seed + i) % DISMISSALS.length]} ${bowler.name}`;
      bowler.wickets += 1;
      fallOfWickets.push({
        score: totalRuns,
        over,
        batsman: b.name,
        bowler: bowler.name
      });
      if (nextBatter < batters.length) striker = nextBatter++;
      else striker = nonStriker;
    }
  }

  // Add extras to the current bowler's column and the total
  if (deliveries > 0) {
    const extraBowler = bowlerStats[Math.floor((deliveries - 1) / 6) % bowlerStats.length];
    extraBowler.runs += extras;
    totalRuns += extras;
  }

  const oversBowled = deliveries / 6;
  const card = {
    runs: totalRuns,
    wickets: totalWickets,
    balls: deliveries,
    overs: oversBowled.toFixed(1),
    extras,
    batters: batterStats.map((b) => ({
      name: b.name,
      runs: b.runs,
      balls: b.balls,
      fours: b.fours,
      sixes: b.sixes,
      sr: b.balls ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0',
      out: b.out
    })),
    didNotBat: batters.slice(Math.max(nextBatter, 2)).map((b) => b.name),
    bowlers: bowlerStats.map((b) => ({
      name: b.name,
      overs: (b.balls / 6).toFixed(1),
      maidens: b.balls >= 6 && b.runs === 0 && b.wickets === 0 ? 1 : 0,
      runs: b.runs,
      wickets: b.wickets,
      econ: b.balls ? ((b.runs / (b.balls / 6))).toFixed(2) : '0.00'
    })),
    fallOfWickets
  };

  // Maidens computed per over rather than per bowler ball
  for (let ov = 0; ov < Math.floor(deliveries / 6); ov++) {
    const b = bowlerStats[ov % bowlerStats.length];
    const overEvents = inning.events.slice(ov * 6, ov * 6 + 6);
    if (overEvents.every((e) => e.runs === 0 && e.type !== 'wicket')) {
      b.maidens += 1;
    }
  }
  card.bowlers = bowlerStats.map((b) => ({
    name: b.name,
    overs: (b.balls / 6).toFixed(1),
    maidens: b.maidens,
    runs: b.runs,
    wickets: b.wickets,
    econ: b.balls ? (b.runs / (b.balls / 6)).toFixed(2) : '0.00'
  }));

  return card;
}

async function buildScorecard(match, liveScore) {
  const t1 = match.team1?.name || 'Team A';
  const t2 = match.team2?.name || 'Team B';
  const [squad1, squad2] = await Promise.all([getSquadFor(t1), getSquadFor(t2)]);
  const fmt = match.format || 'T20';
  const totalBalls = (MAX_OVERS[fmt] || 20) * 6;
  const seed = hashString(String(match._id || match.id || 'match'));
  const in1 = inningsFromSeed(seed, totalBalls);
  const in2 = inningsFromSeed(seed ^ 0x9e3779b9, totalBalls);

  const phase = liveScore?.phase || 'complete';
  const balls1 =
    phase === 'complete' || phase === 'chase' ? in1.ballsBowled : (liveScore?.score1?.ballsBowled ?? in1.ballsBowled);
  const balls2 =
    phase === 'complete' ? in2.ballsBowled : phase === 'chase' ? (liveScore?.score2?.ballsBowled ?? 0) : 0;

  const innings = [];
  if (balls1 > 0) {
    innings.push({
      battingTeam: t1,
      bowlingTeam: t2,
      ...buildInningsCard(squad1, squad2, in1, balls1, MAX_OVERS[fmt] || 20, seed)
    });
  }
  if (balls2 > 0) {
    innings.push({
      battingTeam: t2,
      bowlingTeam: t1,
      ...buildInningsCard(squad2, squad1, in2, balls2, MAX_OVERS[fmt] || 20, seed ^ 0x9e3779b9)
    });
  }
  return { innings };
}

const enrichWithScorecard = (matches) =>
  Promise.all(
    matches.map(async (m) => {
      try {
        m.scorecard = await buildScorecard(m, m.liveScore);
      } catch (e) {
        /* scorecard optional */
      }
      return m;
    })
  );
export const getMatches = async (req, res) => {
  try {
    const { format, status, team, page = 1, limit = 10 } = req.query;
    const query = {};

    if (format) query.format = format;
    if (status) query.status = status;
    if (team) {
      query.$or = [
        { team1: team },
        { team2: team }
      ];
    }

    const matches = await Match.find(query)
      .populate(POPULATE)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Match.countDocuments(query);

    res.status(200).json({
      success: true,
      count: matches.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      matches: await enrichWithScorecard(attachLive(matches))
    });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching matches'
    });
  }
};

export const getMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate(POPULATE);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.status(200).json({
      success: true,
      match: (await enrichWithScorecard(attachLive([match])))[0]
    });
  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching match'
    });
  }
};

export const getLiveMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [{ status: 'Live' }, { 'live.inProgress': true }]
    })
      .populate(POPULATE)
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      matches: await enrichWithScorecard(attachLive(matches))
    });
  } catch (error) {
    console.error('Get live matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching live matches'
    });
  }
};

export const getUpcomingMatches = async (req, res) => {
  try {
    const { limit = 30 } = req.query;
    const matches = await Match.find({
      status: 'Scheduled',
      date: { $gte: new Date() }
    })
      .populate(POPULATE)
      .sort({ date: 1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: matches.length,
      matches: await enrichWithScorecard(attachLive(matches))
    });
  } catch (error) {
    console.error('Get upcoming matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching upcoming matches'
    });
  }
};

export const getMatchLive = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate(POPULATE);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    const isLive = match.status === 'Live' || match.live?.inProgress;
    res.status(200).json({
      success: true,
      live: isLive,
      match: (await enrichWithScorecard(attachLive([match])))[0]
    });
  } catch (error) {
    console.error('Get match live error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching match live data'
    });
  }
};

export const createMatch = async (req, res) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Match created successfully',
      match
    });
  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating match'
    });
  }
};

export const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate(POPULATE);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Match updated successfully',
      match
    });
  } catch (error) {
    console.error('Update match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating match'
    });
  }
};

export const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Match deleted successfully'
    });
  } catch (error) {
    console.error('Delete match error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting match'
    });
  }
};
