import express from 'express';
import { getAdminStats, getAllUsers, deleteUser, updateUserRole, syncExternalProducts } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, admin);
router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);
router.post('/sync-amazon', syncExternalProducts);

export default router;
