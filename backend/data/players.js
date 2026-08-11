/**
 * Player catalog — merged from squads-a/b/c. Exports the flat player list,
 * per-team squads, and the legend name set used to mark curated legends.
 */
import { SQUADS_A } from './squads-a.js';
import { SQUADS_B } from './squads-b.js';
import { SQUADS_C } from './squads-c.js';
import { SQUADS_D } from './squads-d.js';
import { SQUADS_E } from './squads-e.js';

// Merge per-team so legends (E) and associates (D) append to existing squads
// instead of overwriting same-named teams.
const mergeSquads = (...parts) => {
  const out = {};
  for (const part of parts) {
    for (const [team, players] of Object.entries(part)) {
      out[team] = [...(out[team] || []), ...players];
    }
  }
  return out;
};

export const TEAM_SQUADS = mergeSquads(SQUADS_A, SQUADS_B, SQUADS_C, SQUADS_D, SQUADS_E);

export const ALL_PLAYERS = Object.entries(TEAM_SQUADS).flatMap(([team, players]) =>
  players.map((p) => ({ ...p, primaryTeam: team }))
);

/** Curated legends (already present in the frontend catalog). */
export const LEGEND_PLAYER_NAMES = [
  'Sachin Tendulkar',
  'Don Bradman',
  'Shane Warne',
  'Muttiah Muralitharan',
  'Jacques Kallis',
  'Virat Kohli',
  'Brian Lara',
  'MS Dhoni',
  'Wasim Akram',
  'Ricky Ponting',
  'Imran Khan',
  'Glenn McGrath',
  'Kumar Sangakkara',
  'Kapil Dev',
  'AB de Villiers',
  'Adam Gilchrist',
  'Jasprit Bumrah',
  'Ellyse Perry',
  'Mithali Raj',
  'Smriti Mandhana',
  'Meg Lanning',
  'Yuvraj Singh',
];
