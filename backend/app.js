import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import playerRoutes from './routes/playerRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import teamRoutes from './routes/teamRoutes.js';
import newsRoutes from './routes/newsRoutes.js';
import streamRoutes from './routes/streamRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import recordRoutes from './routes/recordRoutes.js';
import liveRoutes from './routes/liveRoutes.js';
import * as liveHub from './services/liveHub.js';

dotenv.config();

const app = express();

const isTest = process.env.NODE_ENV === 'test';

if (!isTest) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 300,
    skip: (req) => req.method === 'OPTIONS', // never rate-limit CORS preflight
    message: { error: 'Too many requests from this IP, please try again later' }
  });
  app.use(limiter);
}

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (!isTest) {
  app.use(morgan('dev'));
}

app.use('/api/auth', authRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/live', liveRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Cricket Legends Hub API v1.0.0' });
});

app.all('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;
