/**
 * Bundles the backend's full dataset into frontend data modules so the
 * static GitHub Pages build is self-sufficient (no API, no database needed).
 *
 * Outputs:
 *   frontend/src/data/player-catalog.js  — all 340 players, photos, teams
 *   frontend/src/data/site-content.js    — teams, news, quiz, records, streams
 *
 * Run:  node scripts/build-static-data.mjs
 */
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BACKEND_DATA = join(ROOT, 'backend', 'data');

// ---------------------------------------------------------------------------
// Temp-module compiler: extracted literals use new Date(...) etc., so we write
// them to a temp file and import them as real modules.
// ---------------------------------------------------------------------------
const tmp = mkdtempSync(join('/tmp', 'clh-data-'));
const compileModule = async (name, body) => {
  const file = join(tmp, `${name}.mjs`);
  writeFileSync(file, body);
  return import(pathToFileURL(file).href + `?t=${Date.now()}`);
};
const evalModule = async (name, text, fixups = []) => {
  let body = text;
  for (const [re, sub] of fixups) body = body.replace(re, sub);
  const mod = await compileModule(name, `export default ${body};`);
  return mod.default;
};

// ---------------------------------------------------------------------------
// Extract `await X.insertMany([...])` array literals from the seed file.
// ---------------------------------------------------------------------------
const seedSrc = readFileSync(join(ROOT, 'backend', 'seed.js'), 'utf8');
function extractInsertMany(name) {
  const start = seedSrc.indexOf(`await ${name}.insertMany(`);
  if (start === -1) throw new Error(`insertMany for ${name} not found`);
  const bracket = seedSrc.indexOf('[', start);
  let depth = 0;
  let inStr = false;
  let esc = false;
  let end = -1;
  for (let i = bracket; i < seedSrc.length; i++) {
    const c = seedSrc[i];
    if (esc) { esc = false; continue; }
    if (c === '\\' && inStr) { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === '[') depth++;
    else if (c === ']') {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }
  if (end === -1) throw new Error(`could not balance array for ${name}`);
  return seedSrc.slice(bracket, end);
}

// ---------------------------------------------------------------------------
// Players + photo cache
// ---------------------------------------------------------------------------
const { ALL_PLAYERS, TEAM_SQUADS, LEGEND_PLAYER_NAMES } = await import(
  pathToFileURL(join(BACKEND_DATA, 'players.js')).href
);
const photoCache = JSON.parse(readFileSync(join(BACKEND_DATA, '.photo-cache.json'), 'utf8'));

const slug = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const SHORT_NAMES = {
  India: 'IND', Australia: 'AUS', England: 'ENG', Pakistan: 'PAK', 'New Zealand': 'NZ',
  'South Africa': 'SA', 'Sri Lanka': 'SL', 'West Indies': 'WI', Afghanistan: 'AFG',
  Bangladesh: 'BAN', Zimbabwe: 'ZIM', Ireland: 'IRE', Scotland: 'SCO', Netherlands: 'NED',
  UAE: 'UAE', Nepal: 'NEP', USA: 'USA', Canada: 'CAN', Namibia: 'NAM', Oman: 'OMA',
  'India Women': 'IND-W', 'Australia Women': 'AUS-W', 'England Women': 'ENG-W',
  'Pakistan Women': 'PAK-W', 'New Zealand Women': 'NZ-W', 'South Africa Women': 'SA-W',
  'Sri Lanka Women': 'SL-W', 'West Indies Women': 'WI-W', 'Bangladesh Women': 'BAN-W',
};

const CAPTAINS = {
  India: 'Rohit Sharma', Australia: 'Pat Cummins', England: 'Jos Buttler',
  Pakistan: 'Babar Azam', 'New Zealand': 'Mitchell Santner', 'South Africa': 'Temba Bavuma',
  'Sri Lanka': 'Charith Asalanka', 'West Indies': 'Jason Holder', Afghanistan: 'Rashid Khan',
  Bangladesh: 'Najmul Hossain Shanto', Zimbabwe: 'Craig Ervine', Ireland: 'Paul Stirling',
  Scotland: 'Richie Berrington', Netherlands: 'Scott Edwards', UAE: 'Muhammad Waseem',
  Nepal: 'Rohit Paudel', USA: 'Monank Patel', Canada: 'Saad Bin Zafar',
  Namibia: 'Gerhard Erasmus', Oman: 'Zeeshan Maqsood', 'India Women': 'Harmanpreet Kaur',
  'Australia Women': 'Alyssa Healy', 'England Women': 'Heather Knight',
  'New Zealand Women': 'Sophie Devine', 'South Africa Women': 'Laura Wolvaardt',
  'West Indies Women': 'Hayley Matthews', 'Bangladesh Women': 'Nigar Sultana',
};

const playerCatalog = ALL_PLAYERS.map((p) => {
  const key = slug(p.name);
  return {
    _id: key,
    id: key,
    name: p.name,
    fullName: p.fullName || p.name,
    nickName: p.nickName || '',
    country: p.country,
    role: p.role || 'Batsman',
    battingStyle: p.battingStyle || '',
    bowlingStyle: p.bowlingStyle || '',
    teams: p.teams && p.teams.length ? p.teams : [p.primaryTeam].filter(Boolean),
    rating: p.rating || 70,
    isLegend: !!(p.isLegend || LEGEND_PLAYER_NAMES.includes(p.name)),
    era: p.era || '',
    bio: p.bio || '',
    achievements: p.achievements || [],
    imageUrl: photoCache[p.name] || '',
    stats: p.stats || {},
  };
});
const byName = new Map(playerCatalog.map((p) => [p.name, p]));

// ---------------------------------------------------------------------------
// Merge curated frontend legends (SVG avatars + richest stats) and the seed's
// hardcoded stars (Rohit, Kane, Stokes, Babar…) so the archive has the big names.
// ---------------------------------------------------------------------------
// legends.js uses import.meta.env.BASE_URL, which plain node lacks — compile a
// temp copy with it stubbed; avatar paths are stored portably and re-prefixed
// at runtime in the generated module.
const legendsSrc = readFileSync(join(ROOT, 'frontend', 'src', 'data', 'legends.js'), 'utf8').replace(
  'import.meta.env.BASE_URL',
  `'/'`
);
const { LEGENDS } = await compileModule('legends', legendsSrc);
const normalizeLegend = (l) => {
  const key = slug(l.id || l.name);
  return {
    _id: key,
    id: key,
    name: l.name,
    fullName: l.fullName || l.name,
    nickName: l.nickName || '',
    country: l.country,
    role: l.role || 'Batsman',
    battingStyle: l.battingStyle || '',
    bowlingStyle: l.bowlingStyle || '',
    teams: l.teams && l.teams.length ? l.teams : [l.country].filter(Boolean),
    rating: l.rating || 90,
    isLegend: true,
    era: l.era || '',
    bio: l.bio || '',
    achievements: l.awards || l.achievements || [],
    imageUrl: (l.image || '').replace(/^\/+/g, ''), // portable path, prefixed at runtime
    stats: l.stats || {},
  };
};
for (const l of LEGENDS) {
  byName.set(l.name, normalizeLegend(l));
}
const seedPlayers = await evalModule('seed-players', extractInsertMany('Player'));
for (const p of seedPlayers) {
  if (!p?.name) continue;
  if (!byName.has(p.name)) {
    byName.set(p.name, {
      ...p,
      _id: slug(p.name),
      id: slug(p.name),
      name: p.name,
      fullName: p.fullName || p.name,
      nickName: p.nickName || '',
      isLegend: !!p.isLegend,
      rating: p.rating || 75,
      era: p.era || '',
      bio: p.bio || '',
      achievements: p.achievements || [],
      imageUrl: photoCache[p.name] || '',
    });
  }
}
const catalog = [...byName.values()];

// ---------------------------------------------------------------------------
// Teams
// ---------------------------------------------------------------------------
const teams = Object.entries(TEAM_SQUADS)
  .map(([name, players]) => {
    const top = [...players].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
    const captainName = CAPTAINS[name] || top?.name || '';
    return {
      name,
      shortName: SHORT_NAMES[name] || name.slice(0, 3).toUpperCase(),
      country: name.replace(' Women', ''),
      type: / Women/.test(name) ? 'Women' : 'National',
      captain: captainName ? { name: captainName } : undefined,
      playerCount: players.length,
    };
  })
  .sort((a, b) => {
    const order = Object.keys(SHORT_NAMES);
    return order.indexOf(a.name) - order.indexOf(b.name);
  });

// ---------------------------------------------------------------------------
// News / quiz / records / streams
// ---------------------------------------------------------------------------
try {
  var NEWS = await evalModule('news', extractInsertMany('News'));
  var QUIZ_QUESTIONS = await evalModule('quiz', extractInsertMany('QuizQuestion'));
  var RECORDS = await evalModule('records', extractInsertMany('Record'));
  var STREAMS = await evalModule('streams', extractInsertMany('Stream'), [
    [/(?:liveIndEng|liveAusNz|liveWomen)\._id/g, 'null'],
  ]);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

// ---------------------------------------------------------------------------
// Write frontend data modules
// ---------------------------------------------------------------------------
const writeModule = (rel, header, exportsObj) => {
  const lines = [header, ''];
  for (const [key, value] of Object.entries(exportsObj)) {
    lines.push(`export const ${key} = ${JSON.stringify(value, null, 1)};`);
    lines.push('');
  }
  writeFileSync(join(ROOT, rel), lines.join('\n'));
  console.log(`wrote ${rel} (${(Buffer.byteLength(lines.join('\n')) / 1024).toFixed(0)} KB)`);
};

const catalogHeader = `
/**
 * GENERATED by scripts/build-static-data.mjs — do not edit by hand.
 * Full player archive (${catalog.length} players / ${teams.length}+ nations) with real
 * Wikipedia photos, bundled so the static GitHub Pages build works without the API.
 */
const BASE = import.meta.env.BASE_URL || '/'
`;

writeModule('frontend/src/data/player-catalog.js', catalogHeader, {
  PLAYER_CATALOG: catalog,
  TEAMS: teams,
});

// Legend avatars are stored as portable relative paths ('legends/x.svg');
// resolve them against the runtime base AFTER the constants are declared.
const catalogPath = join(ROOT, 'frontend', 'src', 'data', 'player-catalog.js');
writeFileSync(
  catalogPath,
  readFileSync(catalogPath, 'utf8').replace(
    'export const TEAMS',
    'PLAYER_CATALOG.forEach((p) => {\n  if (p.imageUrl && p.imageUrl.startsWith("legends/")) {\n    p.imageUrl = BASE + p.imageUrl\n  }\n})\n\nexport const TEAMS'
  )
);

writeModule(
  'frontend/src/data/site-content.js',
  `/**
 * GENERATED by scripts/build-static-data.mjs — do not edit by hand.
 * News, quiz, records and streaming data bundled for the static build.
 */
`,
  { NEWS, QUIZ_QUESTIONS, RECORDS, STREAMS }
);

console.log(
  `\nDone: ${catalog.length} players, ${teams.length} teams, ${NEWS.length} news, ${QUIZ_QUESTIONS.length} quiz, ${RECORDS.length} records, ${STREAMS.length} streams`
);
