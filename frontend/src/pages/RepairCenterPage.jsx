import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  Star,
  Phone,
  MapPin,
  ChevronRight,
  IndianRupee,
  Search,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  X,
  Filter
} from 'lucide-react';
import { getRepairCenters } from '../services/api';
import { Skeleton } from '../components/ui/EcoComponents';

const SERVICE_CATEGORIES = [
  'All',
  'Phones',
  'Laptops',
  'Appliances',
  'TVs & Displays',
  'Audio',
  'Gaming',
  'Air Conditioners',
  'Refrigerators'
];

const RepairCenterCard = ({ center, i, isDark, onBook }) => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
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
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className={`font-bold text-base ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                {center.name}
              </h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" /> Certified
              </span>
            </div>
            <div className="flex items-start gap-1.5 mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'} leading-relaxed`}>
                {center.address}
              </p>
            </div>
          </div>

          {/* Cost badge */}
          {center.estimatedCostRange && (
            <span
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold flex-shrink-0 ${
                isDark ? 'bg-slate-700/80 text-emerald-400' : 'bg-slate-100 text-emerald-700'
              }`}
              title={`Cost Range: ${center.estimatedCostRange}`}
            >
              {center.estimatedCostRange}
            </span>
          )}
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3 mt-1">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, j) => (
              <Star
                key={j}
                className={`w-3.5 h-3.5 ${
                  j < Math.round(center.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300 dark:text-slate-700'
                }`}
              />
            ))}
          </div>
          <span className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            {center.rating} / 5.0
          </span>
          <span className="text-[11px] text-slate-400">· Turnaround 1–2 days</span>
        </div>

        {/* Services Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {center.services?.map((s) => (
            <span
              key={s}
              className={`text-xs px-2.5 py-0.5 rounded-md font-medium transition-colors ${
                isDark
                  ? 'bg-slate-700/60 text-slate-300 border border-slate-600/40'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-2">
        <a
          href={`tel:${center.phone}`}
          className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
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
          className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
            isDark
              ? 'border-slate-700 text-slate-300 hover:bg-slate-700/70 hover:text-white'
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-blue-500" /> Map
        </a>

        <button
          onClick={() => onBook(center)}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-sm"
        >
          Book Repair <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

const RepairCenterPage = () => {
  const { mode } = useSelector((state) => state.theme);
  const isDark = mode === 'dark';

  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All');

  // Booking Modal State
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [bookingData, setBookingData] = useState({
    deviceType: 'Phone',
    issue: '',
    preferredDate: '',
    contactName: '',
    contactPhone: ''
  });

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const { data } = await getRepairCenters();
        if (data.data) {
          setCenters(data.data);
        }
      } catch (err) {
        console.error('Failed to load repair centers from database', err);
        setCenters([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);

  // Compute available cities from centers
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
        center.services?.some((s) => s.toLowerCase().includes(q));

      const matchesService =
        selectedService === 'All' ||
        center.services?.some((s) => s.toLowerCase().includes(selectedService.toLowerCase()));

      const matchesCity =
        selectedCity === 'All' || center.address.toLowerCase().includes(selectedCity.toLowerCase());

      return matchesSearch && matchesService && matchesCity;
    });
  }, [centers, searchQuery, selectedService, selectedCity]);

  const handleBookSubmit = (e) => {
    e.preventDefault();
    setBookingSubmitted(true);
    setTimeout(() => {
      setSelectedCenter(null);
      setBookingSubmitted(false);
      setBookingData({
        deviceType: 'Phone',
        issue: '',
        preferredDate: '',
        contactName: '',
        contactPhone: ''
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
              <Wrench className="w-5 h-5" />
            </span>
            <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Certified Repair Centers
            </h1>
          </div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Find verified repair labs and authorized technicians across India. Choose repair over replace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${
            isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
          }`}>
            🌿 {filteredCenters.length} verified centers available
          </span>
        </div>
      </div>

      {/* Repair vs Replace Calculator Banner */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isDark
            ? 'bg-gradient-to-r from-emerald-950/30 to-slate-900/60 border-emerald-500/20'
            : 'bg-gradient-to-r from-emerald-50/70 to-teal-50/50 border-emerald-200'
        }`}
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <IndianRupee className="w-4 h-4" />
            </div>
            <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              Repair vs Replace Impact Calculator
            </h3>
          </div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
            Right to Repair Initiative
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          {[
            { icon: '₹', label: 'Average Repair Cost', value: '₹1,500 – ₹6,000', sub: 'Save 70%+ vs buy new' },
            { icon: '♻️', label: 'CO₂ Emissions Prevented', value: '40 – 85 kg', sub: 'Equal to 15 planted trees' },
            { icon: '⏱️', label: 'Typical Turnaround', value: '24 – 48 Hours', sub: 'Genuine OEM parts warranty' }
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

      {/* Search and Filter Controls */}
      <div className={`p-4 rounded-2xl border space-y-3 ${
        isDark ? 'bg-slate-800/40 border-slate-700/60' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by shop name, service, device, or street address..."
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

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
          {SERVICE_CATEGORIES.map((cat) => {
            const isSelected = selectedService === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedService(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isDark
                    ? 'bg-slate-700/60 text-slate-300 hover:bg-slate-700 hover:text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Center Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)
          : filteredCenters.map((center, i) => (
              <RepairCenterCard
                key={center._id || i}
                center={center}
                i={i}
                isDark={isDark}
                onBook={(c) => setSelectedCenter(c)}
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
          <Wrench className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className={`font-bold text-lg ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
            No repair centers match your search
          </h3>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Try adjusting your search terms, selecting another city, or resetting the service category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedService('All');
              setSelectedCity('All');
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Booking Appointment Modal */}
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

              {bookingSubmitted ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold">Appointment Request Sent!</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {selectedCenter.name} has received your booking request. A service coordinator will call you within
                    2 hours to confirm your time slot.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookSubmit} className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
                      Appointment Booking
                    </span>
                    <h3 className="text-xl font-bold mt-0.5">{selectedCenter.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" /> {selectedCenter.address}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Device Type</label>
                        <select
                          value={bookingData.deviceType}
                          onChange={(e) => setBookingData({ ...bookingData, deviceType: e.target.value })}
                          className={`w-full p-2.5 rounded-xl text-xs border ${
                            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                          }`}
                        >
                          <option>Smartphone</option>
                          <option>Laptop</option>
                          <option>Tablet</option>
                          <option>Smartwatch</option>
                          <option>Home Appliance</option>
                          <option>Television / Audio</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Preferred Date</label>
                        <input
                          type="date"
                          required
                          value={bookingData.preferredDate}
                          onChange={(e) => setBookingData({ ...bookingData, preferredDate: e.target.value })}
                          className={`w-full p-2.5 rounded-xl text-xs border ${
                            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Issue Description</label>
                      <textarea
                        required
                        placeholder="E.g., Screen flickering, battery drains quickly, overheating..."
                        rows={2}
                        value={bookingData.issue}
                        onChange={(e) => setBookingData({ ...bookingData, issue: e.target.value })}
                        className={`w-full p-2.5 rounded-xl text-xs border ${
                          isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                        }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="Arjun Kumar"
                          value={bookingData.contactName}
                          onChange={(e) => setBookingData({ ...bookingData, contactName: e.target.value })}
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
                          value={bookingData.contactPhone}
                          onChange={(e) => setBookingData({ ...bookingData, contactPhone: e.target.value })}
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
                      Confirm Booking
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

export default RepairCenterPage;
