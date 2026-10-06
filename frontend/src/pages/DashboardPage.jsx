import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Zap, TrendingUp, ShoppingBag, Recycle, Brain, ArrowRight, Award } from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler } from 'chart.js';
import { StatCard } from '../components/ui/Card';
import { getProducts } from '../services/api';
import ProductCard from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/EcoComponents';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const DashboardPage = () => {
  const { user } = useSelector(state => state.auth);
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts({ limit: 4, sort: 'ecoScore' });
        setProducts(data.data || []);
      } catch {
        // Silently fail — backend may not be running, UI still shows gracefully
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const wallet = user?.carbonWallet || { balance: 450, monthlyFootprint: 120, wasteGenerated: 12, moneySaved: 85 };

  const CARBON_DATA = [145, 132, 118, 110, 108, wallet.monthlyFootprint];
  const footprintTrend = Math.round(((wallet.monthlyFootprint - 108) / 108) * 100);
  const totalReduction = Math.round(((CARBON_DATA[0] - wallet.monthlyFootprint) / CARBON_DATA[0]) * 100);
  const trendText = totalReduction >= 0 ? `↓ ${totalReduction}% reduction over 6 months` : `↑ ${Math.abs(totalReduction)}% increase over 6 months`;
  const badgeText = totalReduction >= 0 ? 'Improving ↓' : 'Worsening ↑';

  const lineChartData = {
    labels: MONTHS,
    datasets: [{
      label: 'Carbon Footprint (kg CO₂)',
      data: CARBON_DATA,
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.08)',
      borderWidth: 2.5,
      pointBackgroundColor: '#22c55e',
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: true,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', titleColor: '#94a3b8', bodyColor: '#e2e8f0', borderColor: '#334155', borderWidth: 1 } },
    scales: {
      x: { grid: { color: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(226,232,240,0.8)' }, ticks: { color: isDark ? '#64748b' : '#94a3b8', font: { size: 11 } } },
      y: { grid: { color: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(226,232,240,0.8)' }, ticks: { color: isDark ? '#64748b' : '#94a3b8', font: { size: 11 } } },
    },
  };

  const doughnutData = {
    labels: ['Electronics', 'Appliances', 'Clothing', 'Other'],
    datasets: [{ data: [42, 28, 18, 12], backgroundColor: ['#22c55e', '#10b981', '#34d399', '#6ee7b7'], borderWidth: 0, hoverOffset: 8 }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    plugins: {
      legend: { position: 'bottom', labels: { color: isDark ? '#94a3b8' : '#64748b', padding: 12, font: { size: 11 } } },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#94a3b8', bodyColor: '#e2e8f0' }
    },
  };

  const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } };
  const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      {/* Enhanced Hero Banner */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-eco-900/40 via-slate-900 to-blue-900/40' : 'from-eco-500 via-teal-400 to-blue-500'}`} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        
        {/* Decorative Blur Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full mix-blend-overlay transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 blur-2xl rounded-full mix-blend-overlay transform -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight drop-shadow-md">
              Welcome back, {user?.name?.split(' ')[0] || 'Eco-Warrior'} 👋
            </h1>
            <p className="text-white/80 font-medium max-w-md drop-shadow">
              You're making a real difference. Check out your sustainability impact and discover new eco-friendly products.
            </p>
          </div>
          <Link to="/dashboard/search" className="group flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl border border-white/30">
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Explore Store</span>
          </Link>
        </div>
      </motion.div>

      {/* Stat Cards with Glassmorphism */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Carbon Balance" value={`${wallet.balance} pts`} subtitle="Green credits earned" icon={Leaf} color="eco" trend={12} className={isDark ? 'bg-slate-800/60 backdrop-blur-xl border-slate-700/50' : 'bg-white shadow-xl shadow-eco-500/5'} />
        <StatCard title="Monthly Footprint" value={`${wallet.monthlyFootprint} kg`} subtitle="CO₂ this month" icon={Zap} color="blue" trend={footprintTrend} className={isDark ? 'bg-slate-800/60 backdrop-blur-xl border-slate-700/50' : 'bg-white shadow-xl shadow-blue-500/5'} />
        <StatCard title="Money Saved" value={`₹${wallet.moneySaved}`} subtitle="vs avg consumer" icon={TrendingUp} color="purple" trend={Math.round(((wallet.moneySaved - 75) / 75) * 100)} className={isDark ? 'bg-slate-800/60 backdrop-blur-xl border-slate-700/50' : 'bg-white shadow-xl shadow-purple-500/5'} />
        <StatCard title="Items Recycled" value={`${wallet.recycledCount || 1}`} subtitle="This quarter" icon={Recycle} color="orange" className={isDark ? 'bg-slate-800/60 backdrop-blur-xl border-slate-700/50' : 'bg-white shadow-xl shadow-orange-500/5'} />
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 p-6 rounded-3xl border shadow-lg ${isDark ? 'bg-slate-800/40 backdrop-blur-xl border-slate-700/50' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`font-extrabold text-lg ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Carbon Footprint Trend</h3>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{trendText}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${totalReduction < 0 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-eco-500/10 text-eco-500 border-eco-500/20'}`}>
              {badgeText}
            </span>
          </div>
          <div className="h-64"><Line data={lineChartData} options={chartOptions} /></div>
        </div>
        <div className={`p-6 rounded-3xl border shadow-lg flex flex-col ${isDark ? 'bg-slate-800/40 backdrop-blur-xl border-slate-700/50' : 'bg-white border-slate-200'}`}>
          <h3 className={`font-extrabold text-lg mb-6 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Impact by Category</h3>
          <div className="h-64 flex-1"><Doughnut data={doughnutData} options={doughnutOptions} /></div>
        </div>
      </motion.div>

      {/* Eco Achievements - Gamification */}
      <motion.div variants={itemVariants} className={`p-6 rounded-3xl border shadow-lg relative overflow-hidden ${isDark ? 'bg-slate-800/40 backdrop-blur-xl border-slate-700/50' : 'bg-white border-slate-200'}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 blur-3xl rounded-full" />
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            <h3 className={`font-extrabold text-lg ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Eco Achievements</h3>
          </div>
          <Link to="/dashboard/wallet" className="text-sm text-eco-500 hover:text-eco-600 font-bold flex items-center gap-1 transition-colors">View all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
          {[
            { icon: '🌱', title: 'First Eco Buy', desc: 'Purchased your first 80+ eco score product', unlocked: true },
            { icon: '♻️', title: 'Recycler', desc: 'Recycled your first product', unlocked: true },
            { icon: '🔧', title: 'Repair Hero', desc: 'Choose to repair instead of replace', unlocked: false },
            { icon: '⚡', title: 'Carbon Cutter', desc: 'Reduce footprint by 20%', unlocked: false },
          ].map((badge, i) => (
            <motion.div whileHover={{ scale: 1.02 }} key={i} className={`p-4 rounded-2xl text-center border transition-all duration-300 ${badge.unlocked ? (isDark ? 'bg-gradient-to-br from-eco-900/40 to-slate-800 border-eco-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'bg-gradient-to-br from-eco-50 to-white border-eco-200 shadow-sm') : (isDark ? 'bg-slate-800/30 border-slate-700/50 opacity-50 grayscale' : 'bg-slate-50 border-slate-200 opacity-60 grayscale')}`}>
              <div className="text-3xl mb-2 drop-shadow-md">{badge.icon}</div>
              <p className={`text-sm font-bold mb-1 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{badge.title}</p>
              <p className={`text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{badge.desc}</p>
              {badge.unlocked && <span className="inline-block mt-2 text-xs text-eco-500 font-extrabold bg-eco-500/10 px-2 py-1 rounded-md">✓ Unlocked</span>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Top Products Carousel / Grid */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`font-extrabold text-xl ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Trending Eco Products</h3>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Highest sustainability ratings this week</p>
          </div>
          <Link to="/dashboard/search" className="text-sm text-eco-500 hover:text-eco-600 font-bold flex items-center gap-1 transition-colors">See all <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />) :
            products.length > 0 ? products.map((p, i) => (
              <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <ProductCard product={p} />
              </motion.div>
            )) :
              <div className="col-span-4 text-center py-16 bg-slate-100 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                <Brain className="w-12 h-12 mx-auto mb-4 opacity-30 text-slate-500" />
                <h4 className="font-bold text-lg text-slate-700 dark:text-slate-300 mb-2">No products found</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Start the backend & seed the database to see products.</p>
                <code className="px-3 py-1.5 bg-white dark:bg-slate-900 rounded-lg shadow-sm border dark:border-slate-700 text-eco-500 font-mono text-sm">npm run seed</code>
              </div>
          }
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
