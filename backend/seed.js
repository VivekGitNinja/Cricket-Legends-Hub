import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Player from './models/Player.js';
import Team from './models/Team.js';
import Match from './models/Match.js';
import User from './models/User.js';
import News from './models/News.js';
import Stream from './models/Stream.js';
import QuizQuestion from './models/QuizQuestion.js';
import QuizAttempt from './models/QuizAttempt.js';
import Record from './models/Record.js';
import { ALL_PLAYERS, LEGEND_PLAYER_NAMES } from './data/players.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await Promise.all([
      Player.deleteMany({}),
      Team.deleteMany({}),
      Match.deleteMany({}),
      User.deleteMany({}),
      News.deleteMany({}),
      Stream.deleteMany({}),
      QuizQuestion.deleteMany({}),
      QuizAttempt.deleteMany({}),
      Record.deleteMany({}),
    ]);

    console.log('Cleared existing data');

    // Create admin user (password hashed by pre-save hook)
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@cricketlegends.com',
      password: 'admin123',
      role: 'admin',
    });

    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@cricketlegends.com',
      password: 'demo123',
      role: 'user',
    });

    console.log('Users created:', admin.email, demoUser.email);

    const players = await Player.insertMany([
      {
        name: 'Virat Kohli',
        fullName: 'Virat Kohli',
        nickName: 'King Kohli',
        country: 'India',
        role: 'Batsman',
        battingStyle: 'Right-hand bat',
        bowlingStyle: 'Right-arm medium',
        isLegend: true,
        rating: 95,
        format: 'All',
        teams: ['India', 'RCB'],
        stats: {
          test: { matches: 113, runs: 8848, average: 49.15 },
          odi: { matches: 292, runs: 13848, average: 58.67 },
          t20: { matches: 117, runs: 4037, average: 51.75 },
        },
        achievements: ['ICC Cricketer of the Decade', 'Most ODI centuries'],
      },
      {
        name: 'Rohit Sharma',
        fullName: 'Rohit Gurunath Sharma',
        nickName: 'Hitman',
        country: 'India',
        role: 'Batsman',
        battingStyle: 'Right-hand bat',
        bowlingStyle: 'Right-arm offbreak',
        isLegend: true,
        rating: 92,
        format: 'All',
        teams: ['India', 'MI'],
        stats: {
          test: { matches: 56, runs: 3137, average: 44.81 },
          odi: { matches: 262, runs: 10709, average: 48.67 },
          t20: { matches: 151, runs: 3974, average: 31.29 },
        },
        achievements: ['Double centuries in ODIs', 'IPL winning captain'],
      },
      {
        name: 'MS Dhoni',
        fullName: 'Mahendra Singh Dhoni',
        nickName: 'Captain Cool',
        country: 'India',
        role: 'Wicket-keeper',
        battingStyle: 'Right-hand bat',
        bowlingStyle: 'Right-arm medium',
        isLegend: true,
        rating: 94,
        format: 'All',
        teams: ['India', 'CSK'],
        stats: {
          test: { matches: 90, runs: 4876, average: 38.09 },
          odi: { matches: 350, runs: 10773, average: 50.57 },
          t20: { matches: 98, runs: 1617, average: 37.6 },
        },
        achievements: ['World Cup winning captain', 'Most stumpings in international cricket'],
      },
      {
        name: 'Jasprit Bumrah',
        fullName: 'Jasprit Jasbirsingh Bumrah',
        nickName: 'Boom Boom',
        country: 'India',
        role: 'Bowler',
        battingStyle: 'Right-hand bat',
        bowlingStyle: 'Right-arm fast',
        isLegend: true,
        rating: 93,
        format: 'All',
        teams: ['India', 'MI'],
        stats: {
          test: { matches: 36, runs: 212, wickets: 159, average: 20.7 },
          odi: { matches: 89, runs: 91, wickets: 149, average: 23.55 },
          t20: { matches: 70, runs: 8, wickets: 89, average: 18.5 },
        },
        achievements: ['Best T20I economy rate', 'Yorkers specialist'],
      },
      {
        name: 'Ravindra Jadeja',
        fullName: 'Ravindrasinh Anirudhsinh Jadeja',
        nickName: 'Sir Jadeja',
        country: 'India',
        role: 'All-rounder',
        battingStyle: 'Left-hand bat',
        bowlingStyle: 'Left-arm orthodox',
        isLegend: true,
        rating: 90,
        format: 'All',
        teams: ['India', 'CSK'],
        stats: {
          test: { matches: 72, runs: 3036, wickets: 294, average: 25.0 },
          odi: { matches: 197, runs: 2756, wickets: 220, average: 32.0 },
          t20: { matches: 74, runs: 515, wickets: 54, average: 28.0 },
        },
        achievements: ['World No.1 all-rounder', 'Exceptional fielder'],
      },
      {
        name: 'Sachin Tendulkar',
        fullName: 'Sachin Ramesh Tendulkar',
        nickName: 'Master Blaster',
        country: 'India',
        role: 'Batsman',
        battingStyle: 'Right-hand bat',
        bowlingStyle: 'Right-arm medium / legbreak',
        isLegend: true,
        rating: 99,
        format: 'All',
        teams: ['India', 'MI'],
        stats: {
          test: { matches: 200, runs: 15921, average: 53.78 },
          odi: { matches: 463, runs: 18426, average: 44.83 },
          t20: { matches: 1, runs: 10, average: 10 },
        },
        achievements: ['100 international centuries', 'Most runs in international cricket'],
      },
      {
        name: 'Mithali Raj',
        fullName: 'Mithali Dorai Raj',
        nickName: 'Lady Tendulkar',
        country: 'India',
        role: 'Batsman',
        battingStyle: 'Right-hand bat',
        bowlingStyle: 'Right-arm legbreak',
        isLegend: true,
        rating: 91,
        format: 'All',
        teams: ['India Women'],
        stats: {
          test: { matches: 12, runs: 720, average: 51.43 },
          odi: { matches: 232, runs: 7805, average: 50.68 },
          t20: { matches: 89, runs: 2364, average: 37.52 },
        },
        achievements: ['Most runs in women\'s ODI history', 'Captain in 3 World Cup finals'],
      },
      {
        name: 'Ellyse Perry',
        fullName: 'Ellyse Alexandra Perry',
        nickName: 'Pez',
        country: 'Australia',
        role: 'All-rounder',
        battingStyle: 'Right-hand bat',
        bowlingStyle: 'Right-arm fast-medium',
        isLegend: true,
        rating: 92,
        format: 'All',
        teams: ['Australia Women'],
        stats: {
          test: { matches: 13, runs: 862, wickets: 38, average: 47.9 },
          odi: { matches: 146, runs: 3856, wickets: 172, average: 51.4 },
          t20: { matches: 145, runs: 1685, wickets: 132, average: 28.0 },
        },
        achievements: ['1,000+ runs and 100+ wickets in T20Is', 'Multiple World Cup winner'],
      },
      {
        name: 'Smriti Mandhana',
        fullName: 'Smriti Shriniwas Mandhana',
        nickName: 'Smriti',
        country: 'India',
        role: 'Batsman',
        battingStyle: 'Left-hand bat',
        bowlingStyle: 'Right-arm offbreak',
        isLegend: true,
        rating: 89,
        format: 'All',
        teams: ['India Women'],
        stats: {
          test: { matches: 8, runs: 549, average: 42.23 },
          odi: { matches: 90, runs: 3516, average: 43.4 },
          t20: { matches: 138, runs: 3382, average: 27.7 },
        },
        achievements: ['ICC Women\'s Cricketer of the Year 2021', 'Fastest women\'s ODI fifty for India'],
      },
      {
        name: 'Ben Stokes',
        fullName: 'Benjamin Andrew Stokes',
        nickName: 'Stokesy',
        country: 'England',
        role: 'All-rounder',
        battingStyle: 'Left-hand bat',
        bowlingStyle: 'Right-arm fast-medium',
        isLegend: true,
        rating: 91,
        format: 'All',
        teams: ['England'],
        stats: {
          test: { matches: 102, runs: 6519, wickets: 197, average: 36.9 },
          odi: { matches: 114, runs: 3539, wickets: 28, average: 39.3 },
          t20: { matches: 43, runs: 585, wickets: 26, average: 22.5 },
        },
        achievements: ['2019 World Cup final hero', 'ICC Test Cricketer of the Year 2019'],
      },
      {
        name: 'Kane Williamson',
        fullName: 'Kane Stuart Williamson',
        nickName: 'Kane',
        country: 'New Zealand',
        role: 'Batsman',
        battingStyle: 'Right-hand bat',
        bowlingStyle: 'Right-arm offbreak',
        isLegend: true,
        rating: 92,
        format: 'All',
        teams: ['New Zealand'],
        stats: {
          test: { matches: 100, runs: 8743, average: 54.8 },
          odi: { matches: 165, runs: 6810, average: 47.9 },
          t20: { matches: 92, runs: 2464, average: 33.2 },
        },
        achievements: ['World Test Championship winning captain', 'Most Test runs for New Zealand'],
      },
      {
        name: 'Babar Azam',
        fullName: 'Mohammad Babar Azam',
        nickName: 'Bobby',
        country: 'Pakistan',
        role: 'Batsman',
        battingStyle: 'Right-hand bat',
        bowlingStyle: 'Right-arm offbreak',
        isLegend: true,
        rating: 90,
        format: 'All',
        teams: ['Pakistan'],
        stats: {
          test: { matches: 52, runs: 3913, average: 43.0 },
          odi: { matches: 117, runs: 5729, average: 56.7 },
          t20: { matches: 120, runs: 4145, average: 41.0 },
        },
        achievements: ['Fastest to 5,000 ODI runs', 'No.1 ranked ODI batter'],
      },
      {
        name: 'Rashid Khan',
        fullName: 'Rashid Khan Arman',
        nickName: 'Rash',
        country: 'Afghanistan',
        role: 'Bowler',
        battingStyle: 'Right-hand bat',
        bowlingStyle: 'Right-arm legbreak googly',
        isLegend: true,
        rating: 91,
        format: 'All',
        teams: ['Afghanistan'],
        stats: {
          test: { matches: 5, runs: 106, wickets: 34, average: 22.4 },
          odi: { matches: 105, runs: 1890, wickets: 187, average: 18.8 },
          t20: { matches: 86, runs: 550, wickets: 135, average: 12.6 },
        },
        achievements: ['Fastest to 100 ODI wickets', 'Most T20I wickets for Afghanistan'],
      },
      {
        name: 'Shakib Al Hasan',
        fullName: 'Shakib Al Hasan',
        nickName: 'Shakib',
        country: 'Bangladesh',
        role: 'All-rounder',
        battingStyle: 'Left-hand bat',
        bowlingStyle: 'Left-arm orthodox',
        isLegend: true,
        rating: 90,
        format: 'All',
        teams: ['Bangladesh'],
        stats: {
          test: { matches: 68, runs: 4529, wickets: 237, average: 39.0 },
          odi: { matches: 247, runs: 7570, wickets: 317, average: 37.3 },
          t20: { matches: 129, runs: 2551, wickets: 149, average: 23.0 },
        },
        achievements: ['No.1 all-rounder in all formats', 'First player to 4,000 runs and 300 wickets in ODIs'],
      },
    ]);

    console.log(`Created ${players.length} legend players`);

    // ----------------------------------------------------------------
    // Full player catalog — every country's squad (photos resolved below)
    // ----------------------------------------------------------------
    const EXISTING_LEGEND_NAMES = players.map((p) => p.name);
    const seenNames = new Set(EXISTING_LEGEND_NAMES);
    const catalogPlayers = await Player.insertMany(
      ALL_PLAYERS.filter((p) => {
        if (EXISTING_LEGEND_NAMES.includes(p.name) || seenNames.has(p.name)) return false;
        seenNames.add(p.name);
        return true;
      }).map((p) => ({
        ...p,
        isLegend: Boolean(p.isLegend) || LEGEND_PLAYER_NAMES.includes(p.name)
      }))
    );
    console.log(`Created ${catalogPlayers.length} catalog players`);

    // Resolve real photos from Wikipedia (MediaWiki API — higher rate limit than the
    // REST summary endpoint). Results are cached on disk so re-seeds are instant.
    const PHOTO_CACHE = new URL('./data/.photo-cache.json', import.meta.url);
    const { readFileSync, writeFileSync, existsSync } = await import('fs');
    const diskCache = existsSync(PHOTO_CACHE)
      ? JSON.parse(readFileSync(PHOTO_CACHE, 'utf8'))
      : {};
    const enrichWithPhotos = async (docs) => {
      let index = 0;
      const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
      const worker = async () => {
        while (index < docs.length) {
          const p = docs[index++];
          if (diskCache[p.name]) {
            await Player.findByIdAndUpdate(p._id, { imageUrl: diskCache[p.name] });
            continue;
          }
          const title = p.name.replace(/\s+/g, '_');
          for (let attempt = 0; attempt < 4; attempt++) {
            const ctrl = new AbortController();
            const t = setTimeout(() => ctrl.abort(), 8000);
            try {
              const url =
                `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}?redirect=true`;
              const res = await fetch(url, { signal: ctrl.signal });
              if (res.status === 429 || res.status >= 500) {
                await sleep(1400 * (attempt + 1));
                continue;
              }
              if (!res.ok) break;
              const json = await res.json();
              const src = json?.thumbnail?.source;
              if (src) {
                diskCache[p.name] = src.split('?')[0];
                await Player.findByIdAndUpdate(p._id, { imageUrl: src.split('?')[0] });
              }
              break;
            } catch {
              await sleep(600);
            } finally {
              clearTimeout(t);
            }
          }
          await sleep(90);
        }
      };
      await Promise.all(Array.from({ length: 6 }, worker));
      try {
        writeFileSync(PHOTO_CACHE, JSON.stringify(diskCache, null, 2));
      } catch (e) {
        /* cache optional */
      }
    };

    const allPlayerDocs = [...players, ...catalogPlayers];
    await enrichWithPhotos(allPlayerDocs);
    const withPhotos = await Player.countDocuments({ imageUrl: { $exists: true, $ne: '' } });
    console.log(`Photos resolved for ${withPhotos}/${allPlayerDocs.length} players`);

    const byName = new Map(allPlayerDocs.map((p) => [p.name, p]));
    const teamByName = (name) => byName.get(name);

    const teams = await Team.insertMany([
      {
        name: 'India',
        shortName: 'IND',
        country: 'India',
        type: 'National',
        founded: 1932,
        captain: players[1]._id,
        players: players.map(p => p._id),
        stats: { matchesPlayed: 1000, matchesWon: 520, matchesLost: 400, winPercentage: 52 },
        description: 'The Men in Blue - one of the most successful cricket teams in the world.',
      },
      {
        name: 'Mumbai Indians',
        shortName: 'MI',
        country: 'India',
        type: 'Franchise',
        founded: 2008,
        players: [players[1]._id, players[3]._id, players[5]._id],
        stats: { matchesPlayed: 250, matchesWon: 140, matchesLost: 110, winPercentage: 56 },
        description: 'Most successful IPL franchise with 5 titles.',
      },
      {
        name: 'Chennai Super Kings',
        shortName: 'CSK',
        country: 'India',
        type: 'Franchise',
        founded: 2008,
        captain: players[2]._id,
        players: [players[2]._id, players[4]._id],
        stats: { matchesPlayed: 240, matchesWon: 138, matchesLost: 100, winPercentage: 57.5 },
        description: 'Yellow Army - 5-time IPL champions led by MS Dhoni.',
      },
      {
        name: 'Royal Challengers Bangalore',
        shortName: 'RCB',
        country: 'India',
        type: 'Franchise',
        founded: 2008,
        captain: players[0]._id,
        players: [players[0]._id],
        stats: { matchesPlayed: 240, matchesWon: 120, matchesLost: 120, winPercentage: 50 },
        description: 'Play Bold - home of Virat Kohli and passionate fans.',
      },
      {
        name: 'Australia',
        shortName: 'AUS',
        country: 'Australia',
        type: 'National',
        founded: 1877,
        stats: { matchesPlayed: 900, matchesWon: 500, matchesLost: 350, winPercentage: 55.5 },
        description: 'Most successful Test cricket nation.',
      },
      {
        name: 'England',
        shortName: 'ENG',
        country: 'England',
        type: 'National',
        founded: 1877,
        captain: players[9]._id,
        players: [players[9]._id],
        stats: { matchesPlayed: 850, matchesWon: 400, matchesLost: 380, winPercentage: 47 },
        description: 'The birthplace of cricket.',
      },
      {
        name: 'Pakistan',
        shortName: 'PAK',
        country: 'Pakistan',
        type: 'National',
        founded: 1952,
        captain: players[11]._id,
        players: [players[11]._id],
        stats: { matchesPlayed: 450, matchesWon: 200, matchesLost: 200, winPercentage: 44.4 },
        description: 'The Men in Green - 2009 T20 World Cup champions.',
      },
      {
        name: 'New Zealand',
        shortName: 'NZ',
        country: 'New Zealand',
        type: 'National',
        founded: 1930,
        captain: players[10]._id,
        players: [players[10]._id],
        stats: { matchesPlayed: 500, matchesWon: 200, matchesLost: 220, winPercentage: 40 },
        description: 'The Black Caps - World Test Championship winners 2021.',
      },
      {
        name: 'Afghanistan',
        shortName: 'AFG',
        country: 'Afghanistan',
        type: 'National',
        founded: 2001,
        captain: players[12]._id,
        players: [players[12]._id],
        stats: { matchesPlayed: 100, matchesWon: 40, matchesLost: 55, winPercentage: 40 },
        description: 'The rising force of world cricket.',
      },
      {
        name: 'Bangladesh',
        shortName: 'BAN',
        country: 'Bangladesh',
        type: 'National',
        founded: 1971,
        captain: players[13]._id,
        players: [players[13]._id],
        stats: { matchesPlayed: 400, matchesWon: 140, matchesLost: 230, winPercentage: 35 },
        description: 'The Tigers - a fearless modern Test side.',
      },
      {
        name: 'India Women',
        shortName: 'IND-W',
        country: 'India',
        type: 'National',
        founded: 1976,
        captain: players[6]._id,
        players: [players[6]._id, players[8]._id],
        stats: { matchesPlayed: 250, matchesWon: 140, matchesLost: 100, winPercentage: 56 },
        description: 'Led by Mithali Raj - three-time World Cup finalists.',
      },
      {
        name: 'Australia Women',
        shortName: 'AUS-W',
        country: 'Australia',
        type: 'National',
        founded: 1934,
        captain: players[7]._id,
        players: [players[7]._id],
        stats: { matchesPlayed: 300, matchesWon: 200, matchesLost: 90, winPercentage: 66.7 },
        description: 'The Southern Stars - the most dominant side in women\'s cricket.',
      },
      {
        name: 'Sri Lanka',
        shortName: 'SL',
        country: 'Sri Lanka',
        type: 'National',
        founded: 1981,
        stats: { matchesPlayed: 500, matchesWon: 180, matchesLost: 270, winPercentage: 36 },
        description: 'The Lions - 1996 World Cup champions.',
      },
    ]);

    console.log(`Created ${teams.length} teams`);

    // ----------------------------------------------------------------
    // Wire full squads, captains, and current teams for the catalog
    // ----------------------------------------------------------------
    const refs = (...names) => names.map((n) => byName.get(n)).filter(Boolean).map((p) => p._id);
    const squadNames = (teamKey) =>
      ALL_PLAYERS.filter((p) => p.primaryTeam === teamKey || (p.teams || []).includes(teamKey)).map((p) => p.name);
    const addSquad = async (teamName, extraNames = []) => {
      const team = teams.find((t) => t.name === teamName);
      if (!team) return;
      const ids = refs(...squadNames(teamName), ...extraNames);
      if (ids.length) {
        await Team.findByIdAndUpdate(team._id, { $addToSet: { players: { $each: ids } } });
      }
    };
    const setCaptain = async (teamName, captainName) => {
      const team = teams.find((t) => t.name === teamName);
      const captain = byName.get(captainName);
      if (team && captain) await Team.findByIdAndUpdate(team._id, { captain: captain._id });
    };

    // National squads from the catalog
    await addSquad('India', ['Rohit Sharma', 'Virat Kohli', 'MS Dhoni', 'Sachin Tendulkar', 'Jasprit Bumrah', 'Ravindra Jadeja']);
    await addSquad('Australia', ['Steve Smith', 'Pat Cummins', 'Glenn Maxwell', 'David Warner', 'Mitchell Starc']);
    await addSquad('England', ['Joe Root', 'Jos Buttler', 'Ben Stokes']);
    await addSquad('Pakistan', ['Babar Azam', 'Shaheen Afridi', 'Mohammad Rizwan']);
    await addSquad('New Zealand', ['Kane Williamson', 'Trent Boult', 'Tim Southee']);
    await addSquad('Sri Lanka', ['Wanindu Hasaranga', 'Angelo Mathews', 'Kusal Mendis']);
    await addSquad('Afghanistan', ['Rashid Khan', 'Mohammad Nabi']);
    await addSquad('Bangladesh', ['Shakib Al Hasan', 'Mushfiqur Rahim', 'Mustafizur Rahman']);
    await addSquad('India Women', ['Mithali Raj', 'Smriti Mandhana', 'Harmanpreet Kaur', 'Deepti Sharma', 'Shafali Verma']);
    await addSquad('Australia Women', ['Ellyse Perry', 'Meg Lanning', 'Alyssa Healy', 'Beth Mooney', 'Ashleigh Gardner']);
    // Franchise squads
    await addSquad('Mumbai Indians', ['Rohit Sharma', 'Jasprit Bumrah', 'Sachin Tendulkar', 'Hardik Pandya', 'Suryakumar Yadav', 'Kieron Pollard']);
    await addSquad('Chennai Super Kings', ['MS Dhoni', 'Ravindra Jadeja', 'Dwayne Bravo', 'Mustafizur Rahman']);
    await addSquad('Royal Challengers Bangalore', ['Virat Kohli']);

    // New national teams from the catalog
    const saTeam = await Team.create({
      name: 'South Africa', shortName: 'SA', country: 'South Africa', type: 'National', founded: 1889,
      stats: { matchesPlayed: 480, matchesWon: 250, matchesLost: 190, winPercentage: 52 },
      description: 'The Proteas - feared fast bowlers and the eternal bridesmaids of world cricket.'
    });
    const wiTeam = await Team.create({
      name: 'West Indies', shortName: 'WI', country: 'West Indies', type: 'National', founded: 1928,
      stats: { matchesPlayed: 560, matchesWon: 220, matchesLost: 230, winPercentage: 39 },
      description: 'Two-time World Cup champions and the spiritual home of Caribbean flair.'
    });
    teams.push(saTeam, wiTeam);
    await Team.findByIdAndUpdate(saTeam._id, { $addToSet: { players: { $each: refs(...squadNames('South Africa')) } } });
    await Team.findByIdAndUpdate(wiTeam._id, { $addToSet: { players: { $each: refs(...squadNames('West Indies')) } } });

    // Remaining international nations + Associate squads
    const associateTeams = await Team.insertMany([
      ['Zimbabwe', 'ZIM', 'Zimbabwe', 1983, 'Craig Ervine', 'The Chevrons — World Cup regulars from Southern Africa.'],
      ['Ireland', 'IRE', 'Ireland', 1993, 'Paul Stirling', 'The Green Machine — giant-killers at three World Cups.'],
      ['Scotland', 'SCO', 'Scotland', 1994, 'Richie Berrington', 'The Saltires — the rising force of European cricket.'],
      ['Netherlands', 'NED', 'Netherlands', 1996, 'Scott Edwards', 'The Flying Dutchmen — World Cup giant-killers in 2023.'],
      ['UAE', 'UAE', 'United Arab Emirates', 1994, 'Muhammad Waseem', 'The Emirates — Asia Cup regulars from the Gulf.'],
      ['Nepal', 'NEP', 'Nepal', 1996, 'Rohit Paudel', 'The Rhinos — the fastest-growing cricket nation on earth.'],
      ['USA', 'USA', 'United States', 1965, 'Monank Patel', 'The Eagles — co-hosts and giant-killers of the T20 World Cup 2024.'],
      ['Canada', 'CAN', 'Canada', 1968, 'Saad Bin Zafar', 'The Maple Leafs — North America\'s oldest cricket nation.'],
      ['Namibia', 'NAM', 'Namibia', 1996, 'Gerhard Erasmus', 'The Eagles — back-to-back T20 World Cup qualifiers.'],
      ['Oman', 'OMA', 'Oman', 2000, 'Zeeshan Maqsood', 'The Sultans — Gulf giants of the Associate game.'],
    ].map(([name, shortName, country, founded, captainName, description]) => ({
      name, shortName, country, type: 'National', founded,
      stats: { matchesPlayed: 150, matchesWon: 60, matchesLost: 75, winPercentage: 40 },
      description,
      _captainName: captainName
    })));
    teams.push(...associateTeams);
    for (const t of associateTeams) {
      await Team.findByIdAndUpdate(t._id, { $addToSet: { players: { $each: refs(...squadNames(t.name)) } } });
      await setCaptain(t.name, t._captainName);
    }

    // Captains
    await setCaptain('India', 'Rohit Sharma');
    await setCaptain('Australia', 'Pat Cummins');
    await setCaptain('England', 'Jos Buttler');
    await setCaptain('Pakistan', 'Babar Azam');
    await setCaptain('New Zealand', 'Kane Williamson');
    await setCaptain('Sri Lanka', 'Charith Asalanka');
    await setCaptain('Afghanistan', 'Rashid Khan');
    await setCaptain('Bangladesh', 'Najmul Hossain Shanto');
    await setCaptain('South Africa', 'Temba Bavuma');
    await setCaptain('West Indies', 'Shai Hope');
    await setCaptain('India Women', 'Harmanpreet Kaur');
    await setCaptain('Australia Women', 'Alyssa Healy');
    await setCaptain('Mumbai Indians', 'Hardik Pandya');
    await setCaptain('Chennai Super Kings', 'MS Dhoni');
    await setCaptain('Royal Challengers Bangalore', 'Virat Kohli');

    // Link currentTeam on marquee players
    const linkTeam = async (playerName, teamName) => {
      const p = byName.get(playerName);
      const t = teams.find((x) => x.name === teamName);
      if (p && t) await Player.findByIdAndUpdate(p._id, { currentTeam: t._id });
    };
    await Promise.all([
      linkTeam('Rohit Sharma', 'Mumbai Indians'),
      linkTeam('Virat Kohli', 'Royal Challengers Bangalore'),
      linkTeam('MS Dhoni', 'Chennai Super Kings'),
      linkTeam('Jasprit Bumrah', 'Mumbai Indians'),
      linkTeam('Ravindra Jadeja', 'Chennai Super Kings'),
      linkTeam('Sachin Tendulkar', 'Mumbai Indians'),
      linkTeam('Hardik Pandya', 'Mumbai Indians'),
      linkTeam('Suryakumar Yadav', 'Mumbai Indians'),
      linkTeam('Kieron Pollard', 'Mumbai Indians'),
      linkTeam('Dwayne Bravo', 'Chennai Super Kings'),
      linkTeam('Mustafizur Rahman', 'Chennai Super Kings'),
      linkTeam('Mithali Raj', 'India Women'),
      linkTeam('Smriti Mandhana', 'India Women'),
      linkTeam('Meg Lanning', 'Australia Women'),
      linkTeam('Ellyse Perry', 'Australia Women'),
      linkTeam('Harmanpreet Kaur', 'India Women'),
      linkTeam('Ben Stokes', 'England'),
      linkTeam('Kane Williamson', 'New Zealand'),
      linkTeam('Babar Azam', 'Pakistan'),
      linkTeam('Rashid Khan', 'Afghanistan'),
      linkTeam('Shakib Al Hasan', 'Bangladesh')
    ]);

    const matches = await Match.insertMany([
      {
        team1: teams[1]._id,
        team2: teams[2]._id,
        format: 'IPL',
        venue: { name: 'Wankhede Stadium', city: 'Mumbai', country: 'India', capacity: 33108 },
        date: new Date('2024-03-22'),
        status: 'Completed',
        result: { winner: teams[2]._id, margin: '6', marginType: 'wickets' },
        scores: [
          { team: teams[1]._id, runs: 186, wickets: 6, overs: 20 },
          { team: teams[2]._id, runs: 190, wickets: 4, overs: 19.2 },
        ],
        manOfTheMatch: players[2]._id,
        tossWinner: teams[1]._id,
        tossDecision: 'bat',
        series: 'IPL 2024',
      },
      {
        team1: teams[3]._id,
        team2: teams[0]._id,
        format: 'T20',
        venue: { name: 'M. Chinnaswamy Stadium', city: 'Bangalore', country: 'India', capacity: 40000 },
        date: new Date('2024-04-10'),
        status: 'Completed',
        result: { winner: teams[0]._id, margin: '45', marginType: 'runs' },
        scores: [
          { team: teams[0]._id, runs: 210, wickets: 5, overs: 20 },
          { team: teams[3]._id, runs: 165, wickets: 9, overs: 20 },
        ],
        manOfTheMatch: players[0]._id,
        series: 'IPL 2024',
      },
      {
        team1: teams[0]._id,
        team2: teams[4]._id,
        format: 'ODI',
        venue: { name: 'MCG', city: 'Melbourne', country: 'Australia', capacity: 100024 },
        date: new Date('2023-11-19'),
        status: 'Completed',
        result: { winner: teams[0]._id, margin: '6', marginType: 'wickets' },
        scores: [
          { team: teams[4]._id, runs: 240, wickets: 10, overs: 50 },
          { team: teams[0]._id, runs: 241, wickets: 4, overs: 43 },
        ],
        manOfTheMatch: players[0]._id,
        series: 'World Cup 2023',
      },
      {
        team1: teams[0]._id,
        team2: teams[12]._id,
        format: 'ODI',
        venue: { name: 'Wankhede Stadium', city: 'Mumbai', country: 'India', capacity: 33108 },
        date: new Date('2011-04-02'),
        status: 'Completed',
        result: { winner: teams[0]._id, margin: '6', marginType: 'wickets' },
        scores: [
          { team: teams[12]._id, runs: 274, wickets: 6, overs: 50 },
          { team: teams[0]._id, runs: 277, wickets: 4, overs: 48.2 },
        ],
        manOfTheMatch: players[2]._id,
        tossWinner: teams[12]._id,
        tossDecision: 'bat',
        series: 'World Cup 2011',
      },
      {
        team1: teams[0]._id,
        team2: teams[6]._id,
        format: 'T20',
        venue: { name: 'Nassau County Stadium', city: 'New York', country: 'USA', capacity: 34000 },
        date: new Date('2024-06-09'),
        status: 'Completed',
        result: { winner: teams[0]._id, margin: '6', marginType: 'runs' },
        scores: [
          { team: teams[0]._id, runs: 119, wickets: 9, overs: 20 },
          { team: teams[6]._id, runs: 113, wickets: 7, overs: 20 },
        ],
        manOfTheMatch: players[3]._id,
        tossWinner: teams[6]._id,
        tossDecision: 'bowl',
        series: 'T20 World Cup 2024',
      },
      {
        team1: teams[10]._id,
        team2: teams[11]._id,
        format: 'ODI',
        venue: { name: 'Hagley Oval', city: 'Christchurch', country: 'New Zealand', capacity: 18000 },
        date: new Date('2022-03-26'),
        status: 'Completed',
        result: { winner: teams[11]._id, margin: '71', marginType: 'runs' },
        scores: [
          { team: teams[11]._id, runs: 249, wickets: 5, overs: 50 },
          { team: teams[10]._id, runs: 178, wickets: 10, overs: 44.3 },
        ],
        manOfTheMatch: players[7]._id,
        tossWinner: teams[10]._id,
        tossDecision: 'bowl',
        series: 'Women\'s World Cup 2022',
      },
      {
        team1: teams[0]._id,
        team2: teams[5]._id,
        format: 'T20',
        venue: { name: 'Wankhede Stadium', city: 'Mumbai', country: 'India', capacity: 33108 },
        date: new Date('2026-08-15'),
        status: 'Scheduled',
        series: 'Bilateral Series 2026',
      },
    ]);

    console.log(`Created ${matches.length} matches`);

    // ----------------------------------------------------------------
    // News feed
    // ----------------------------------------------------------------
    const news = await News.insertMany([
      {
        title: 'India storm into the final after a six-hitting masterclass',
        slug: 'india-storm-into-final',
        excerpt: 'A breathtaking chase at the Wankhede sealed India\u2019s place in the title decider as the top order fired in unison.',
        content: 'India produced their most complete performance of the tournament, overhauling a stiff target with more than four overs to spare. The middle order\u2019s aggressive intent set the tone early, and the bowlers backed it up with a disciplined death-over display.\n\nThe victory caps a remarkable run that has seen the side lose only once in the group stage. Captaincy, fielding and depth have all clicked at the right time, and the dressing room believes the best is yet to come.',
        category: 'Match',
        source: 'Cricket Legends Hub',
        author: 'Vivek K. Verma',
        tags: ['India', 'World Cup', 'Final'],
        featured: true,
        publishedAt: new Date(Date.now() - 2 * 3600e3)
      },
      {
        title: 'Bumrah reclaims the No.1 Test bowling ranking',
        slug: 'bumrah-number-one-test-bowler',
        excerpt: 'The yorker specialist\u2019s consistency across formats has been rewarded with the top spot on the ICC Test bowling charts.',
        content: 'Jasprit Bumrah\u2019s relentless accuracy and unique action have once again put him atop the Test bowling rankings. His economy across the recent series has been exceptional, and his ability to strike with both the new and old ball makes him the most feared paceman in the game.',
        category: 'ICC',
        source: 'Cricket Legends Hub',
        author: 'Editorial Desk',
        tags: ['ICC Rankings', 'Bumrah', 'Bowling'],
        featured: true,
        publishedAt: new Date(Date.now() - 7 * 3600e3)
      },
      {
        title: 'Mithali Raj honoured with lifetime achievement award',
        slug: 'mithali-raj-lifetime-achievement',
        excerpt: 'The trailblazing former captain becomes the first Indian woman to receive the honour at the global cricket awards.',
        content: 'Mithali Raj\u2019s contribution to women\u2019s cricket has been recognised with a lifetime achievement award. Her 7,805 ODI runs remain a world record, and her leadership transformed a generation of Indian cricketers.',
        category: 'Women',
        source: 'Cricket Legends Hub',
        author: 'Editorial Desk',
        tags: ['Women\u2019s Cricket', 'Mithali Raj', 'Awards'],
        featured: false,
        publishedAt: new Date(Date.now() - 24 * 3600e3)
      },
      {
        title: 'IPL 2027 auction: record purse for the mini-auction',
        slug: 'ipl-2027-auction-record-purse',
        excerpt: 'Franchises will head into the mini-auction with the biggest combined purse in IPL history as the mega-auction looms next cycle.',
        content: 'The IPL governing council has confirmed a record total purse for the upcoming mini-auction. Teams are expected to prioritise pace bowling and finishers, with several high-profile names expected to go under the hammer.',
        category: 'IPL',
        source: 'Cricket Legends Hub',
        author: 'Editorial Desk',
        tags: ['IPL', 'Auction'],
        featured: false,
        publishedAt: new Date(Date.now() - 3 * 24 * 3600e3)
      },
      {
        title: 'Ashes 2026-27 schedule confirmed: five Tests, two pink-ball',
        slug: 'ashes-2026-27-schedule',
        excerpt: 'Cricket Australia and the ECB have locked in a blockbuster five-match series beginning in Brisbane in November.',
        content: 'The oldest rivalry in cricket gets another five-Test chapter. Two day-night Tests feature on the calendar for the first time in an Ashes series, promising drama under lights in Adelaide and Perth.',
        category: 'Series',
        source: 'Cricket Legends Hub',
        author: 'Editorial Desk',
        tags: ['Ashes', 'Australia', 'England', 'Schedule'],
        featured: false,
        publishedAt: new Date(Date.now() - 4 * 24 * 3600e3)
      },
      {
        title: 'Rashid Khan breaks another T20I record',
        slug: 'rashid-khan-t20i-record',
        excerpt: 'Afghanistan\u2019s superstar leg-spinner has become the quickest to 150 T20I wickets, in only his 95th match.',
        content: 'Rashid Khan\u2019s economy, control and variations have made him the most destructive white-ball spinner of his era. The record is the latest in a career that has already redefined what a wrist-spinner can do in the shortest format.',
        category: 'Records',
        source: 'Cricket Legends Hub',
        author: 'Editorial Desk',
        tags: ['Rashid Khan', 'Records', 'T20I'],
        featured: false,
        publishedAt: new Date(Date.now() - 5 * 24 * 3600e3)
      },
      {
        title: 'Women\u2019s Ashes: Southern Stars name an unchanged XI',
        slug: 'womens-ashes-unchanged-xi',
        excerpt: 'Australia Women have resisted the temptation to tinker, backing the XI that won the opening ODI inside 40 overs.',
        content: 'The dominant Australian side will field an unchanged XI for the second match of the Women\u2019s Ashes. The team management believes continuity, not rotation, is the key to a fifth consecutive Ashes title.',
        category: 'Women',
        source: 'Cricket Legends Hub',
        author: 'Editorial Desk',
        tags: ['Women\u2019s Ashes', 'Australia'],
        featured: false,
        publishedAt: new Date(Date.now() - 6 * 24 * 3600e3)
      },
      {
        title: 'Bazball 2.0: England\u2019s new aggression blueprint explained',
        slug: 'england-aggression-blueprint',
        excerpt: 'The analysis team breaks down how England\u2019s fearless batting template has evolved with the new guard of Test batters.',
        content: 'England\u2019s ultra-attacking approach has entered a new phase. With a younger batting core, the side is targeting 350-plus first-innings scores at 4.5 runs per over, backed by a four-pronged pace attack. The template is bold, entertaining and polarising in equal measure.',
        category: 'Analysis',
        source: 'Cricket Legends Hub',
        author: 'Vivek K. Verma',
        tags: ['England', 'Tactics', 'Analysis'],
        featured: false,
        publishedAt: new Date(Date.now() - 8 * 24 * 3600e3)
      }
    ]);
    console.log(`Created ${news.length} news items`);

    // ----------------------------------------------------------------
    // Quiz questions
    // ----------------------------------------------------------------
    const quizQuestions = await QuizQuestion.insertMany([
      { question: 'Who holds the record for the highest individual score in Test cricket?', options: ['Don Bradman', 'Brian Lara', 'Matthew Hayden', 'Virender Sehwag'], answer: 1, difficulty: 'easy', category: 'records' },
      { question: 'Which captain has won all three major ICC white-ball trophies?', options: ['Ricky Ponting', 'MS Dhoni', 'Eoin Morgan', 'Kane Williamson'], answer: 1, difficulty: 'easy', category: 'world-cups' },
      { question: 'What is Don Bradman\u2019s career Test batting average?', options: ['91.12', '95.50', '99.94', '100.00'], answer: 2, difficulty: 'easy', category: 'batting' },
      { question: 'Who bowled the \u201cBall of the Century\u201d?', options: ['Muttiah Muralitharan', 'Shane Warne', 'Anil Kumble', 'Abdul Qadir'], answer: 1, difficulty: 'medium', category: 'bowling' },
      { question: 'Who is the only player with 100 international centuries?', options: ['Virat Kohli', 'Ricky Ponting', 'Sachin Tendulkar', 'Jacques Kallis'], answer: 2, difficulty: 'easy', category: 'batting' },
      { question: 'Which bowler has taken 800 Test wickets?', options: ['Shane Warne', 'James Anderson', 'Muttiah Muralitharan', 'Anil Kumble'], answer: 2, difficulty: 'easy', category: 'bowling' },
      { question: 'Who hit the winning six in the 2011 World Cup final?', options: ['Gautam Gambhir', 'Yuvraj Singh', 'MS Dhoni', 'Virat Kohli'], answer: 2, difficulty: 'easy', category: 'world-cups' },
      { question: 'Which team won the first T20 World Cup in 2007?', options: ['Pakistan', 'Australia', 'India', 'South Africa'], answer: 2, difficulty: 'easy', category: 'world-cups' },
      { question: 'Who is the leading run-scorer in women\u2019s ODI cricket?', options: ['Ellyse Perry', 'Charlotte Edwards', 'Mithali Raj', 'Smriti Mandhana'], answer: 2, difficulty: 'medium', category: 'women' },
      { question: 'Which player has scored the most runs in international cricket?', options: ['Ricky Ponting', 'Virat Kohli', 'Sachin Tendulkar', 'Kumar Sangakkara'], answer: 2, difficulty: 'easy', category: 'batting' },
      { question: 'Who is the only bowler with 100+ wickets in all three formats?', options: ['Shakib Al Hasan', 'Rashid Khan', 'Tim Southee', 'Ravichandran Ashwin'], answer: 0, difficulty: 'medium', category: 'all-round' },
      { question: 'Which ground hosted the 2019 World Cup final?', options: ['The Oval', 'Edgbaston', 'Old Trafford', 'Lord\u2019s'], answer: 3, difficulty: 'easy', category: 'world-cups' },
      { question: 'How many Test centuries did Sachin Tendulkar score?', options: ['49', '51', '53', '48'], answer: 1, difficulty: 'medium', category: 'batting' },
      { question: 'Who took the first-ever T20I hat-trick?', options: ['Brett Lee', 'Bret Hart', 'Morne Morkel', 'Lasith Malinga'], answer: 2, difficulty: 'hard', category: 'bowling' },
      { question: 'Which nation hosted the 2024 T20 World Cup alongside the West Indies?', options: ['USA', 'Canada', 'Mexico', 'Ireland'], answer: 0, difficulty: 'medium', category: 'world-cups' },
      { question: 'What is the fastest Test century in terms of balls faced?', options: ['48 balls', '52 balls', '56 balls', '63 balls'], answer: 2, difficulty: 'hard', category: 'batting' },
      { question: 'Which captain led Australia to three consecutive ODI World Cups?', options: ['Steve Waugh', 'Ricky Ponting', 'Michael Clarke', 'Allan Border'], answer: 1, difficulty: 'medium', category: 'world-cups' },
      { question: 'Who was the first woman to score 7,000 ODI runs?', options: ['Charlotte Edwards', 'Belinda Clark', 'Mithali Raj', 'Suzie Bates'], answer: 2, difficulty: 'medium', category: 'women' },
      { question: 'Which all-rounder has a double century and a 10-wicket haul in Tests?', options: ['Ben Stokes', 'Ravindra Jadeja', 'Shakib Al Hasan', 'Ravichandran Ashwin'], answer: 0, difficulty: 'hard', category: 'all-round' },
      { question: 'In which year did India win the ODI World Cup at Wankhede?', options: ['2003', '2011', '2015', '2019'], answer: 1, difficulty: 'easy', category: 'world-cups' }
    ]);
    console.log(`Created ${quizQuestions.length} quiz questions`);

    // ----------------------------------------------------------------
    // Records archive
    // ----------------------------------------------------------------
    const records = await Record.insertMany([
      { category: 'batting', label: 'Most Test Runs', holder: 'Sachin Tendulkar', value: '15,921', country: 'India', format: 'Test' },
      { category: 'batting', label: 'Most ODI Runs', holder: 'Sachin Tendulkar', value: '18,426', country: 'India', format: 'ODI' },
      { category: 'batting', label: 'Highest Test Average (min 20 inns)', holder: 'Don Bradman', value: '99.94', country: 'Australia', format: 'Test' },
      { category: 'batting', label: 'Most International Centuries', holder: 'Sachin Tendulkar', value: '100', country: 'India', format: 'All' },
      { category: 'batting', label: 'Highest Test Score', holder: 'Brian Lara', value: '400*', country: 'West Indies', format: 'Test' },
      { category: 'batting', label: 'Most ODI Centuries', holder: 'Virat Kohli', value: '51', country: 'India', format: 'ODI' },
      { category: 'batting', label: 'Most World Cup Runs', holder: 'Sachin Tendulkar', value: '2,278', country: 'India', format: 'ODI' },
      { category: 'batting', label: 'Most T20I Runs', holder: 'Rohit Sharma', value: '4,231', country: 'India', format: 'T20I' },
      { category: 'bowling', label: 'Most Test Wickets', holder: 'Muttiah Muralitharan', value: '800', country: 'Sri Lanka', format: 'Test' },
      { category: 'bowling', label: 'Most ODI Wickets', holder: 'Muttiah Muralitharan', value: '534', country: 'Sri Lanka', format: 'ODI' },
      { category: 'bowling', label: 'Most T20I Wickets', holder: 'Rashid Khan', value: '150+', country: 'Afghanistan', format: 'T20I' },
      { category: 'bowling', label: 'Best Test Bowling Figures', holder: 'Jim Laker', value: '10/53', country: 'England', format: 'Test' },
      { category: 'bowling', label: 'Most World Cup Wickets', holder: 'Glenn McGrath', value: '71', country: 'Australia', format: 'ODI' },
      { category: 'bowling', label: 'Best ODI Figures', holder: 'Chaminda Vaas', value: '8/19', country: 'Sri Lanka', format: 'ODI' },
      { category: 'team', label: 'Most ODI World Cup Titles', holder: 'Australia', value: '6', country: 'Australia', format: 'ODI' },
      { category: 'team', label: 'Most T20 World Cup Titles', holder: 'England / West Indies', value: '2', country: 'England & WI', format: 'T20I' },
      { category: 'team', label: 'First T20 World Cup Winner', holder: 'India', value: '2007', country: 'India', format: 'T20I' },
      { category: 'women', label: 'Most ODI Runs (Women)', holder: 'Mithali Raj', value: '7,805', country: 'India', format: 'ODI' },
      { category: 'women', label: 'Most ODI Wickets (Women)', holder: 'Jhulan Goswami', value: '255', country: 'India', format: 'ODI' },
      { category: 'women', label: 'Highest Test Score (Women)', holder: 'Ellyse Perry', value: '213*', country: 'Australia', format: 'Test' },
      { category: 'women', label: 'Most Women\u2019s ODI WC Titles', holder: 'Australia', value: '7', country: 'Australia', format: 'ODI' },
      { category: 'fielding', label: 'Most ODI Dismissals (Wicketkeeper)', holder: 'MS Dhoni', value: '444', country: 'India', format: 'ODI' },
      { category: 'fielding', label: 'Most Catches in International Cricket', holder: 'Rahul Dravid', value: '334', country: 'India', format: 'All' },
      { category: 'partnership', label: 'Highest ODI Partnership', holder: 'Sangakkara & Jayawardene', value: '624', country: 'Sri Lanka', format: 'ODI', note: 'vs South Africa, 2006' },
      { category: 'partnership', label: 'Highest Test Partnership', holder: 'Jayawardene & Sangakkara', value: '624', country: 'Sri Lanka', format: 'Test', note: 'vs South Africa, 2006' },
      { category: 'partnership', label: 'Highest T20I Partnership', holder: 'Guptill & Munro', value: '171', country: 'New Zealand', format: 'T20I' }
    ]);
    console.log(`Created ${records.length} records`);

    // ----------------------------------------------------------------
    // Live streaming hub
    // ----------------------------------------------------------------
    const liveIndEng = await Match.create({
      team1: teams[0]._id,
      team2: teams[5]._id,
      format: 'T20',
      venue: { name: 'Wankhede Stadium', city: 'Mumbai', country: 'India', capacity: 33108 },
      date: new Date(Date.now() - 2.5 * 3600e3),
      status: 'Live',
      live: { inProgress: true, battingTeam: teams[5]._id, target: null },
      series: 'India vs England T20I Series 2026',
      scores: [
        { team: teams[5]._id, runs: 0, wickets: 0, overs: 0 }
      ]
    });

    const liveAusNz = await Match.create({
      team1: teams[4]._id,
      team2: teams[7]._id,
      format: 'T20',
      venue: { name: 'Eden Park', city: 'Auckland', country: 'New Zealand', capacity: 42000 },
      date: new Date(Date.now() - 1 * 3600e3),
      status: 'Live',
      live: { inProgress: true, battingTeam: teams[4]._id, target: null },
      series: 'Trans-Tasman T20 Series 2026',
      scores: [
        { team: teams[4]._id, runs: 0, wickets: 0, overs: 0 }
      ]
    });

    const liveWomen = await Match.create({
      team1: teams[10]._id,
      team2: teams[11]._id,
      format: 'ODI',
      venue: { name: 'MCG', city: 'Melbourne', country: 'Australia', capacity: 100024 },
      date: new Date(Date.now() - 5 * 3600e3),
      status: 'Live',
      live: { inProgress: true, battingTeam: teams[11]._id, target: null },
      series: 'Women\u2019s Ashes 2026',
      scores: [
        { team: teams[11]._id, runs: 0, wickets: 0, overs: 0 }
      ]
    });
    console.log('Created 3 live matches');

    const streams = await Stream.insertMany([
      {
        title: 'India vs England — Live',
        match: liveIndEng._id,
        provider: 'YouTube',
        embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCFY7QFQMBQlrQ1kv1AJLtKA',
        externalUrl: 'https://www.youtube.com/@ICC',
        isLive: true,
        startsAt: new Date(Date.now() - 2.5 * 3600e3),
        viewers: 84200,
        language: 'en',
        description: 'Live coverage of the 4th T20I between India and England.'
      },
      {
        title: 'Australia vs New Zealand — Live',
        match: liveAusNz._id,
        provider: 'JioCinema',
        embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCFY7QFQMBQlrQ1kv1AJLtKA',
        externalUrl: 'https://www.jiocinema.com/sports',
        isLive: true,
        startsAt: new Date(Date.now() - 1 * 3600e3),
        viewers: 31500,
        language: 'en',
        description: 'Live coverage of the Trans-Tasman T20I.'
      },
      {
        title: 'Women\u2019s Ashes — Australia Women vs India Women',
        match: liveWomen._id,
        provider: 'Sky Sports',
        embedUrl: 'https://www.youtube.com/embed/live_stream?channel=UCFY7QFQMBQlrQ1kv1AJLtKA',
        externalUrl: 'https://www.skysports.com/cricket',
        isLive: true,
        startsAt: new Date(Date.now() - 5 * 3600e3),
        viewers: 12800,
        language: 'en',
        description: 'Live coverage of the 2nd ODI of the Women\u2019s Ashes.'
      },
      {
        title: 'England vs Australia — 1st ODI (Pre-match show)',
        provider: 'Willow TV',
        externalUrl: 'https://www.willow.tv/',
        isLive: false,
        startsAt: new Date('2026-09-02T13:30:00Z'),
        viewers: 0,
        language: 'en',
        description: 'Pre-match build-up and team news.'
      },
      {
        title: 'India vs Sri Lanka — 1st ODI',
        provider: 'Hotstar',
        externalUrl: 'https://www.hotstar.com/in/sports/cricket',
        isLive: false,
        startsAt: new Date('2026-09-18T09:00:00Z'),
        viewers: 0,
        language: 'hi',
        description: 'Hindi commentary available.'
      },
      {
        title: 'IPL 2027 — Mumbai Indians vs Chennai Super Kings',
        provider: 'FanCode',
        externalUrl: 'https://www.fancode.com/cricket',
        isLive: false,
        startsAt: new Date('2027-03-22T14:00:00Z'),
        viewers: 0,
        language: 'en',
        description: 'Season opener of IPL 2027.'
      }
    ]);
    console.log(`Created ${streams.length} streams`);

    // ----------------------------------------------------------------
    // Upcoming fixtures — the 2026-27 season
    // ----------------------------------------------------------------
    const upcoming = await Match.insertMany([
      { team1: teams[0]._id, team2: teams[5]._id, format: 'T20', venue: { name: 'Wankhede Stadium', city: 'Mumbai', country: 'India' }, date: new Date('2026-08-18T14:00:00Z'), status: 'Scheduled', series: 'India vs England T20I Series 2026' },
      { team1: teams[5]._id, team2: teams[0]._id, format: 'T20', venue: { name: 'Eden Gardens', city: 'Kolkata', country: 'India' }, date: new Date('2026-08-20T14:00:00Z'), status: 'Scheduled', series: 'India vs England T20I Series 2026' },
      { team1: teams[4]._id, team2: teams[7]._id, format: 'T20', venue: { name: 'SCG', city: 'Sydney', country: 'Australia' }, date: new Date('2026-08-22T09:00:00Z'), status: 'Scheduled', series: 'Trans-Tasman T20 Series 2026' },
      { team1: teams[6]._id, team2: teams[8]._id, format: 'T20', venue: { name: 'Gaddafi Stadium', city: 'Lahore', country: 'Pakistan' }, date: new Date('2026-08-25T14:00:00Z'), status: 'Scheduled', series: 'Pakistan v Afghanistan T20I' },
      { team1: teams[0]._id, team2: teams[12]._id, format: 'ODI', venue: { name: 'R. Premadasa Stadium', city: 'Colombo', country: 'Sri Lanka' }, date: new Date('2026-09-06T09:30:00Z'), status: 'Scheduled', series: 'India tour of Sri Lanka 2026' },
      { team1: teams[5]._id, team2: teams[4]._id, format: 'ODI', venue: { name: 'Lord\u2019s', city: 'London', country: 'England' }, date: new Date('2026-09-12T10:00:00Z'), status: 'Scheduled', series: 'England v Australia ODI Series 2026' },
      { team1: teams[9]._id, team2: teams[12]._id, format: 'Test', venue: { name: 'Sher-e-Bangla Stadium', city: 'Dhaka', country: 'Bangladesh' }, date: new Date('2026-10-04T04:00:00Z'), status: 'Scheduled', series: 'Bangladesh v Sri Lanka Test Series' },
      { team1: teams[5]._id, team2: teams[4]._id, format: 'Test', venue: { name: 'The Gabba', city: 'Brisbane', country: 'Australia' }, date: new Date('2026-11-20T00:00:00Z'), status: 'Scheduled', series: 'The Ashes 2026-27 — 1st Test' },
      { team1: teams[4]._id, team2: teams[5]._id, format: 'Test', venue: { name: 'Adelaide Oval', city: 'Adelaide', country: 'Australia' }, date: new Date('2026-12-02T04:00:00Z'), status: 'Scheduled', series: 'The Ashes 2026-27 — 2nd Test (D/N)' },
      { team1: teams[4]._id, team2: teams[0]._id, format: 'Test', venue: { name: 'Optus Stadium', city: 'Perth', country: 'Australia' }, date: new Date('2026-12-18T02:00:00Z'), status: 'Scheduled', series: 'Border-Gavaskar Trophy 2026-27 — 1st Test' },
      { team1: teams[0]._id, team2: teams[4]._id, format: 'Test', venue: { name: 'MCG', city: 'Melbourne', country: 'Australia' }, date: new Date('2026-12-28T00:00:00Z'), status: 'Scheduled', series: 'Border-Gavaskar Trophy 2026-27 — Boxing Day Test' },
      { team1: teams[7]._id, team2: teams[9]._id, format: 'Test', venue: { name: 'Basin Reserve', city: 'Wellington', country: 'New Zealand' }, date: new Date('2027-01-14T22:00:00Z'), status: 'Scheduled', series: 'New Zealand v Bangladesh Test Series' },
      { team1: teams[11]._id, team2: teams[10]._id, format: 'ODI', venue: { name: 'North Sydney Oval', city: 'Sydney', country: 'Australia' }, date: new Date('2027-01-28T03:30:00Z'), status: 'Scheduled', series: 'Women\u2019s Ashes 2027 — 3rd ODI' },
      { team1: teams[6]._id, team2: teams[7]._id, format: 'ODI', venue: { name: 'National Stadium', city: 'Karachi', country: 'Pakistan' }, date: new Date('2027-02-06T09:30:00Z'), status: 'Scheduled', series: 'Pakistan v New Zealand ODI Series 2027' },
      { team1: teams[8]._id, team2: teams[9]._id, format: 'ODI', venue: { name: 'Sharjah Cricket Stadium', city: 'Sharjah', country: 'UAE' }, date: new Date('2027-02-18T10:00:00Z'), status: 'Scheduled', series: 'Afghanistan v Bangladesh Tri-Nation' },
      { team1: teams[1]._id, team2: teams[2]._id, format: 'IPL', venue: { name: 'Wankhede Stadium', city: 'Mumbai', country: 'India' }, date: new Date('2027-03-22T14:00:00Z'), status: 'Scheduled', series: 'IPL 2027 — Season Opener' },
      { team1: teams[3]._id, team2: teams[1]._id, format: 'IPL', venue: { name: 'M. Chinnaswamy Stadium', city: 'Bangalore', country: 'India' }, date: new Date('2027-04-04T14:00:00Z'), status: 'Scheduled', series: 'IPL 2027' },
      { team1: teams[2]._id, team2: teams[3]._id, format: 'IPL', venue: { name: 'MA Chidambaram Stadium', city: 'Chennai', country: 'India' }, date: new Date('2027-04-18T14:00:00Z'), status: 'Scheduled', series: 'IPL 2027' }
    ]);
    console.log(`Created ${upcoming.length} upcoming matches`);

    console.log('\n✅ Seed completed successfully!');
    console.log('Admin login: admin@cricketlegends.com / admin123');
    console.log('Demo login:  demo@cricketlegends.com / demo123');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
