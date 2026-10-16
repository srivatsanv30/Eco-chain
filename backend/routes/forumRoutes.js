import express from 'express';
import { getThreads, createThread, addComment, toggleLike } from '../controllers/forumController.js';
import { optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalProtect, getThreads);
router.post('/', optionalProtect, createThread);
router.post('/:id/comments', optionalProtect, addComment);
router.put('/:id/like', optionalProtect, toggleLike);

export default router;
