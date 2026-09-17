import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, GitCompare, Share2, ArrowLeft, Leaf, Clock, Zap, IndianRupee, Shield, Wrench, Recycle, Brain, Star, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { getProductById, getAIInsights } from '../services/api';
import { toggleSaveProduct, toggleCompareProduct } from '../redux/slices/productSlice';
import { EcoScoreBadge, RepairabilityBar, EnergyRatingBadge, Skeleton } from '../components/ui/EcoComponents';
import toast from 'react-hot-toast';

import ProductImage from '../components/ui/ProductImage';

const MetricRow = ({ icon: Icon, label, value, iconColor, isDark }) => (
  <div className={`flex items-center justify-between py-3 border-b ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
    <div className="flex items-center gap-2.5">
      <Icon className={`w-4 h-4 ${iconColor}`} />
      <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
    </div>
    <span className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{value}</span>
  </div>
);

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode } = useSelector(state => state.theme);
  const { savedProducts, compareList } = useSelector(state => state.products);
  const isDark = mode === 'dark';

  const [product, setProduct] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  const isSaved = savedProducts.some(p => p._id === id);
  const isInCompare = compareList.some(p => p._id === id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(id);
        setProduct(data.data);
      } catch {
        toast.error('Product not found');
        navigate('/dashboard/search');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const fetchAIInsights = async () => {
    setAiLoading(true);
    try {
      const { data } = await getAIInsights(id);
      setInsights(data.data);
    } catch {
      toast.error('Could not load AI insights. Ensure you are logged in.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid lg:grid-cols-2 gap-6">
        <Skeleton className="h-96" />
        <div className="space-y-3"><Skeleton className="h-10 w-3/4" /><Skeleton className="h-6 w-1/2" /><Skeleton className="h-40" /></div>
      </div>
    </div>
  );
  if (!product) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate(-1)} className={`flex items-center gap-2 text-sm font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'}`}>
        <ArrowLeft className="w-4 h-4" /> Back to results
      </button>

      {/* Product Hero */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`rounded-2xl overflow-hidden border ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
          <ProductImage product={product} className="w-full h-80 lg:h-96 object-cover" />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <div>
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-eco-400' : 'text-eco-600'}`}>{product.brand} · {product.category}</span>
            <h1 className={`text-2xl md:text-3xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{product.name}</h1>
            <p className={`text-sm mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{product.description}</p>
          </div>

          <div className="flex items-center gap-4">
            <EcoScoreBadge score={product.ecoScore} size="lg" />
            <div>
              <p className="text-3xl font-black text-eco-400">₹{Number(product.price).toLocaleString('en-IN')}</p>
              <EnergyRatingBadge rating={product.energyRating} />
            </div>
          </div>

          <RepairabilityBar score={product.repairabilityScore} />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => { dispatch(toggleSaveProduct(product)); toast(isSaved ? 'Removed from saved' : '💚 Saved!', { duration: 2000 }); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all ${isSaved ? 'bg-eco-500/15 border-eco-500/30 text-eco-400' : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-eco-500/40' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-eco-400'}`}>
              <Heart className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
              {isSaved ? 'Saved' : 'Save'}
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => { if (!isInCompare && compareList.length >= 4) { toast.error('Compare list full'); return; } dispatch(toggleCompareProduct(product)); toast(isInCompare ? 'Removed from compare' : '⚖️ Added to compare'); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all ${isInCompare ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' : isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-500/40' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400'}`}>
              <GitCompare className="w-4 h-4" />
              {isInCompare ? 'In Compare' : 'Compare'}
            </motion.button>
            <button className={`p-3 rounded-xl border ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'}`}>
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {/* Affiliate Links (Where to buy) */}
          {product.affiliateLinks && product.affiliateLinks.length > 0 && (
            <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Compare Prices & Buy</h3>
              <div className="flex flex-col gap-2">
                {product.affiliateLinks.map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center justify-between p-3 rounded-xl transition-all border hover:-translate-y-0.5 ${
                      isDark ? 'bg-slate-700/50 border-slate-600 hover:border-eco-500/50' : 'bg-white border-slate-200 hover:border-eco-400'
                    }`}>
                    <span className={`font-medium ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{link.store}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-eco-500">₹{Number(link.price).toLocaleString('en-IN')}</span>
                      <ArrowLeft className="w-4 h-4 rotate-135 text-slate-400" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Quick Specs */}
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
            <MetricRow icon={Leaf} label="Carbon Footprint" value={`${product.carbonFootprint} kg CO₂`} iconColor="text-eco-400" isDark={isDark} />
            <MetricRow icon={Clock} label="Expected Lifespan" value={`${product.lifespanYears} years`} iconColor="text-blue-400" isDark={isDark} />
            <MetricRow icon={IndianRupee} label="Maintenance/Year" value={`₹${Number(product.maintenanceCostYear).toLocaleString('en-IN')}`} iconColor="text-purple-400" isDark={isDark} />
            <MetricRow icon={Shield} label="Warranty" value={`${product.warrantyMonths} months`} iconColor="text-amber-400" isDark={isDark} />
            <div className={`flex items-center justify-between pt-3`}>
              <div className="flex items-center gap-2.5">
                <Wrench className="w-4 h-4 text-teal-400" />
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Spare Parts</span>
              </div>
              <span className={`text-sm font-semibold ${product.sparePartsAvailable ? 'text-eco-400' : 'text-red-400'}`}>
                {product.sparePartsAvailable ? '✓ Available' : '✗ Limited'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Full Specifications */}
      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
        <div className={`px-5 py-4 border-b flex items-center gap-2 ${isDark ? 'border-slate-700/50 bg-slate-800' : 'border-slate-100 bg-slate-50'}`}>
          <Info className="w-4 h-4 text-eco-400" />
          <h2 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Full Specifications</h2>
        </div>
        <div className="divide-y divide-slate-700/30">
          {[
            { label: 'Brand',              value: product.brand },
            { label: 'Category',           value: product.category },
            { label: 'Price',              value: `₹${Number(product.price).toLocaleString('en-IN')}` },
            ...(product.specs ? Object.entries(product.specs).map(([label, value]) => ({ label, value })) : []),
            { label: 'Eco Score',          value: `${product.ecoScore} / 100` },
            { label: 'Carbon Footprint',   value: `${product.carbonFootprint} kg CO₂` },
            { label: 'Repairability',      value: `${product.repairabilityScore} / 10` },
            { label: 'Expected Lifespan',  value: `${product.lifespanYears} years` },
            { label: 'Maintenance / Year', value: `₹${Number(product.maintenanceCostYear).toLocaleString('en-IN')}` },
            { label: 'Energy Rating',      value: product.energyRating },
            { label: 'Warranty',           value: `${product.warrantyMonths} months` },
            { label: 'Spare Parts',        value: product.sparePartsAvailable ? 'Available' : 'Limited' },
            { label: 'AI Sustainability',  value: product.aiSustainabilityScore ? `${product.aiSustainabilityScore} / 100` : 'N/A' },
          ].map(({ label, value }) => (
            <div key={label} className={`flex items-center justify-between px-5 py-3 text-sm ${
              isDark ? 'odd:bg-slate-800/30 even:bg-transparent' : 'odd:bg-slate-50 even:bg-white'
            }`}>
              <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
              <span className={`font-semibold text-right max-w-[60%] ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{value}</span>
            </div>
          ))}
          {product.materials?.length > 0 && (
            <div className={`flex items-start justify-between px-5 py-3 text-sm ${
              isDark ? 'odd:bg-slate-800/30' : 'odd:bg-slate-50'
            }`}>
              <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Materials</span>
              <div className="flex flex-wrap gap-1.5 justify-end max-w-[60%]">
                {product.materials.map(m => (
                  <span key={m} className={`px-2 py-0.5 rounded-lg text-xs font-medium ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>{m}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Materials */}
      {product.materials?.length > 0 && (
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
          <h2 className={`font-bold mb-3 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Materials</h2>
          <div className="flex flex-wrap gap-2">
            {product.materials.map(m => <span key={m} className={`px-3 py-1.5 rounded-xl text-xs font-medium ${isDark ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{m}</span>)}
          </div>
        </div>
      )}

      {/* Recycling Guide */}
      {product.recyclingInstructions && (
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-eco-500/5 border-eco-500/20' : 'bg-eco-50 border-eco-200'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Recycle className="w-5 h-5 text-eco-400" />
            <h2 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Recycling Guide</h2>
          </div>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{product.recyclingInstructions}</p>
        </div>
      )}

      {/* AI Insights */}
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <h2 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>AI Insights</h2>
          </div>
          {!insights && (
            <motion.button onClick={fetchAIInsights} disabled={aiLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="btn-primary text-xs px-3 py-2">
              {aiLoading ? 'Analyzing...' : '✨ Generate AI Analysis'}
            </motion.button>
          )}
        </div>

        {insights ? (
          <div className="grid sm:grid-cols-3 gap-4">
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Predicted Lifespan</p>
              <p className="text-2xl font-black text-eco-400">{insights.predictedLifespan} yrs</p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Recommendation</p>
              <p className={`text-2xl font-black ${insights.repairVsReplace?.decision === 'Repair' ? 'text-eco-400' : 'text-amber-400'}`}>
                {insights.repairVsReplace?.decision}
              </p>
            </div>
            <div className={`p-4 rounded-xl ${isDark ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Total Ownership Cost</p>
              <p className="text-2xl font-black text-purple-400">₹{Number(insights.ownershipCost?.total).toLocaleString('en-IN')}</p>
            </div>
            <div className={`sm:col-span-3 p-4 rounded-xl ${isDark ? 'bg-purple-500/5 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{insights.aiSummary}</p>
            </div>
          </div>
        ) : (
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {product.aiSummary || 'Click "Generate AI Analysis" to get personalized insights about this product\'s sustainability and lifecycle.'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
