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
const CARBON_DATA = [145, 132, 118, 110, 108, 95];

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

  const wallet = user?.carbonWallet || { balance: 450, monthlyFootprint: 95, wasteGenerated: 12, moneySaved: 85 };

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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-start justify-between">
        <div>
          <h1 className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Good morning, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Here's your sustainability overview for today.</p>
        </div>
        <Link to="/dashboard/search" className="btn-primary hidden sm:flex">
          <ShoppingBag className="w-4 h-4" />
          <span>Explore Products</span>
        </Link>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Carbon Balance" value={`${wallet.balance} pts`} subtitle="Green credits earned" icon={Leaf} color="eco" trend={12} />
        <StatCard title="Monthly Footprint" value={`${wallet.monthlyFootprint} kg`} subtitle="CO₂ this month" icon={Zap} color="blue" trend={-8} />
        <StatCard title="Money Saved" value={`₹${wallet.moneySaved}`} subtitle="vs avg consumer" icon={TrendingUp} color="purple" trend={15} />
        <StatCard title="Items Recycled" value={`${wallet.recycledCount || 1}`} subtitle="This quarter" icon={Recycle} color="orange" />
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid lg:grid-cols-3 gap-4">
        <div className={`lg:col-span-2 p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Carbon Footprint Trend</h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>↓ 34% reduction over 6 months</p>
            </div>
            <span className="badge-eco">Improving ↓</span>
          </div>
          <div className="h-52"><Line data={lineChartData} options={chartOptions} /></div>
        </div>
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
          <h3 className={`font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Footprint by Category</h3>
          <div className="h-52"><Doughnut data={doughnutData} options={doughnutOptions} /></div>
        </div>
      </motion.div>

      {/* Eco Achievements */}
      <motion.div variants={itemVariants} className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Eco Achievements</h3>
          <Link to="/dashboard/wallet" className="text-xs text-eco-400 hover:text-eco-300 font-medium flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '🌱', title: 'First Eco Buy', desc: 'Purchased your first 80+ eco score product', unlocked: true },
            { icon: '♻️', title: 'Recycler', desc: 'Recycled your first product', unlocked: true },
            { icon: '🔧', title: 'Repair Hero', desc: 'Choose to repair instead of replace', unlocked: false },
            { icon: '⚡', title: 'Carbon Cutter', desc: 'Reduce footprint by 20%', unlocked: false },
          ].map((badge, i) => (
            <div key={i} className={`p-3 rounded-xl text-center border transition-all ${badge.unlocked ? (isDark ? 'bg-eco-500/10 border-eco-500/20' : 'bg-eco-50 border-eco-200') : (isDark ? 'border-slate-700/50 opacity-40' : 'border-slate-200 opacity-50')}`}>
              <div className="text-2xl mb-1.5">{badge.icon}</div>
              <p className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{badge.title}</p>
              <p className={`text-xs mt-0.5 line-clamp-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{badge.desc}</p>
              {badge.unlocked && <span className="inline-block mt-1.5 text-xs text-eco-400 font-medium">✓ Unlocked</span>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Products */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold text-lg ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Top Eco Products</h3>
          <Link to="/dashboard/search" className="text-xs text-eco-400 hover:text-eco-300 font-medium flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />) :
            products.length > 0 ? products.map(p => <ProductCard key={p._id} product={p} />) :
              <div className="col-span-4 text-center py-12 text-slate-500">
                <Brain className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>Start the backend & seed the database to see products.</p>
                <p className="text-xs mt-1 text-slate-600">Run: <code className="font-mono">npm run seed</code> in /backend</p>
              </div>
          }
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
