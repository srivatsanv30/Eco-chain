import express from 'express';
import { getProductReviews, createReview, updateReview, deleteReview, toggleHelpful } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public: get reviews for a product
router.get('/product/:productId', getProductReviews);

// Protected: create, update, delete reviews
router.post('/product/:productId', protect, createReview);
router.route('/:id').put(protect, updateReview).delete(protect, deleteReview);
router.put('/:id/helpful', protect, toggleHelpful);

export default router;
