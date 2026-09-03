import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Wrench, Star, Phone, MapPin, Clock, ChevronRight, IndianRupee } from 'lucide-react';
import { getRepairCenters } from '../services/api';
import { Skeleton } from '../components/ui/EcoComponents';

const RepairCenterCard = ({ center, i, isDark }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
    whileHover={{ y: -3 }}
    className={`p-5 rounded-2xl border transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-eco-500/30' : 'bg-white border-slate-200 hover:border-eco-400'}`}>
    <div className="flex items-start justify-between mb-3">
      <div>
        <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{center.name}</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <MapPin className="w-3.5 h-3.5 text-slate-500" />
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{center.address}</p>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-1 mb-3">
      {Array.from({ length: 5 }).map((_, j) => (
        <Star key={j} className={`w-3.5 h-3.5 ${j < Math.round(center.rating) ? 'text-amber-400 fill-current' : 'text-slate-600'}`} />
      ))}
      <span className={`text-xs ml-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{center.rating}/5</span>
    </div>
    <div className="flex flex-wrap gap-1.5 mb-4">
      {center.services.map(s => (
        <span key={s} className={`text-xs px-2 py-0.5 rounded-lg ${isDark ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{s}</span>
      ))}
    </div>
    <div className="flex gap-2">
      <a href={`tel:${center.phone}`} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm border transition-all ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
        <Phone className="w-3.5 h-3.5" /> Call
      </a>
      <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm bg-eco-500 text-white hover:bg-eco-600 transition-all">
        <ChevronRight className="w-3.5 h-3.5" /> Book Appointment
      </button>
    </div>
  </motion.div>
);

const RepairCenterPage = () => {
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const { data } = await getRepairCenters();
        setCenters(data.data || []);
      } catch {
        // Fallback mock data
        setCenters([
          { _id: '1', name: 'Chennai Tech Repair', address: 'Mount Road, Chennai, Tamil Nadu', rating: 4.8, services: ['Electronics', 'Phones', 'Laptops'], phone: '+91 44-555-0101' },
          { _id: '2', name: 'Kovai Appliance Care', address: 'RS Puram, Coimbatore, Tamil Nadu', rating: 4.5, services: ['Appliances', 'HVAC'], phone: '+91 422-555-0202' },
          { _id: '3', name: 'Madurai FixIt Station', address: 'Anna Nagar, Madurai, Tamil Nadu', rating: 4.6, services: ['Electronics', 'Gaming'], phone: '+91 452-555-0303' },
          { _id: '4', name: 'Trichy QuickFix Lab', address: 'Thillai Nagar, Trichy, Tamil Nadu', rating: 4.3, services: ['Phones', 'Cameras'], phone: '+91 431-555-0404' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Repair Centers</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Find certified repair shops near you. Choose repair over replace.</p>
      </div>

      {/* Repair Cost Estimator */}
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-eco-500/5 border-eco-500/20' : 'bg-eco-50 border-eco-200'}`}>
        <div className="flex items-center gap-2 mb-1">
          <IndianRupee className="w-4 h-4 text-eco-400" />
          <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Repair vs Replace Calculator</h3>
        </div>
        <p className={`text-sm mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Use the AI Insights feature on a product page to get a personalized repair vs replace recommendation.</p>
        <div className="grid sm:grid-cols-3 gap-3 text-center">
          {[
            { icon: '₹', label: 'Average Repair Cost', value: '₹5,000 – ₹15,000' },
            { icon: '♻️', label: 'CO₂ Saved (vs Replace)', value: '40 – 80 kg' },
            { icon: '⏱️', label: 'Typical Turnaround', value: '1 – 3 days' },
          ].map((stat, i) => (
            <div key={i} className={`p-3 rounded-xl ${isDark ? 'bg-slate-800/50' : 'bg-white'}`}>
              <div className="text-xl mb-1">{stat.icon}</div>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</p>
              <p className={`font-bold text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
        {loading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-56" />) :
          centers.map((c, i) => <RepairCenterCard key={c._id} center={c} i={i} isDark={isDark} />)
        }
      </div>
    </div>
  );
};

export default RepairCenterPage;
