import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  updateFavorites,
  updateDreamTeam
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/favorites', protect, updateFavorites);
router.put('/dream-team', protect, updateDreamTeam);

export default router;
