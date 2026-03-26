import express from 'express';
import {
  getMatches,
  getMatch,
  createMatch,
  updateMatch,
  deleteMatch
} from '../controllers/matchController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getMatches);
router.get('/:id', getMatch);
router.post('/', protect, admin, createMatch);
router.put('/:id', protect, admin, updateMatch);
router.delete('/:id', protect, admin, deleteMatch);

export default router;
