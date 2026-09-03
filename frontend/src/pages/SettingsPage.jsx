import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Settings, Sun, Moon, Bell, Shield, Globe, Save } from 'lucide-react';
import { toggleTheme, setTheme } from '../redux/slices/themeSlice';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';

  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    weeklyDigest: false,
    scoreDropAlert: true,
    ecoUnit: 'metric', // metric (kg CO2) vs imperial (lbs CO2)
    defaultCategory: 'All',
  });

  const handleToggle = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelect = (key, val) => {
    setPreferences(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveSettings = () => {
    toast.success('Preferences saved successfully!');
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2.5`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-eco-500 to-teal-500 flex items-center justify-center text-white shadow-eco">
            <Settings className="w-5 h-5" />
          </div>
          Settings
        </h1>
        <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Configure your user experience, notification rules, and default reporting preferences.
        </p>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left pane: Quick Navigation/Links */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className={`p-4 rounded-xl border font-semibold text-xs uppercase tracking-wider ${isDark ? 'bg-slate-800/20 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-550'}`}>
            Configuration Menu
          </div>
          {['Appearance', 'Notifications', 'Calculation Units', 'Security & Access'].map((menu, i) => (
            <button key={menu} className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              i === 0 
                ? (isDark ? 'bg-eco-500/10 text-eco-400' : 'bg-eco-50 text-eco-500') 
                : (isDark ? 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800')
            }`}>
              {menu}
            </button>
          ))}
        </motion.div>

        {/* Right pane: Core fields */}
        <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">
          {/* Appearance card */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              <Sun className="w-4 h-4 text-amber-400" /> Theme Configuration
            </h3>
            <p className={`text-xs mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Select your visual style for the platform dashboards.</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => dispatch(setTheme('light'))}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  !isDark 
                    ? 'border-eco-500 bg-eco-500/5 text-eco-500' 
                    : 'border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <Sun className="w-4 h-4" /> Light Mode
              </button>
              <button
                onClick={() => dispatch(setTheme('dark'))}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                  isDark 
                    ? 'border-eco-400 bg-eco-500/10 text-eco-400' 
                    : 'border-slate-200 text-slate-500 hover:border-slate-350'
                }`}
              >
                <Moon className="w-4 h-4" /> Dark Mode
              </button>
            </div>
          </div>

          {/* Notifications Card */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'}`}>
            <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              <Bell className="w-4 h-4 text-blue-400" /> Notifications & Alerts
            </h3>
            <div className="space-y-4">
              {[
                { key: 'emailAlerts', title: 'Carbon Budget Alerts', desc: 'Notify me when weekly household product carbon output goes up.' },
                { key: 'scoreDropAlert', title: 'Eco Score Thresholds', desc: 'Notify me if saved product specs or lifespan estimates are updated.' },
                { key: 'weeklyDigest', title: 'Weekly Digest Newsletter', desc: 'Summarized lifecycle stats and energy saving tips directly to email.' },
              ].map(item => (
                <div key={item.key} className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{item.title}</h4>
                    <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.desc}</p>
                  </div>
                  <button
                    onClick={() => handleToggle(item.key)}
                    className={`w-10 h-6 rounded-full transition-all shrink-0 ${
                      preferences[item.key] ? 'bg-eco-500 flex justify-end p-0.5' : 'bg-slate-600 flex justify-start p-0.5'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Units Card */}
          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h3 className={`font-bold mb-4 flex items-center gap-2 text-sm ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              <Globe className="w-4 h-4 text-purple-400" /> Local Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Carbon Units</h4>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>System-wide measurement unit configuration.</p>
                </div>
                <div className={`flex rounded-lg border overflow-hidden p-0.5 ${isDark ? 'border-slate-750 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
                  <button
                    onClick={() => handleSelect('ecoUnit', 'metric')}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold ${
                      preferences.ecoUnit === 'metric' ? 'bg-eco-500 text-white' : 'text-slate-500'
                    }`}
                  >
                    Metric (kg)
                  </button>
                  <button
                    onClick={() => handleSelect('ecoUnit', 'imperial')}
                    className={`px-3 py-1 rounded-md text-[10px] font-bold ${
                      preferences.ecoUnit === 'imperial' ? 'bg-eco-500 text-white' : 'text-slate-500'
                    }`}
                  >
                    Imperial (lbs)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button onClick={handleSaveSettings} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Preferences
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
