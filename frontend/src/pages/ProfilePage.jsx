import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Save, Award, Wallet, Calendar } from 'lucide-react';
import { setCredentials } from '../redux/slices/authSlice';
import { updateProfile } from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || '',
  });
  const [updating, setUpdating] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Name and Email are required');
      return;
    }

    setUpdating(true);
    try {
      const { data } = await updateProfile(formData);
      dispatch(setCredentials({ ...user, ...data.data }));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
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
          My Profile
        </h1>
        <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Manage your account credentials, view achievements, and track carbon metrics.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left: Summary Avatar card */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className={`p-6 rounded-2xl border text-center ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-eco-400 to-teal-500 flex items-center justify-center text-white text-3xl font-black mx-auto mb-4 shadow-eco">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{user?.name || 'User'}</h3>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>@{user?.username || 'username'}</p>
            <span className="badge-eco mt-3 inline-block font-semibold uppercase tracking-wider text-[10px]">
              {user?.role || 'User'} Account
            </span>
          </div>

          <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'}`}>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>wallet balance</h4>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-eco-500/10 text-eco-400 rounded-lg">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-xl font-bold ${isDark ? 'text-slate-250' : 'text-slate-850'}`}>{user?.carbonWallet?.balance || 450} pts</p>
                <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Green reward points</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right: Form edits */}
        <motion.div variants={itemVariants} className="md:col-span-2">
          <form onSubmit={handleUpdateProfile} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
            <h3 className={`font-bold text-sm ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Edit Contact Information</h3>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><User className="w-4 h-4" /></span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                      isDark ? 'bg-slate-900/40 border-slate-750 text-slate-200 focus:border-eco-500/60' : 'bg-white border-slate-300 text-slate-900 focus:border-eco-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Username</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><User className="w-4 h-4" /></span>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                      isDark ? 'bg-slate-900/40 border-slate-750 text-slate-200 focus:border-eco-500/60' : 'bg-white border-slate-300 text-slate-900 focus:border-eco-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><Mail className="w-4 h-4" /></span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                      isDark ? 'bg-slate-900/40 border-slate-750 text-slate-200 focus:border-eco-500/60' : 'bg-white border-slate-300 text-slate-900 focus:border-eco-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"><Phone className="w-4 h-4" /></span>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs outline-none transition-all ${
                      isDark ? 'bg-slate-900/40 border-slate-750 text-slate-200 focus:border-eco-500/60' : 'bg-white border-slate-300 text-slate-900 focus:border-eco-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-700/20">
              <button
                type="submit"
                disabled={updating}
                className="btn-primary flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Updates</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
