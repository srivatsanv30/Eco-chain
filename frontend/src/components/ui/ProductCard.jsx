import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, GitCompare, Star, Leaf, Zap, Clock } from 'lucide-react';
import { toggleSaveProduct, toggleCompareProduct } from '../../redux/slices/productSlice';
import { EcoScoreBadge, EnergyRatingBadge } from './EcoComponents';
import toast from 'react-hot-toast';
import ProductImage from './ProductImage';

const ProductCard = ({ product, view = 'grid' }) => {
  const dispatch = useDispatch();
  const { savedProducts, compareList } = useSelector(state => state.products);
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';

  const isSaved = savedProducts.some(p => p._id === product._id);
  const isInCompare = compareList.some(p => p._id === product._id);

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(toggleSaveProduct(product));
    toast(isSaved ? 'Removed from saved' : '💚 Saved to your list', { duration: 2000 });
  };

  const handleCompare = (e) => {
    e.preventDefault();
    if (!isInCompare && compareList.length >= 4) {
      toast.error('Compare list is full (max 4 products)');
      return;
    }
    dispatch(toggleCompareProduct(product));
    toast(isInCompare ? 'Removed from compare' : '⚖️ Added to compare', { duration: 2000 });
  };

  if (view === 'list') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
        <Link to={`/dashboard/product/${product._id}`}
          className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-eco-500/30' : 'bg-white border-slate-200 hover:border-eco-400'}`}>
          <ProductImage product={product} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-xs mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{product.brand}</p>
                <h3 className={`font-semibold truncate ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{product.productName || product.name}</h3>
              </div>
              <p className="text-lg font-bold text-eco-400 ml-2">₹{Number(product.price).toLocaleString('en-IN')}</p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Leaf className="w-3 h-3 text-eco-400" /> Eco {product.ecoScore}/100
              </span>
              <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <Clock className="w-3 h-3 text-blue-400" /> {product.lifespanYears}yr
              </span>
              <EnergyRatingBadge rating={product.energyRating} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSave} className={`p-2 rounded-xl transition-all ${isSaved ? 'bg-eco-500/20 text-eco-400' : isDark ? 'bg-slate-700 text-slate-400 hover:text-eco-400' : 'bg-slate-100 text-slate-500 hover:text-eco-500'}`}>
              <Heart className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
            </button>
            <button onClick={handleCompare} className={`p-2 rounded-xl transition-all ${isInCompare ? 'bg-blue-500/20 text-blue-400' : isDark ? 'bg-slate-700 text-slate-400 hover:text-blue-400' : 'bg-slate-100 text-slate-500 hover:text-blue-500'}`}>
              <GitCompare className="w-4 h-4" />
            </button>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -6, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }} transition={{ duration: 0.2 }}>
      <Link to={`/dashboard/product/${product._id}`}
        className={`block rounded-2xl border overflow-hidden transition-all duration-200 ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-eco-500/30' : 'bg-white border-slate-200 hover:border-eco-400'}`}>
        <div className="relative">
          <ProductImage product={product} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
          <div className="absolute top-3 right-3 flex gap-2">
            <button onClick={handleSave}
              className={`p-2 rounded-xl backdrop-blur-sm transition-all ${isSaved ? 'bg-eco-500/80 text-white' : 'bg-black/30 text-white hover:bg-eco-500/80'}`}>
              <Heart className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
            </button>
            <button onClick={handleCompare}
              className={`p-2 rounded-xl backdrop-blur-sm transition-all ${isInCompare ? 'bg-blue-500/80 text-white' : 'bg-black/30 text-white hover:bg-blue-500/80'}`}>
              <GitCompare className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="absolute bottom-3 left-3">
            <span className={`text-xs px-2 py-1 rounded-lg backdrop-blur-sm bg-black/40 text-white`}>{product.category}</span>
          </div>
        </div>

        <div className="p-4">
          <p className={`text-xs mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{product.brand}</p>
          <h3 className={`font-semibold mb-3 line-clamp-1 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{product.productName || product.name}</h3>

          <div className="flex items-center justify-between mb-3">
            <EcoScoreBadge score={product.ecoScore} />
            <div className="text-right">
              <p className="text-xl font-bold text-eco-400">₹{Number(product.price).toLocaleString('en-IN')}</p>
              <EnergyRatingBadge rating={product.energyRating} />
            </div>
          </div>

          {/* New Store Indicator */}
          {product.affiliateLinks && product.affiliateLinks.length > 0 && (
            <div className={`text-xs mb-3 px-2 py-1 rounded border inline-block ${isDark ? 'bg-slate-700/50 border-slate-600 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
              Available at {product.affiliateLinks.length} store{product.affiliateLinks.length > 1 ? 's' : ''}
            </div>
          )}

          <div className={`grid grid-cols-2 gap-2 pt-3 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {product.repairabilityScore}/10 repair
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-blue-400" />
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {product.lifespanYears}yr lifespan
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
