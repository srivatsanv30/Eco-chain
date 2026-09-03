import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown } from 'lucide-react';
import { getProducts } from '../services/api';
import { setSearchFilters, resetFilters } from '../redux/slices/productSlice';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton, Pagination, EmptyState } from '../components/ui/EcoComponents';

const CATEGORIES = ['Smartphones', 'Laptops', 'Tablets', 'TVs', 'Washing Machines', 'Refrigerators', 'Air Conditioners', 'Audio', 'Smartwatches', 'Cameras', 'Monitors', 'Accessories'];
const BRANDS = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Nothing', 'Motorola', 'iQOO', 'Lenovo', 'HP', 'Dell', 'ASUS', 'Sony', 'LG', 'Daikin', 'Voltas', 'Blue Star', 'IFB', 'Whirlpool', 'Haier', 'boAt', 'JBL', 'Bose', 'Anker', 'Belkin'];
const ENERGY_RATINGS = ['A++', 'A+', 'A', 'B', 'C'];
const SORT_OPTIONS = [
  { value: 'ecoScore', label: 'Eco Score (High → Low)' },
  { value: '-price', label: 'Price (High → Low)' },
  { value: 'price', label: 'Price (Low → High)' },
  { value: 'repairability', label: 'Repairability' },
  { value: 'newest', label: 'Newest First' },
];

const FilterSelect = ({ label, value, onChange, options, isDark }) => (
  <div>
    <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</label>
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className={`w-full px-3 py-2.5 pr-8 rounded-xl border text-sm outline-none appearance-none transition-all
          ${isDark ? 'bg-slate-800/50 border-slate-700 text-slate-200 focus:border-eco-500/60' : 'bg-white border-slate-200 text-slate-700 focus:border-eco-400'}`}>
        <option value="">All {label}s</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
    </div>
  </div>
);

const SearchPage = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector(state => state.theme);
  const { searchFilters } = useSelector(state => state.products);
  const isDark = mode === 'dark';
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [view, setView] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchParams.get('q') || '');

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...Object.fromEntries(Object.entries(searchFilters).filter(([, v]) => v !== '')) };
      if (localSearch) params.search = localSearch;
      const { data } = await getProducts(params);
      setProducts(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
      setCurrentPage(page);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchFilters, localSearch]);

  useEffect(() => { fetchProducts(1); }, [searchFilters]);

  const handleSearch = (e) => {
    if (e.key === 'Enter') fetchProducts(1);
  };

  const handleReset = () => {
    dispatch(resetFilters());
    setLocalSearch('');
  };

  const activeFiltersCount = Object.values(searchFilters).filter(v => v && v !== 'ecoScore').length + (localSearch ? 1 : 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Search Products</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {total > 0 ? `${total} products found` : 'Discover eco-friendly products'}
        </p>
      </div>

      {/* Search Bar + Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-2xl border transition-all
          ${isDark ? 'bg-slate-800/50 border-slate-700 focus-within:border-eco-500/60' : 'bg-white border-slate-200 focus-within:border-eco-400'}`}>
          <Search className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input type="text" placeholder="Search products, brands..." value={localSearch}
            onChange={e => setLocalSearch(e.target.value)} onKeyDown={handleSearch}
            className={`flex-1 text-sm bg-transparent outline-none ${isDark ? 'text-slate-200 placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'}`} />
          {localSearch && (
            <button onClick={() => { setLocalSearch(''); fetchProducts(1); }}>
              <X className={`w-3.5 h-3.5 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`} />
            </button>
          )}
        </div>
        <button onClick={() => setFiltersOpen(!filtersOpen)}
          className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-medium transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFiltersCount > 0 && <span className="w-5 h-5 rounded-full bg-eco-500 text-white text-xs flex items-center justify-center">{activeFiltersCount}</span>}
        </button>
        <div className={`flex rounded-2xl border overflow-hidden ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
          {[{ v: 'grid', Icon: Grid3X3 }, { v: 'list', Icon: List }].map(({ v, Icon }) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3.5 py-3 transition-all ${view === v ? 'bg-eco-500 text-white' : isDark ? 'bg-slate-800/50 text-slate-400 hover:text-slate-200' : 'bg-white text-slate-500 hover:text-slate-700'}`}>
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Filters Panel */}
      {filtersOpen && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
          className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <FilterSelect label="Category" value={searchFilters.category} onChange={v => dispatch(setSearchFilters({ category: v }))} options={CATEGORIES} isDark={isDark} />
            <FilterSelect label="Brand" value={searchFilters.brand} onChange={v => dispatch(setSearchFilters({ brand: v }))} options={BRANDS} isDark={isDark} />
            <FilterSelect label="Energy" value={searchFilters.energyRating} onChange={v => dispatch(setSearchFilters({ energyRating: v }))} options={ENERGY_RATINGS} isDark={isDark} />
            <FilterSelect label="Sort By" value={searchFilters.sort} onChange={v => dispatch(setSearchFilters({ sort: v }))} options={SORT_OPTIONS.map(o => o.value)} isDark={isDark} />
            <div className="flex flex-col justify-end">
              <button onClick={handleReset} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isDark ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>Reset All</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Min Eco Score</label>
              <input type="range" min="0" max="100" step="10" value={searchFilters.ecoScore || 0}
                onChange={e => dispatch(setSearchFilters({ ecoScore: e.target.value }))}
                className="w-full mt-1 accent-eco-500" />
              <span className="text-xs text-eco-400">{searchFilters.ecoScore || 0}+</span>
            </div>
            <div>
              <label className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Max Price</label>
              <input type="range" min="5000" max="200000" step="5000" value={searchFilters.maxPrice || 200000}
                onChange={e => dispatch(setSearchFilters({ maxPrice: e.target.value }))}
                className="w-full accent-eco-500 mt-1" />
              <span className="text-xs text-eco-400">up to ₹{(searchFilters.maxPrice || 200000).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Grid/List */}
      {loading ? (
        <div className={`${view === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'flex flex-col'} gap-4`}>
          {Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length > 0 ? (
        <div className={`${view === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'flex flex-col'} gap-4`}>
          {products.map((p, i) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <ProductCard product={p} view={view} />
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Search} title="No products found" description="Try adjusting your filters or search query" action={<button onClick={handleReset} className="btn-primary">Reset Filters</button>} />
      )}

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={fetchProducts} />
    </div>
  );
};

export default SearchPage;
