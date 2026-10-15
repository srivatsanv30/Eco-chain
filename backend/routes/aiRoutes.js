import express from 'express';
import { getAIInsights, getCarbonWallet, getRepairCenters, getRecycleCenters } from '../controllers/aiController.js';
import { protect, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/insights/:id', protect, getAIInsights);
router.get('/carbon-wallet', protect, getCarbonWallet);
router.get('/repair-centers', optionalProtect, getRepairCenters);
router.get('/recycle-centers', optionalProtect, getRecycleCenters);

export default router;
