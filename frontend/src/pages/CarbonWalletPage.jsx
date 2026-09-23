import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Wallet, Leaf, TrendingDown, IndianRupee, Recycle, ShoppingBag, Award, ArrowRight } from 'lucide-react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { getCarbonWallet } from '../services/api';
import { StatCard } from '../components/ui/Card';
import { Skeleton } from '../components/ui/EcoComponents';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const ACHIEVEMENTS = [
  { icon: '🌱', title: 'First Eco Buy', desc: 'Purchased first 80+ score product', unlocked: true, points: 50 },
  { icon: '♻️', title: 'Recycler', desc: 'Recycled your first product', unlocked: true, points: 100 },
  { icon: '🔧', title: 'Repair Hero', desc: 'Chose repair over replace', unlocked: false, points: 150 },
  { icon: '⚡', title: 'Energy Saver', desc: 'All purchases rated A or above', unlocked: false, points: 200 },
  { icon: '🌍', title: 'Carbon Cutter', desc: 'Reduced footprint by 20%', unlocked: true, points: 250 },
  { icon: '🏆', title: 'Eco Champion', desc: 'Eco score 90+ on 5 products', unlocked: false, points: 500 },
];

const CarbonWalletPage = () => {
  const { user } = useSelector(state => state.auth);
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);

  const wallet = user?.carbonWallet || { balance: 450, monthlyFootprint: 120, wasteGenerated: 12, moneySaved: 85, purchasedCount: 4, recycledCount: 1 };

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const footprints = [145, 132, 118, 110, 108, wallet.monthlyFootprint];
  const savings = [30, 45, 55, 65, 75, wallet.moneySaved];

  const footprintTrend = Math.round(((wallet.monthlyFootprint - 108) / 108) * 100);
  const moneySavedTrend = Math.round(((wallet.moneySaved - 75) / 75) * 100);

  const lineData = {
    labels: MONTHS,
    datasets: [{
      label: 'Carbon Footprint (kg CO₂)',
      data: footprints,
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.08)',
      borderWidth: 2.5,
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#22c55e',
      pointRadius: 5,
    }]
  };

  const barData = {
    labels: MONTHS,
    datasets: [{
      label: 'Money Saved ($)',
      data: savings,
      backgroundColor: 'rgba(168,85,247,0.7)',
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', titleColor: '#94a3b8', bodyColor: '#e2e8f0' } },
    scales: {
      x: { grid: { color: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(226,232,240,0.8)' }, ticks: { color: isDark ? '#64748b' : '#94a3b8', font: { size: 11 } } },
      y: { grid: { color: isDark ? 'rgba(51,65,85,0.5)' : 'rgba(226,232,240,0.8)' }, ticks: { color: isDark ? '#64748b' : '#94a3b8', font: { size: 11 } } },
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Carbon Wallet</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Track your environmental impact and eco-achievements</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${isDark ? 'bg-eco-500/10 border-eco-500/20' : 'bg-eco-50 border-eco-200'}`}>
          <Leaf className="w-4 h-4 text-eco-400" />
          <span className="font-bold text-eco-400">{wallet.balance} pts</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monthly Footprint" value={`${wallet.monthlyFootprint} kg`} subtitle="CO₂ this month" icon={Leaf} color="eco" trend={footprintTrend} />
        <StatCard title="Waste Generated" value={`${wallet.wasteGenerated} kg`} subtitle="This quarter" icon={TrendingDown} color="orange" />
        <StatCard title="Money Saved" value={`₹${wallet.moneySaved}`} subtitle="vs avg consumer" icon={IndianRupee} color="purple" trend={moneySavedTrend} />
        <StatCard title="Products Recycled" value={`${wallet.recycledCount || 1}`} subtitle="Total recycled" icon={Recycle} color="blue" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
          <h3 className={`font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Carbon Footprint (6 months)</h3>
          <div className="h-52"><Line data={lineData} options={chartOpts} /></div>
        </div>
        <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
          <h3 className={`font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Money Saved (6 months)</h3>
          <div className="h-52"><Bar data={barData} options={chartOpts} /></div>
        </div>
      </div>

      {/* Eco Progress */}
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
        <h3 className={`font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Eco Progress</h3>
        <div className="space-y-3">
          {[
            { label: 'Carbon Reduction Goal', value: 34, target: 50, color: 'bg-eco-400' },
            { label: 'Recycling Rate', value: 60, target: 80, color: 'bg-blue-400' },
            { label: 'Eco Purchase Ratio', value: 75, target: 100, color: 'bg-purple-400' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.label}</span>
                <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.value}% / {item.target}%</span>
              </div>
              <div className={`h-2 rounded-full ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <motion.div initial={{ width: 0 }} animate={{ width: `${(item.value / item.target) * 100}%` }} transition={{ duration: 1, delay: i * 0.2 }}
                  className={`h-full rounded-full ${item.color}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Eco Achievements</h3>
          </div>
          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length} unlocked</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {ACHIEVEMENTS.map((badge, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
              className={`p-3 rounded-2xl text-center border transition-all relative ${badge.unlocked
                ? isDark ? 'bg-eco-500/10 border-eco-500/20' : 'bg-eco-50 border-eco-200'
                : isDark ? 'border-slate-700/50 opacity-40 grayscale' : 'border-slate-200 opacity-40 grayscale'}`}>
              <div className="text-2xl mb-1">{badge.icon}</div>
              <p className={`text-xs font-semibold leading-tight ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{badge.title}</p>
              <p className={`text-xs mt-0.5 text-eco-400 font-medium`}>+{badge.points} pts</p>
              {badge.unlocked && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-eco-500 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarbonWalletPage;
