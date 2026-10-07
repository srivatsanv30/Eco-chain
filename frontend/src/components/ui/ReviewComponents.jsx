import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ThumbsUp, Leaf, ChevronDown, Trash2, Edit3, CheckCircle } from 'lucide-react';
import { toggleHelpfulVote, deleteReview as deleteReviewApi } from '../../services/api';
import toast from 'react-hot-toast';

const StarDisplay = ({ rating, size = 'sm', interactive = false, onRate }) => {
  const [hovered, setHovered] = useState(0);
  const sizeClass = size === 'lg' ? 'w-7 h-7' : size === 'md' ? 'w-5 h-5' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => interactive && onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
        >
          <Star
            className={`${sizeClass} transition-colors ${
              star <= (hovered || rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const RatingDistribution = ({ distribution, total, isDark }) => {
  return (
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map(stars => {
        const count = distribution[stars] || 0;
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={stars} className="flex items-center gap-2">
            <span className={`text-xs w-4 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stars}</span>
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <div className={`flex-1 h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, delay: (5 - stars) * 0.1 }}
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
              />
            </div>
            <span className={`text-xs w-6 text-right font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{count}</span>
          </div>
        );
      })}
    </div>
  );
};

const ReviewCard = ({ review, currentUserId, onDelete, onEdit, isDark }) => {
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulVotes);
  const [voted, setVoted] = useState(review.helpfulVoters?.includes(currentUserId));
  const [helpfulLoading, setHelpfulLoading] = useState(false);
  const isOwner = currentUserId === review.user?._id;
  const timeAgo = getTimeAgo(review.createdAt);

  const handleHelpful = async () => {
    if (!currentUserId) {
      toast.error('Please log in to vote');
      return;
    }
    setHelpfulLoading(true);
    try {
      const { data } = await toggleHelpfulVote(review._id);
      setHelpfulCount(data.data.helpfulVotes);
      setVoted(data.data.voted);
    } catch {
      toast.error('Failed to register vote');
    } finally {
      setHelpfulLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteReviewApi(review._id);
      toast.success('Review deleted');
      onDelete(review._id);
    } catch {
      toast.error('Failed to delete review');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className={`p-5 rounded-2xl border transition-all ${
        isDark
          ? 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600/50'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-eco-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {review.user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {review.user?.name || 'Anonymous'}
              </span>
              {review.verifiedPurchase && (
                <span className="flex items-center gap-0.5 text-xs text-eco-400 font-medium">
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{timeAgo}</span>
          </div>
        </div>
        {isOwner && (
          <div className="flex items-center gap-1">
            <button onClick={() => onEdit(review)} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button onClick={handleDelete} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'}`}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Ratings */}
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-1.5">
          <StarDisplay rating={review.rating} size="sm" />
          <span className={`text-sm font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{review.rating}</span>
        </div>
        <div className="flex items-center gap-1">
          <Leaf className="w-3.5 h-3.5 text-eco-400" />
          <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Eco: {review.sustainabilityRating}/5
          </span>
        </div>
      </div>

      {/* Title & Comment */}
      <h4 className={`font-semibold text-sm mb-1.5 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{review.title}</h4>
      <p className={`text-sm leading-relaxed mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{review.comment}</p>

      {/* Pros & Cons */}
      {(review.pros?.length > 0 || review.cons?.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-3 mb-3">
          {review.pros?.length > 0 && (
            <div className={`p-3 rounded-xl ${isDark ? 'bg-eco-500/5' : 'bg-eco-50'}`}>
              <p className="text-xs font-semibold text-eco-400 mb-1.5">Pros</p>
              <ul className="space-y-1">
                {review.pros.map((pro, i) => (
                  <li key={i} className={`text-xs flex items-start gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <span className="text-eco-400 mt-0.5">+</span> {pro}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {review.cons?.length > 0 && (
            <div className={`p-3 rounded-xl ${isDark ? 'bg-red-500/5' : 'bg-red-50'}`}>
              <p className="text-xs font-semibold text-red-400 mb-1.5">Cons</p>
              <ul className="space-y-1">
                {review.cons.map((con, i) => (
                  <li key={i} className={`text-xs flex items-start gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    <span className="text-red-400 mt-0.5">−</span> {con}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Eco Impact Feedback */}
      {review.ecoImpactFeedback && (
        <div className={`p-3 rounded-xl mb-3 flex items-start gap-2 ${isDark ? 'bg-purple-500/5 border border-purple-500/10' : 'bg-purple-50 border border-purple-100'}`}>
          <Leaf className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{review.ecoImpactFeedback}</p>
        </div>
      )}

      {/* Helpful */}
      <button
        onClick={handleHelpful}
        disabled={helpfulLoading}
        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${
          voted
            ? 'bg-eco-500/15 text-eco-400 border border-eco-500/30'
            : isDark
              ? 'bg-slate-700/50 text-slate-400 hover:text-slate-200 border border-slate-600/50'
              : 'bg-slate-100 text-slate-500 hover:text-slate-700 border border-slate-200'
        }`}
      >
        <ThumbsUp className={`w-3.5 h-3.5 ${voted ? 'fill-current' : ''}`} />
        Helpful{helpfulCount > 0 ? ` (${helpfulCount})` : ''}
      </button>
    </motion.div>
  );
};

function getTimeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export { StarDisplay, RatingDistribution, ReviewCard };
