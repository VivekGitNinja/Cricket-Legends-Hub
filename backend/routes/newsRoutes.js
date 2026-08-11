import express from 'express';
import {
  getNews,
  getNewsBySlug,
  createNews,
  updateNews,
  deleteNews
} from '../controllers/newsController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getNews);
router.get('/:slug', getNewsBySlug);
router.post('/', protect, admin, createNews);
router.put('/:id', protect, admin, updateNews);
router.delete('/:id', protect, admin, deleteNews);

export default router;
