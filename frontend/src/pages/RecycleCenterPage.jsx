import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Recycle,
  MapPin,
  Phone,
  ChevronRight,
  Search,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  X,
  Filter,
  PackageCheck,
  Sparkles
} from 'lucide-react';
import { getRecycleCenters } from '../services/api';
import { Skeleton } from '../components/ui/EcoComponents';

const MATERIAL_COLORS = {
  Electronics: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/20',
  Batteries: 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/20',
  Plastics: 'bg-yellow-500/15 text-amber-800 dark:text-yellow-400 border border-yellow-500/20',
  Glass: 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border border-teal-500/20',
  Metals: 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border border-slate-500/20',
  Paper: 'bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-500/20',
  'E-Waste': 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/20',
  Cardboard: 'bg-orange-500/15 text-orange-800 dark:text-orange-400 border border-orange-500/20',
  Appliances: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20',
  Tires: 'bg-stone-500/15 text-stone-700 dark:text-stone-400 border border-stone-500/20',
  Furniture: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/20'
};

const ALL_MATERIALS = ['All', ...Object.keys(MATERIAL_COLORS)];

const RecycleCenterCard = ({ center, i, isDark, onSchedule }) => {
  const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${center.name} ${center.address}`
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(i * 0.05, 0.4) }}
      whileHover={{ y: -4 }}
      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-200 shadow-sm hover:shadow-md ${
        isDark
          ? 'bg-slate-800/60 border-slate-700/60 hover:border-emerald-500/40'
          : 'bg-white border-slate-200/90 hover:border-emerald-500/40'
      }`}
    >
      <div>
        {/* Header Info */}
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <Recycle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className={`font-bold text-base truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {center.name}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" /> CPCB Authorized
              </span>
            </div>
            <div className="flex items-start gap-1 mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} leading-relaxed`}>
                {center.address}
              </p>
            </div>
          </div>
        </div>

        {/* Accepted Materials */}
        <div className="mb-4">
          <p className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Accepted Waste Streams
          </p>
          <div className="flex flex-wrap gap-1.5">
            {center.acceptedMaterials?.map((m) => (
              <span
                key={m}
                className={`text-xs px-2.5 py-0.5 rounded-lg font-semibold ${
                  MATERIAL_COLORS[m] || 'bg-slate-500/15 text-slate-600 border border-slate-300'
                }`}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-2">
        <a
          href={`tel:${center.phone}`}
          className={`flex-1 min-w-[85px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
            isDark
              ? 'border-slate-700 text-slate-300 hover:bg-slate-700/70 hover:text-white'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Phone className="w-3.5 h-3.5 text-emerald-500" /> Call
        </a>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 min-w-[95px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
            isDark
              ? 'border-slate-700 text-slate-300 hover:bg-slate-700/70 hover:text-white'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-blue-500" /> Directions
        </a>

        <button
          onClick={() => onSchedule(center)}
          className="flex-1 min-w-[125px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-sm"
        >
          Schedule Drop <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

const RecycleCenterPage = () => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';

  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');

  // Schedule Modal State
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [scheduleSubmitted, setScheduleSubmitted] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    materialCategory: 'E-Waste',
    weightEstimate: '1-5 kg',
    dropDate: '',
    donorName: '',
    donorPhone: ''
  });

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const { data } = await getRecycleCenters();
        if (data.data) {
          setCenters(data.data);
        }
      } catch (err) {
        console.error('Failed to load recycle centers from database', err);
        setCenters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  // Compute available cities
  const availableCities = useMemo(() => {
    const cities = new Set();
    centers.forEach((c) => {
      const parts = c.address.split(',');
      if (parts.length >= 2) {
        cities.add(parts[parts.length - 2].trim());
      }
    });
    return ['All', ...Array.from(cities).sort()];
  }, [centers]);

  // Filtered centers
  const filteredCenters = useMemo(() => {
    return centers.filter((center) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        center.name.toLowerCase().includes(q) ||
        center.address.toLowerCase().includes(q) ||
        center.acceptedMaterials?.some((m) => m.toLowerCase().includes(q));

      const matchesMaterial =
        selectedMaterial === 'All' ||
        center.acceptedMaterials?.some((m) => m.toLowerCase() === selectedMaterial.toLowerCase());

      const matchesCity =
        selectedCity === 'All' || center.address.toLowerCase().includes(selectedCity.toLowerCase());

      return matchesSearch && matchesMaterial && matchesCity;
    });
  }, [centers, searchQuery, selectedMaterial, selectedCity]);

  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    setScheduleSubmitted(true);
    setTimeout(() => {
      setSelectedCenter(null);
      setScheduleSubmitted(false);
      setScheduleData({
        materialCategory: 'E-Waste',
        weightEstimate: '1-5 kg',
        dropDate: '',
        donorName: '',
        donorPhone: ''
      });
    }, 2200);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Recycle className="w-5 h-5" />
            </span>
            <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Certified Recycle & E-Waste Centers
            </h1>
          </div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Find authorized e-waste disposal plants and material reclamation hubs across India. Give materials a second life.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${
            isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            ♻️ {filteredCenters.length} active collection hubs
          </span>
        </div>
      </div>

      {/* Circular Economy Impact Banner */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isDark
            ? 'bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-teal-950/30 border-emerald-500/20'
            : 'bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-emerald-50/80 border-emerald-200'
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              Circular E-Waste Compliance & Carbon Credits
            </h3>
          </div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
            CPCB & SPCB Registered Facilities
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          {[
            { icon: '🏭', label: 'Certified Recycling Hubs', value: '20+ Active Plants', sub: 'Across 10 Indian regions' },
            { icon: '🔋', label: 'Hazardous Waste Diverted', value: '100% Zero-Landfill', sub: 'Safe battery & heavy metal handling' },
            { icon: '🌱', label: 'Circular Rewards', value: '+50 Eco Points / drop', sub: 'Redeemable on carbon footprint' }
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border ${
                isDark ? 'bg-slate-800/60 border-slate-700/60' : 'bg-white/90 border-slate-200/80 shadow-sm'
              }`}
            >
              <div className="text-xl mb-1">{stat.icon}</div>
              <p className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{stat.label}</p>
              <p className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5">{stat.value}</p>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Material Filter Strip */}
      <div className={`p-4 rounded-2xl border space-y-3 ${
        isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by facility name, accepted material, city, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-8 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDark
                  ? 'bg-slate-900/60 border-slate-700 text-slate-100 placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* City Selector */}
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              City:
            </span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-700 text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city === 'All' ? 'All Indian Cities' : city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Badges: Material Streams */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              <Filter className="w-3.5 h-3.5" /> Filter by Accepted Material:
            </span>
            {selectedMaterial !== 'All' && (
              <button
                onClick={() => setSelectedMaterial('All')}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                Clear Filter
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {ALL_MATERIALS.map((mat) => {
              const isSelected = selectedMaterial === mat;
              const colorClass =
                mat === 'All'
                  ? isSelected
                    ? 'bg-emerald-600 text-white'
                    : isDark
                    ? 'bg-slate-700 text-slate-300'
                    : 'bg-slate-100 text-slate-700'
                  : MATERIAL_COLORS[mat];

              return (
                <button
                  key={mat}
                  onClick={() => setSelectedMaterial(mat)}
                  className={`text-xs px-3 py-1 rounded-full font-semibold transition-all ${colorClass} ${
                    isSelected ? 'ring-2 ring-emerald-500 shadow-sm scale-105' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  {mat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)
          : filteredCenters.map((center, i) => (
              <RecycleCenterCard
                key={center._id || i}
                center={center}
                i={i}
                isDark={isDark}
                onSchedule={(c) => setSelectedCenter(c)}
              />
            ))}
      </div>

      {/* Empty State */}
      {!loading && filteredCenters.length === 0 && (
        <div
          className={`text-center py-12 px-4 rounded-2xl border ${
            isDark ? 'bg-slate-800/30 border-slate-700/60' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <Recycle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className={`font-bold text-lg ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            No recycling centers match your filters
          </h3>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Try selecting a different material type, searching another location, or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMaterial('All');
              setSelectedCity('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Schedule Drop-off Modal */}
      <AnimatePresence>
        {selectedCenter && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-lg p-6 rounded-3xl border shadow-2xl relative ${
                isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <button
                onClick={() => setSelectedCenter(null)}
                className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>

              {scheduleSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <PackageCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">Drop-Off Scheduled!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Your collection token has been registered with {selectedCenter.name}. You will receive an SMS reminder
                    and earn 50 EcoChain Carbon Points upon successful handover!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleScheduleSubmit} className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
                      Schedule Recycling Drop-Off
                    </span>
                    <h3 className="text-xl font-bold mt-0.5">{selectedCenter.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {selectedCenter.address}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Waste Stream</label>
                        <select
                          value={scheduleData.materialCategory}
                          onChange={(e) => setScheduleData({ ...scheduleData, materialCategory: e.target.value })}
                          className={`w-full p-2.5 rounded-xl text-xs border ${
                            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                          }`}
                        >
                          {selectedCenter.acceptedMaterials?.map((m) => (
                            <option key={m}>{m}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Estimated Weight</label>
                        <select
                          value={scheduleData.weightEstimate}
                          onChange={(e) => setScheduleData({ ...scheduleData, weightEstimate: e.target.value })}
                          className={`w-full p-2.5 rounded-xl text-xs border ${
                            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                          }`}
                        >
                          <option>Under 1 kg</option>
                          <option>1 – 5 kg</option>
                          <option>5 – 20 kg</option>
                          <option>20+ kg (Bulk / Commercial)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Preferred Drop-Off Date</label>
                      <input
                        type="date"
                        required
                        value={scheduleData.dropDate}
                        onChange={(e) => setScheduleData({ ...scheduleData, dropDate: e.target.value })}
                        className={`w-full p-2.5 rounded-xl text-xs border ${
                          isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Your Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Priya Nair"
                          value={scheduleData.donorName}
                          onChange={(e) => setScheduleData({ ...scheduleData, donorName: e.target.value })}
                          className={`w-full p-2.5 rounded-xl text-xs border ${
                            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={scheduleData.donorPhone}
                          onChange={(e) => setScheduleData({ ...scheduleData, donorPhone: e.target.value })}
                          className={`w-full p-2.5 rounded-xl text-xs border ${
                            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCenter(null)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border ${
                        isDark ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md"
                    >
                      Confirm Drop-Off
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecycleCenterPage;
