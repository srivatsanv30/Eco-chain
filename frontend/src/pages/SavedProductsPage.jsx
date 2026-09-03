import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';

const SavedProductsPage = () => {
  const { savedProducts } = useSelector(state => state.products);
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div>
          <h1 className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Saved Products
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Manage and compare your favorite eco-friendly items.
          </p>
        </div>
        <Link to="/dashboard/search" className="btn-primary flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          <span>Explore Products</span>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants}>
        {savedProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedProducts.map(p => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className={`text-center py-20 rounded-2xl border ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
            <Heart className="w-16 h-16 mx-auto mb-4 text-slate-500 opacity-40" />
            <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>No saved products yet</h3>
            <p className={`text-sm mb-6 max-w-sm mx-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Browse the catalog and save products to track their lifecycles, compare metrics, and read AI insights.
            </p>
            <Link to="/dashboard/search" className="btn-primary inline-flex">
              Search Products
            </Link>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SavedProductsPage;
