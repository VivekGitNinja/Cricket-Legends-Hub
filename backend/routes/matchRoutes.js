import express from 'express';
import {
  getMatches,
  getMatch,
  getLiveMatches,
  getUpcomingMatches,
  getMatchLive,
  createMatch,
  updateMatch,
  deleteMatch
} from '../controllers/matchController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMatches);
router.get('/live', getLiveMatches);
router.get('/upcoming', getUpcomingMatches);
router.get('/:id/live', getMatchLive);
router.get('/:id', getMatch);
router.post('/', protect, admin, createMatch);
router.put('/:id', protect, admin, updateMatch);
router.delete('/:id', protect, admin, deleteMatch);

export default router;
