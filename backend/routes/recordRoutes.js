import express from 'express';
import {
  getRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord
} from '../controllers/recordController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getRecords);
router.get('/:id', getRecord);
router.post('/', protect, admin, createRecord);
router.put('/:id', protect, admin, updateRecord);
router.delete('/:id', protect, admin, deleteRecord);

export default router;
