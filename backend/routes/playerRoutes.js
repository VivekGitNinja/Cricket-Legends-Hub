import express from 'express';
import {
  getPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
  searchPlayers
} from '../controllers/playerController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPlayers);
router.get('/search', searchPlayers);
router.get('/:id', getPlayer);
router.post('/', protect, admin, createPlayer);
router.put('/:id', protect, admin, updatePlayer);
router.delete('/:id', protect, admin, deletePlayer);

export default router;
