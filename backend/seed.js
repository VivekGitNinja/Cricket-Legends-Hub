import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Player from './models/Player.js';
import Team from './models/Team.js';
import Match from './models/Match.js';
import User from './models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await Promise.all([
      Player.deleteMany({}),
      Team.deleteMany({}),
      Match.deleteMany({}),
      User.deleteMany({}),
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
    ]);

    console.log(`Created ${players.length} players`);

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
        stats: { matchesPlayed: 850, matchesWon: 400, matchesLost: 380, winPercentage: 47 },
        description: 'The birthplace of cricket.',
      },
    ]);

    console.log(`Created ${teams.length} teams`);

    // Link currentTeam on players
    await Player.findByIdAndUpdate(players[0]._id, { currentTeam: teams[3]._id });
    await Player.findByIdAndUpdate(players[1]._id, { currentTeam: teams[1]._id });
    await Player.findByIdAndUpdate(players[2]._id, { currentTeam: teams[2]._id });
    await Player.findByIdAndUpdate(players[3]._id, { currentTeam: teams[1]._id });
    await Player.findByIdAndUpdate(players[4]._id, { currentTeam: teams[2]._id });
    await Player.findByIdAndUpdate(players[5]._id, { currentTeam: teams[1]._id });

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
        team2: teams[5]._id,
        format: 'T20',
        venue: { name: 'Wankhede Stadium', city: 'Mumbai', country: 'India', capacity: 33108 },
        date: new Date('2026-08-15'),
        status: 'Scheduled',
        series: 'Bilateral Series 2026',
      },
    ]);

    console.log(`Created ${matches.length} matches`);
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
