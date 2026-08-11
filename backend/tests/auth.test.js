import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import User from '../models/User.js';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Auth API', () => {
  test('POST /api/auth/register creates a user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'secret123'
    });
    expect(res.status).toBe(201);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user.role).toBe('user');
  });

  test('register rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User 2',
      email: 'test@example.com',
      password: 'secret123'
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('already exists');
  });

  test('register rejects short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User 3',
      email: 'shortpass@example.com',
      password: '123'
    });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/login returns token for valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'secret123'
    });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
  });

  test('login rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpass'
    });
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/profile requires a token', async () => {
    const res = await request(app).get('/api/auth/profile');
    expect(res.status).toBe(401);
  });

  test('GET /api/auth/profile returns the user with a valid token', async () => {
    const login = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'secret123'
    });
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe('test@example.com');
  });

  test('PUT /api/auth/favorites saves legend ids and persists them', async () => {
    const login = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'secret123'
    });
    const token = login.body.token;

    const saved = await request(app)
      .put('/api/auth/favorites')
      .set('Authorization', `Bearer ${token}`)
      .send({ favoriteLegends: ['sachin-tendulkar', 'virat-kohli'] });
    expect(saved.status).toBe(200);
    expect(saved.body.user.favoriteLegends).toEqual(['sachin-tendulkar', 'virat-kohli']);

    const profile = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(profile.body.user.favoriteLegends).toEqual(['sachin-tendulkar', 'virat-kohli']);
  });

  test('PUT /api/auth/favorites rejects non-array payloads', async () => {
    const login = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'secret123'
    });
    const res = await request(app)
      .put('/api/auth/favorites')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({ favoriteLegends: 'not-an-array' });
    expect(res.status).toBe(400);
  });

  test('PUT /api/auth/favorites requires a token', async () => {
    const res = await request(app)
      .put('/api/auth/favorites')
      .send({ favoriteLegends: [] });
    expect(res.status).toBe(401);
  });
});
