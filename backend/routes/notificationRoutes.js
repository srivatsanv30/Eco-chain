import express from 'express';
import { getNotifications, markAllRead, toggleRead, deleteNotification, createNotification } from '../controllers/notificationController.js';
import { optionalProtect, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalProtect, getNotifications);
router.put('/read-all', optionalProtect, markAllRead);
router.put('/:id/read', optionalProtect, toggleRead);
router.delete('/:id', optionalProtect, deleteNotification);
router.post('/', protect, createNotification);

export default router;
