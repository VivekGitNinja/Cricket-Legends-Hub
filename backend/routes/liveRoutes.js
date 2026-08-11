import express from 'express';
import { subscribe, getSnapshot } from '../services/liveHub.js';

const router = express.Router();

/** Server-Sent Events: pushes live score updates the moment they change. */
router.get('/stream', (req, res) => {
  subscribe(res);
  // Keep the request alive even if the client is slow.
  req.on('close', () => {});
});

/** Latest snapshot as a plain JSON response (polling fallback). */
router.get('/now', (req, res) => {
  res.status(200).json({ success: true, ...getSnapshot() });
});

export default router;
