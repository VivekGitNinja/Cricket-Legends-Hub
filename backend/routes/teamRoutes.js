import express from 'express';
import { getTeams, getTeam, createTeam, updateTeam, deleteTeam } from '../controllers/teamController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getTeams);
router.get('/:id', getTeam);

// Protected admin routes
router.post('/', protect, adminOnly, createTeam);
router.put('/:id', protect, adminOnly, updateTeam);
router.delete('/:id', protect, adminOnly, deleteTeam);

export default router;
