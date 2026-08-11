import QuizQuestion from '../models/QuizQuestion.js';
import QuizAttempt from '../models/QuizAttempt.js';

export const getQuestions = async (req, res) => {
  try {
    const questions = await QuizQuestion.find().sort({ category: 1, difficulty: 1 });
    res.status(200).json({ success: true, count: questions.length, questions });
  } catch (error) {
    console.error('Get quiz questions error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching quiz questions' });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const attempts = await QuizAttempt.find()
      .sort({ score: -1, timeTaken: 1, createdAt: -1 })
      .limit(Number(limit))
      .populate('user', 'name');
    res.status(200).json({ success: true, count: attempts.length, attempts });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching leaderboard' });
  }
};

export const submitAttempt = async (req, res) => {
  try {
    const { score, total, timeTaken, name } = req.body;
    if (typeof score !== 'number' || typeof total !== 'number' || total < 1) {
      return res.status(400).json({
        success: false,
        message: 'score (number) and total (number >= 1) are required'
      });
    }

    const attempt = await QuizAttempt.create({
      user: req.user ? req.user._id : undefined,
      name: req.user ? req.user.name : (name || 'Anonymous').slice(0, 40),
      score: Math.max(0, score),
      total,
      timeTaken: timeTaken ? Math.round(timeTaken) : undefined
    });

    res.status(201).json({ success: true, message: 'Score recorded', attempt });
  } catch (error) {
    console.error('Submit quiz attempt error:', error);
    res.status(500).json({ success: false, message: 'Server error saving score' });
  }
};
