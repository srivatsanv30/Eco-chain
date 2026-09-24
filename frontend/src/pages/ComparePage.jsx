import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitCompare, X, Trash2, Award, Leaf, Clock, DollarSign, Zap, Shield } from 'lucide-react';
import { toggleCompareProduct, clearCompare } from '../redux/slices/productSlice';
import { EcoScoreBadge, EnergyRatingBadge, EmptyState } from '../components/ui/EcoComponents';
import ProductImage from '../components/ui/ProductImage';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7'];

const MetricRow = ({ label, values, isDark, winner }) => (
  <div className={`grid gap-4 py-3 border-b justify-center ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}
    style={{ gridTemplateColumns: `180px repeat(${values.length}, minmax(250px, 400px))` }}>
    <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</span>
    {values.map((val, i) => (
      <div key={i} className="text-center px-2">
        <span className={`text-xs font-semibold leading-relaxed inline-block ${i === winner ? 'text-eco-400' : isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          {i === winner && '🏆 '}{val}
        </span>
      </div>
    ))}
  </div>
);

const ComparePage = () => {
  const dispatch = useDispatch();
  const { compareList } = useSelector(state => state.products);
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';

  if (compareList.length === 0) {
    return (
      <EmptyState
        icon={GitCompare}
        title="No products to compare"
        description="Add up to 4 products using the compare icon on product cards or search page."
        action={<Link to="/dashboard/search" className="btn-primary">Browse Products</Link>}
      />
    );
  }

  const radarData = {
    labels: ['Eco Score', 'Repairability', 'Lifespan', 'Energy', 'Value'],
    datasets: compareList.map((p, i) => ({
      label: p.productName || p.name,
      data: [
        p.ecoScore,
        p.repairabilityScore * 10,
        Math.min(p.lifespanYears * 7, 100),
        p.energyRating === 'A++' ? 100 : p.energyRating === 'A+' ? 85 : p.energyRating === 'A' ? 70 : p.energyRating === 'B' ? 50 : 30,
        Math.max(0, 100 - (p.price / 2000)),
      ],
      borderColor: COLORS[i],
      backgroundColor: COLORS[i] + '18',
      borderWidth: 2,
      pointBackgroundColor: COLORS[i],
      pointRadius: 4,
    }))
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: isDark ? '#94a3b8' : '#64748b', padding: 16, font: { size: 11 } } }, tooltip: { backgroundColor: '#1e293b' } },
    scales: {
      r: {
        min: 0, max: 100,
        angleLines: { color: isDark ? 'rgba(71,85,105,0.5)' : 'rgba(226,232,240,0.8)' },
        grid: { color: isDark ? 'rgba(71,85,105,0.5)' : 'rgba(226,232,240,0.8)' },
        pointLabels: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 11 } },
        ticks: { display: false },
      }
    }
  };

  const getWinner = (values, lowerBetter = false) => {
    const parsed = values.map(Number);
    return lowerBetter ? parsed.indexOf(Math.min(...parsed)) : parsed.indexOf(Math.max(...parsed));
  };

  const bestEco = getWinner(compareList.map(p => p.ecoScore));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Product Comparison</h1>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Compare up to 4 products side-by-side</p>
        </div>
        <button onClick={() => dispatch(clearCompare())} className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors">
          <Trash2 className="w-3.5 h-3.5" /> Clear All
        </button>
      </div>

      {/* Product Headers */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px] pt-4">
          <div className={`grid gap-4 mb-4 justify-center`} style={{ gridTemplateColumns: `180px repeat(${compareList.length}, minmax(250px, 400px))` }}>
            <div />
            {compareList.map((p, i) => (
              <motion.div key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`relative p-4 rounded-2xl border text-center ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}
                style={{ borderTop: `3px solid ${COLORS[i]}` }}>
                {i === bestEco && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className={`badge-eco text-xs flex items-center gap-1 px-2 py-1 rounded-full ${isDark ? 'bg-slate-800' : 'bg-white'}`}><Award className="w-3 h-3" />Best Eco</span>
                  </div>
                )}
                <button onClick={() => dispatch(toggleCompareProduct(p))} className="absolute top-2 right-2 p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-700">
                  <X className="w-3.5 h-3.5" />
                </button>
                <p className={`text-xs mb-1 mt-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{p.brand}</p>
                <ProductImage product={p} className="w-full max-w-[160px] h-32 object-contain mx-auto my-3 rounded-lg" />
                <h3 className={`font-bold text-sm mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{p.productName || p.name}</h3>
                <EcoScoreBadge score={p.ecoScore} />
                <p className="text-lg font-black text-eco-400 mt-2">₹{Number(p.price).toLocaleString('en-IN')}</p>
                <EnergyRatingBadge rating={p.energyRating} />
              </motion.div>
            ))}
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
            <h3 className={`font-bold mb-3 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Detailed Comparison</h3>
            <MetricRow label="Eco Score" values={compareList.map(p => `${p.ecoScore}/100`)} isDark={isDark} winner={getWinner(compareList.map(p => p.ecoScore))} />
            <MetricRow label="Carbon Footprint" values={compareList.map(p => `${p.carbonFootprint} kg`)} isDark={isDark} winner={getWinner(compareList.map(p => p.carbonFootprint), true)} />
            <MetricRow label="Repairability" values={compareList.map(p => `${p.repairabilityScore}/10`)} isDark={isDark} winner={getWinner(compareList.map(p => p.repairabilityScore))} />
            <MetricRow label="Lifespan" values={compareList.map(p => `${p.lifespanYears} yrs`)} isDark={isDark} winner={getWinner(compareList.map(p => p.lifespanYears))} />
            <MetricRow label="Maintenance/yr" values={compareList.map(p => `₹${Number(p.maintenanceCostYear).toLocaleString('en-IN')}`)} isDark={isDark} winner={getWinner(compareList.map(p => p.maintenanceCostYear), true)} />
            <MetricRow label="Warranty" values={compareList.map(p => `${p.warrantyMonths} mo`)} isDark={isDark} winner={getWinner(compareList.map(p => p.warrantyMonths))} />
            <MetricRow label="Energy Rating" values={compareList.map(p => p.energyRating)} isDark={isDark} winner={null} />
            <MetricRow label="Spare Parts" values={compareList.map(p => p.sparePartsAvailable ? 'Available' : 'Limited')} isDark={isDark} winner={null} />
            
            {/* Added specifications and details */}
            <div className={`mt-6 border-t pt-4 ${isDark ? 'border-slate-700/50' : 'border-slate-100'}`}>
              <h4 className={`font-bold text-sm mb-3 ${isDark ? 'text-eco-400' : 'text-eco-600'}`}>Specifications & Analysis</h4>
              
              {/* Dynamic Specs */}
              {[...new Set(compareList.flatMap(p => Object.keys(p.specs || {})))].map(specKey => (
                <MetricRow key={specKey} label={specKey} values={compareList.map(p => (p.specs && p.specs[specKey]) || '-')} isDark={isDark} winner={null} />
              ))}

              <MetricRow label="Description" values={compareList.map(p => p.description || 'N/A')} isDark={isDark} winner={null} />
              <MetricRow label="Materials Used" values={compareList.map(p => p.materials?.join(', ') || 'N/A')} isDark={isDark} winner={null} />
              <MetricRow label="Recycling Info" values={compareList.map(p => p.recyclingInstructions || 'N/A')} isDark={isDark} winner={null} />
              <MetricRow label="AI Summary" values={compareList.map(p => p.aiSummary || 'N/A')} isDark={isDark} winner={null} />
            </div>
          </div>

          {/* Radar Chart */}
          <div className={`mt-4 p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
            <h3 className={`font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Sustainability Radar</h3>
            <div className="h-72"><Radar data={radarData} options={radarOptions} /></div>
          </div>
        </div>
      </div>

      {compareList.length < 4 && (
        <div className={`p-4 rounded-2xl border border-dashed text-center ${isDark ? 'border-slate-700 text-slate-600' : 'border-slate-300 text-slate-400'}`}>
          <Link to="/dashboard/search" className="flex items-center justify-center gap-2 text-sm hover:text-eco-400 transition-colors">
            <GitCompare className="w-4 h-4" /> Add {4 - compareList.length} more product{compareList.length < 3 ? 's' : ''} to compare
          </Link>
        </div>
      )}
    </div>
  );
};

export default ComparePage;
