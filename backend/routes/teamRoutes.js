import express from 'express';
import { getTeams, getTeam, createTeam, updateTeam, deleteTeam } from '../controllers/teamController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getTeams);
router.get('/:id', getTeam);

// Protected admin routes
router.post('/', protect, admin, createTeam);
router.put('/:id', protect, admin, updateTeam);
router.delete('/:id', protect, admin, deleteTeam);

export default router;
