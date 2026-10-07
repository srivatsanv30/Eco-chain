import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Get all reviews for a product
// @route   GET /api/reviews/product/:productId
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { sort = 'newest', page = 1, limit = 10 } = req.query;

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highest: { rating: -1 },
      lowest: { rating: 1 },
      helpful: { helpfulVotes: -1 },
    };

    const total = await Review.countDocuments({ product: productId });
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name avatar')
      .sort(sortOptions[sort] || sortOptions.newest)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Compute aggregated stats
    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          avgSustainability: { $avg: '$sustainabilityRating' },
          totalReviews: { $sum: 1 },
          stars5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          stars4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          stars3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          stars2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          stars1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        }
      }
    ]);

    const summary = stats[0] || {
      avgRating: 0,
      avgSustainability: 0,
      totalReviews: 0,
      stars5: 0, stars4: 0, stars3: 0, stars2: 0, stars1: 0,
    };

    res.json({
      success: true,
      data: {
        reviews,
        summary: {
          ...summary,
          avgRating: parseFloat((summary.avgRating || 0).toFixed(1)),
          avgSustainability: parseFloat((summary.avgSustainability || 0).toFixed(1)),
          distribution: {
            5: summary.stars5,
            4: summary.stars4,
            3: summary.stars3,
            2: summary.stars2,
            1: summary.stars1,
          }
        },
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        total,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a review
// @route   POST /api/reviews/product/:productId
export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, sustainabilityRating, title, comment, pros, cons, ecoImpactFeedback } = req.body;

    // Check product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Check duplicate
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) return res.status(400).json({ success: false, message: 'You have already reviewed this product' });

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      sustainabilityRating: sustainabilityRating || rating,
      title,
      comment,
      pros: pros || [],
      cons: cons || [],
      ecoImpactFeedback: ecoImpactFeedback || '',
    });

    // Update product's average rating and review count
    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
      product.rating = parseFloat(stats[0].avgRating.toFixed(1));
      product.reviewCount = stats[0].count;
      await product.save();
    }

    const populated = await Review.findById(review._id).populate('user', 'name avatar');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this review' });
    }

    const { rating, sustainabilityRating, title, comment, pros, cons, ecoImpactFeedback } = req.body;
    if (rating) review.rating = rating;
    if (sustainabilityRating) review.sustainabilityRating = sustainabilityRating;
    if (title) review.title = title;
    if (comment) review.comment = comment;
    if (pros) review.pros = pros;
    if (cons) review.cons = cons;
    if (ecoImpactFeedback !== undefined) review.ecoImpactFeedback = ecoImpactFeedback;

    await review.save();

    // Re-compute product rating
    const product = await Product.findById(review.product);
    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
    if (stats.length > 0) {
      product.rating = parseFloat(stats[0].avgRating.toFixed(1));
      product.reviewCount = stats[0].count;
      await product.save();
    }

    const populated = await Review.findById(review._id).populate('user', 'name avatar');
    res.json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Re-compute product rating
    const product = await Product.findById(productId);
    if (product) {
      const stats = await Review.aggregate([
        { $match: { product: product._id } },
        { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
      ]);
      if (stats.length > 0) {
        product.rating = parseFloat(stats[0].avgRating.toFixed(1));
        product.reviewCount = stats[0].count;
      } else {
        product.rating = 0;
        product.reviewCount = 0;
      }
      await product.save();
    }

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle helpful vote on a review
// @route   PUT /api/reviews/:id/helpful
export const toggleHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    const userId = req.user._id;
    const alreadyVoted = review.helpfulVoters.some(v => v.toString() === userId.toString());

    if (alreadyVoted) {
      review.helpfulVoters = review.helpfulVoters.filter(v => v.toString() !== userId.toString());
      review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
    } else {
      review.helpfulVoters.push(userId);
      review.helpfulVotes += 1;
    }

    await review.save();
    res.json({ success: true, data: { helpfulVotes: review.helpfulVotes, voted: !alreadyVoted } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
