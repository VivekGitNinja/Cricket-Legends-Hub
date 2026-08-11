import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import Player from '../models/Player.js';
import Team from '../models/Team.js';

let teamId;
let playerIds = [];

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Player.deleteMany({});
  await Team.deleteMany({});

  const team = await Team.create({
    name: 'Test XI',
    shortName: 'TXI',
    country: 'India',
    type: 'National',
    founded: 2000
  });
  teamId = team._id;

  const players = await Player.insertMany([
    {
      name: 'Test Batsman',
      country: 'India',
      role: 'Batsman',
      format: 'All',
      rating: 90,
      currentTeam: teamId,
      teams: ['India'],
      isLegend: true
    },
    {
      name: 'Test Bowler',
      country: 'Australia',
      role: 'Bowler',
      format: 'All',
      rating: 85,
      currentTeam: teamId,
      teams: ['Australia'],
      isLegend: true
    }
  ]);
  playerIds = players.map(p => p._id);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Players API', () => {
  test('GET /api/players returns all players', async () => {
    const res = await request(app).get('/api/players');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.count).toBe(2);
  });

  test('GET /api/players filters by country', async () => {
    const res = await request(app).get('/api/players?country=Australia');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.players[0].name).toBe('Test Bowler');
  });

  test('GET /api/players/search finds by partial name', async () => {
    const res = await request(app).get('/api/players/search?query=bowl');
    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.players[0].name).toBe('Test Bowler');
  });

  test('GET /api/players/search without query returns 400', async () => {
    const res = await request(app).get('/api/players/search');
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/players/:id returns a single player', async () => {
    const res = await request(app).get(`/api/players/${playerIds[0]}`);
    expect(res.status).toBe(200);
    expect(res.body.player.name).toBe('Test Batsman');
  });

  test('GET /api/players/:id with unknown id returns 404', async () => {
    const res = await request(app).get('/api/players/64b000000000000000000000');
    expect(res.status).toBe(404);
  });

  test('POST /api/players requires authentication', async () => {
    const res = await request(app)
      .post('/api/players')
      .send({ name: 'Hacker', country: 'India', role: 'Batsman' });
    expect(res.status).toBe(401);
  });
});
