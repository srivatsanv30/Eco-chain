import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Recycle, MapPin, Phone, ChevronRight } from 'lucide-react';
import { getRecycleCenters } from '../services/api';
import { Skeleton } from '../components/ui/EcoComponents';

const MATERIAL_COLORS = { Electronics: 'bg-blue-500/15 text-blue-400', Batteries: 'bg-red-500/15 text-red-400', Plastics: 'bg-yellow-500/15 text-yellow-400', Glass: 'bg-teal-500/15 text-teal-400', Metals: 'bg-slate-500/15 text-slate-400', Paper: 'bg-amber-500/15 text-amber-400', 'E-Waste': 'bg-purple-500/15 text-purple-400', Cardboard: 'bg-orange-500/15 text-orange-400', Appliances: 'bg-eco-500/15 text-eco-400', Tires: 'bg-slate-500/15 text-slate-400', Furniture: 'bg-rose-500/15 text-rose-400' };

const RecycleCenterPage = () => {
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const { data } = await getRecycleCenters();
        setCenters(data.data || []);
      } catch {
        setCenters([
          { _id: '1', name: 'EcoPoint Recyclers', address: '22 Green Way, San Francisco, CA', acceptedMaterials: ['Electronics', 'Batteries', 'Plastics', 'Glass'], phone: '+1 415-555-0505' },
          { _id: '2', name: 'TerraLoop Center', address: '99 Earth Blvd, Mountain View, CA', acceptedMaterials: ['Metals', 'Paper', 'Cardboard', 'E-Waste'], phone: '+1 650-555-0606' },
          { _id: '3', name: 'GreenCycle Hub', address: '41 Spruce Ave, Palo Alto, CA', acceptedMaterials: ['Appliances', 'Tires', 'Furniture', 'Electronics'], phone: '+1 650-555-0707' },
        ]);
      } finally { setLoading(false); }
    };
    fetchCenters();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Recycle Centers</h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Find nearby recycling facilities and give your products a second life.</p>
      </div>

      {/* What can you recycle guide */}
      <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-white border-slate-200'}`}>
        <h3 className={`font-bold mb-3 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>What can be recycled?</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(MATERIAL_COLORS).map(mat => (
            <span key={mat} className={`text-xs px-3 py-1 rounded-full font-medium ${MATERIAL_COLORS[mat]}`}>{mat}</span>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-52" />) :
          centers.map((center, i) => (
            <motion.div key={center._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -3 }}
              className={`p-5 rounded-2xl border transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-eco-500/30' : 'bg-white border-slate-200 hover:border-eco-400'}`}>
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-eco-500/10">
                  <Recycle className="w-5 h-5 text-eco-400" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{center.name}</h3>
                  <div className="flex items-start gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-slate-500 mt-0.5 flex-shrink-0" />
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{center.address}</p>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <p className={`text-xs font-medium mb-1.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Accepted Materials</p>
                <div className="flex flex-wrap gap-1.5">
                  {center.acceptedMaterials.map(m => (
                    <span key={m} className={`text-xs px-2 py-0.5 rounded-lg font-medium ${MATERIAL_COLORS[m] || 'bg-slate-500/15 text-slate-400'}`}>{m}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${center.phone}`} className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm border transition-all ${isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                  <Phone className="w-3.5 h-3.5" /> Call
                </a>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm bg-eco-500 text-white hover:bg-eco-600 transition-all">
                  <ChevronRight className="w-3.5 h-3.5" /> Get Directions
                </button>
              </div>
            </motion.div>
          ))
        }
      </div>
    </div>
  );
};

export default RecycleCenterPage;
