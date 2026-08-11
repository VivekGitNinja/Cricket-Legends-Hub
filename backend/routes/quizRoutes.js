import express from 'express';
import { getQuestions, getLeaderboard, submitAttempt } from '../controllers/quizController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/questions', getQuestions);
router.get('/leaderboard', getLeaderboard);
router.post('/attempt', protect, submitAttempt);

export default router;
