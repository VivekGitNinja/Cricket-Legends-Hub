import express from 'express';
import {
  getStreams,
  getStream,
  createStream,
  updateStream,
  deleteStream
} from '../controllers/streamController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getStreams);
router.get('/:id', getStream);
router.post('/', protect, admin, createStream);
router.put('/:id', protect, admin, updateStream);
router.delete('/:id', protect, admin, deleteStream);

export default router;
