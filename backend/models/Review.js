import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  sustainabilityRating: { type: Number, required: true, min: 1, max: 5 },  // How eco-friendly the user found it
  title: { type: String, required: true, maxlength: 120 },
  comment: { type: String, required: true, maxlength: 2000 },
  pros: [{ type: String, maxlength: 100 }],
  cons: [{ type: String, maxlength: 100 }],
  ecoImpactFeedback: { type: String, default: '' },
  verifiedPurchase: { type: Boolean, default: false },
  helpfulVotes: { type: Number, default: 0 },
  helpfulVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
