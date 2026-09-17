import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Menu, Sun, Moon, Bell, Search, Leaf } from 'lucide-react';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ onMenuClick }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mode } = useSelector(state => state.theme);
  const { user } = useSelector(state => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const isDark = mode === 'dark';

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <header className={`sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b backdrop-blur-xl ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
      {/* Menu btn */}
      <button onClick={onMenuClick}
        className={`lg:hidden p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo (mobile) */}
      <div className="flex items-center gap-1.5 lg:hidden">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-eco-400 to-teal-500 flex items-center justify-center">
          <Leaf className="w-3 h-3 text-white" />
        </div>
        <span className="font-bold gradient-text">EcoChain</span>
      </div>

      {/* Search bar */}
      <div className={`flex-1 max-w-md hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border transition-all ${isDark ? 'bg-slate-800/50 border-slate-700 focus-within:border-eco-500/60' : 'bg-slate-50 border-slate-200 focus-within:border-eco-400'}`}>
        <Search className={`w-4 h-4 shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          className={`flex-1 text-sm outline-none bg-transparent ${isDark ? 'text-slate-200 placeholder:text-slate-600' : 'text-slate-900 placeholder:text-slate-400'}`}
        />
        <kbd className={`hidden md:inline text-xs px-1.5 py-0.5 rounded ${isDark ? 'bg-slate-700 text-slate-500' : 'bg-white text-slate-400 border border-slate-200'}`}>↵</kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <button 
          onClick={() => navigate('/dashboard/notifications')}
          className={`relative p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-eco-400 rounded-full" />
        </button>

        {/* Theme toggle */}
        <motion.button
          onClick={() => dispatch(toggleTheme())}
          whileTap={{ scale: 0.9 }}
          className={`p-2 rounded-xl transition-colors ${isDark ? 'hover:bg-slate-800 text-amber-400' : 'hover:bg-slate-100 text-slate-600'}`}>
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-eco-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer"
          onClick={() => navigate('/dashboard/profile')}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
