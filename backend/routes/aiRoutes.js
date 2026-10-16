import express from 'express';
import { getAIInsights, getCarbonWallet, getRepairCenters, getRecycleCenters, analyzeProductQuery } from '../controllers/aiController.js';
import { protect, optionalProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/insights/:id', optionalProtect, getAIInsights);
router.post('/analyze', optionalProtect, analyzeProductQuery);
router.get('/carbon-wallet', optionalProtect, getCarbonWallet);
router.get('/repair-centers', optionalProtect, getRepairCenters);
router.get('/recycle-centers', optionalProtect, getRecycleCenters);

export default router;
