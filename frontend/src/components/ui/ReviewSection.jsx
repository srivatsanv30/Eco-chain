import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Star, Leaf, Plus, X, ChevronDown, Loader2, Send, Sparkles } from 'lucide-react';
import { getProductReviews, createReview, updateReview } from '../../services/api';
import { StarDisplay, RatingDistribution, ReviewCard } from './ReviewComponents';
import toast from 'react-hot-toast';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'lowest', label: 'Lowest Rated' },
  { value: 'helpful', label: 'Most Helpful' },
];

const ReviewSection = ({ productId }) => {
  const { mode } = useSelector(state => state.theme);
  const { user } = useSelector(state => state.auth);
  const isDark = mode === 'dark';

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    rating: 0,
    sustainabilityRating: 0,
    title: '',
    comment: '',
    pros: [''],
    cons: [''],
    ecoImpactFeedback: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getProductReviews(productId, { sort, page, limit: 5 });
      setReviews(data.data.reviews);
      setSummary(data.data.summary);
      setTotalPages(data.data.totalPages);
    } catch {
      // Silently fail, show empty state
    } finally {
      setLoading(false);
    }
  }, [productId, sort, page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const resetForm = () => {
    setFormData({ rating: 0, sustainabilityRating: 0, title: '', comment: '', pros: [''], cons: [''], ecoImpactFeedback: '' });
    setEditingReview(null);
    setShowForm(false);
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      rating: review.rating,
      sustainabilityRating: review.sustainabilityRating,
      title: review.title,
      comment: review.comment,
      pros: review.pros?.length ? review.pros : [''],
      cons: review.cons?.length ? review.cons : [''],
      ecoImpactFeedback: review.ecoImpactFeedback || '',
    });
    setShowForm(true);
  };

  const handleDelete = (reviewId) => {
    setReviews(prev => prev.filter(r => r._id !== reviewId));
    fetchReviews(); // re-fetch to update summary
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) { toast.error('Please select a rating'); return; }
    if (formData.sustainabilityRating === 0) { toast.error('Please rate sustainability'); return; }
    if (!formData.title.trim()) { toast.error('Please add a title'); return; }
    if (!formData.comment.trim()) { toast.error('Please add a comment'); return; }

    setSubmitting(true);
    const payload = {
      ...formData,
      pros: formData.pros.filter(p => p.trim()),
      cons: formData.cons.filter(c => c.trim()),
    };

    try {
      if (editingReview) {
        await updateReview(editingReview._id, payload);
        toast.success('Review updated!');
      } else {
        await createReview(productId, payload);
        toast.success('Review posted! 🌿');
      }
      resetForm();
      setPage(1);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const addProCon = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], ''],
    }));
  };

  const updateProCon = (type, index, value) => {
    setFormData(prev => {
      const updated = [...prev[type]];
      updated[index] = value;
      return { ...prev, [type]: updated };
    });
  };

  const removeProCon = (type, index) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  // Community consensus indicator
  const getConsensus = (avgRating) => {
    if (avgRating >= 4.5) return { text: 'Highly Recommended', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-500/20' };
    if (avgRating >= 3.5) return { text: 'Recommended', color: 'text-green-400', bg: 'bg-green-400/10 border-green-500/20' };
    if (avgRating >= 2.5) return { text: 'Mixed Reviews', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-500/20' };
    if (avgRating >= 1.5) return { text: 'Below Average', color: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-500/20' };
    return { text: 'Not Recommended', color: 'text-red-400', bg: 'bg-red-400/10 border-red-500/20' };
  };

  const userHasReviewed = reviews.some(r => r.user?._id === user?._id);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-eco-400" />
          <h2 className={`font-bold text-lg ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Reviews & Ratings
          </h2>
          {summary && summary.totalReviews > 0 && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
              {summary.totalReviews}
            </span>
          )}
        </div>
        {user && !userHasReviewed && !showForm && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(true)}
            className="btn-primary text-xs px-4 py-2.5 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Write a Review
          </motion.button>
        )}
      </div>

      {/* Summary Card */}
      {summary && summary.totalReviews > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'}`}
        >
          <div className="grid sm:grid-cols-3 gap-6">
            {/* Overall Rating */}
            <div className="flex flex-col items-center text-center">
              <p className={`text-5xl font-black mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{summary.avgRating}</p>
              <StarDisplay rating={Math.round(summary.avgRating)} size="md" />
              <p className={`text-xs mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{summary.totalReviews} review{summary.totalReviews !== 1 ? 's' : ''}</p>
              {/* Consensus Badge */}
              {(() => {
                const consensus = getConsensus(summary.avgRating);
                return (
                  <span className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full border ${consensus.bg} ${consensus.color}`}>
                    <Sparkles className="w-3 h-3" /> {consensus.text}
                  </span>
                );
              })()}
            </div>

            {/* Distribution */}
            <div className="sm:col-span-1">
              <RatingDistribution distribution={summary.distribution} total={summary.totalReviews} isDark={isDark} />
            </div>

            {/* Sustainability Score */}
            <div className={`flex flex-col items-center justify-center p-4 rounded-xl ${isDark ? 'bg-eco-500/5 border border-eco-500/10' : 'bg-eco-50 border border-eco-200'}`}>
              <Leaf className="w-6 h-6 text-eco-400 mb-2" />
              <p className="text-3xl font-black text-eco-400">{summary.avgSustainability}</p>
              <p className={`text-xs mt-1 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Eco Rating (Avg)</p>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>out of 5</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className={`p-6 rounded-2xl border space-y-5 ${isDark ? 'bg-slate-800/60 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}
            >
              <div className="flex items-center justify-between">
                <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                  {editingReview ? 'Edit Your Review' : 'Write a Review'}
                </h3>
                <button type="button" onClick={resetForm} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Star Ratings Row */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-semibold mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Overall Rating <span className="text-red-400">*</span>
                  </label>
                  <StarDisplay rating={formData.rating} size="lg" interactive onRate={(r) => setFormData(prev => ({ ...prev, rating: r }))} />
                </div>
                <div>
                  <label className={`text-xs font-semibold mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Sustainability Rating <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <StarDisplay rating={formData.sustainabilityRating} size="lg" interactive onRate={(r) => setFormData(prev => ({ ...prev, sustainabilityRating: r }))} />
                    <Leaf className="w-5 h-5 text-eco-400" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className={`text-xs font-semibold mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Review Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  maxLength={120}
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Sum up your experience..."
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-eco-500/30 ${
                    isDark
                      ? 'bg-slate-700/50 border-slate-600 text-slate-200 placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Comment */}
              <div>
                <label className={`text-xs font-semibold mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Your Review <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  maxLength={2000}
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience with this product..."
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-eco-500/30 resize-none ${
                    isDark
                      ? 'bg-slate-700/50 border-slate-600 text-slate-200 placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
                <p className={`text-xs mt-1 text-right ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{formData.comment.length}/2000</p>
              </div>

              {/* Pros & Cons */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={`text-xs font-semibold mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Pros</label>
                  {formData.pros.map((pro, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <span className="text-eco-400 text-sm font-bold">+</span>
                      <input
                        type="text"
                        maxLength={100}
                        value={pro}
                        onChange={(e) => updateProCon('pros', i, e.target.value)}
                        placeholder="What you liked..."
                        className={`flex-1 px-3 py-2 rounded-lg text-xs border transition-colors focus:outline-none focus:ring-2 focus:ring-eco-500/20 ${
                          isDark ? 'bg-slate-700/50 border-slate-600 text-slate-200 placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                        }`}
                      />
                      {formData.pros.length > 1 && (
                        <button type="button" onClick={() => removeProCon('pros', i)} className="text-slate-500 hover:text-red-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {formData.pros.length < 5 && (
                    <button type="button" onClick={() => addProCon('pros')} className="text-xs text-eco-400 font-medium hover:text-eco-300">+ Add pro</button>
                  )}
                </div>
                <div>
                  <label className={`text-xs font-semibold mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Cons</label>
                  {formData.cons.map((con, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <span className="text-red-400 text-sm font-bold">−</span>
                      <input
                        type="text"
                        maxLength={100}
                        value={con}
                        onChange={(e) => updateProCon('cons', i, e.target.value)}
                        placeholder="What could be better..."
                        className={`flex-1 px-3 py-2 rounded-lg text-xs border transition-colors focus:outline-none focus:ring-2 focus:ring-eco-500/20 ${
                          isDark ? 'bg-slate-700/50 border-slate-600 text-slate-200 placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                        }`}
                      />
                      {formData.cons.length > 1 && (
                        <button type="button" onClick={() => removeProCon('cons', i)} className="text-slate-500 hover:text-red-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {formData.cons.length < 5 && (
                    <button type="button" onClick={() => addProCon('cons')} className="text-xs text-red-400 font-medium hover:text-red-300">+ Add con</button>
                  )}
                </div>
              </div>

              {/* Eco Impact Feedback */}
              <div>
                <label className={`text-xs font-semibold mb-1.5 block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  🌿 Eco Impact Feedback <span className={`font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.ecoImpactFeedback}
                  onChange={(e) => setFormData(prev => ({ ...prev, ecoImpactFeedback: e.target.value }))}
                  placeholder="How has this product impacted your environmental footprint? Any eco-related observations..."
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-eco-500/30 resize-none ${
                    isDark
                      ? 'bg-eco-500/5 border-eco-500/20 text-slate-200 placeholder-slate-500'
                      : 'bg-eco-50 border-eco-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={resetForm} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
                  Cancel
                </button>
                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary text-sm px-6 py-2.5 flex items-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {editingReview ? 'Update Review' : 'Post Review'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort & Filter */}
      {summary && summary.totalReviews > 0 && (
        <div className="flex items-center justify-between">
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Showing {reviews.length} of {summary.totalReviews} reviews
          </p>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              className={`appearance-none text-xs font-medium pl-3 pr-8 py-2 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-eco-500/30 ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-600'
              }`}
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className={`w-8 h-8 animate-spin ${isDark ? 'text-eco-400' : 'text-eco-600'}`} />
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {reviews.map(review => (
              <ReviewCard
                key={review._id}
                review={review}
                currentUserId={user?._id}
                isDark={isDark}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                    p === page
                      ? 'bg-eco-500 text-white shadow-eco'
                      : isDark ? 'bg-slate-700/50 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={`text-center py-16 rounded-2xl border border-dashed ${isDark ? 'border-slate-700 bg-slate-800/20' : 'border-slate-200 bg-slate-50'}`}>
          <MessageSquare className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
          <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No reviews yet</h4>
          <p className={`text-sm mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Be the first to review this product and help the community!</p>
          {user && !showForm && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowForm(true)}
              className="btn-primary text-xs px-5 py-2.5 inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Write First Review
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
