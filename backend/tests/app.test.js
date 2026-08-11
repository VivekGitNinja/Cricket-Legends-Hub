import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('API base', () => {
  test('GET /api responds with welcome message', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toBe(200);
    expect(res.body.message).toContain('Cricket Legends Hub');
  });

  test('unknown routes return 404 JSON', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Route not found');
  });
});
