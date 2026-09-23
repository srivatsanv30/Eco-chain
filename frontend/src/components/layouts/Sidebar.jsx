import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Search, GitCompare, Heart, Wallet, Wrench, Recycle,
  Brain, FileBarChart, Settings, Bell, User, LogOut, Leaf, X, ChevronRight, Shield
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Search, label: 'Search Products', path: '/dashboard/search' },
  { icon: GitCompare, label: 'Compare', path: '/dashboard/compare' },
  { icon: Heart, label: 'Saved Products', path: '/dashboard/saved' },
  { icon: Wallet, label: 'Carbon Wallet', path: '/dashboard/wallet' },
  { icon: Wrench, label: 'Repair Center', path: '/dashboard/repair' },
  { icon: Recycle, label: 'Recycle Center', path: '/dashboard/recycle' },
  { icon: Brain, label: 'AI Insights', path: '/dashboard/ai' },
  { icon: FileBarChart, label: 'Reports', path: '/dashboard/reports' },
];

const BOTTOM_ITEMS = [
  { icon: Bell, label: 'Notifications', path: '/dashboard/notifications' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  { icon: User, label: 'Profile', path: '/dashboard/profile' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { mode } = useSelector(state => state.theme);
  const { compareList } = useSelector(state => state.products);
  const isDark = mode === 'dark';

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/auth');
  };

  const sidebarContent = (
    <div className={`flex flex-col h-full ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-r`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div>
            <span className="text-2xl font-black gradient-text tracking-tight">EcoChain</span>
            <div className={`text-sm mt-0.5 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>AI Lifecycle Platform</div>
          </div>
        </div>
        <button onClick={onClose} className={`lg:hidden p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* User Profile Mini */}
      <div className={`mx-3 mb-3 p-3 rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-eco-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{user?.name || 'User'}</p>
            <p className={`text-xs truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{user?.email}</p>
          </div>
          {user?.role === 'admin' && (
            <span className="badge-eco text-xs"><Shield className="w-3 h-3" /></span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        <p className={`text-xs font-semibold uppercase tracking-wider px-3 py-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Main</p>
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
          <NavLink key={path} to={path} end={path === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}>
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{label}</span>
            {path === '/dashboard/compare' && compareList.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-eco-500 text-white text-xs flex items-center justify-center font-bold">
                {compareList.length}
              </span>
            )}
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <p className={`text-xs font-semibold uppercase tracking-wider px-3 pt-4 pb-2 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Admin</p>
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}>
              <Shield className="w-4 h-4 shrink-0" />
              <span>Admin Panel</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Bottom actions */}
      <div className={`px-3 pt-2 pb-4 border-t space-y-0.5 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
        {BOTTOM_ITEMS.map(({ icon: Icon, label, path }) => (
          <NavLink key={path} to={path} onClick={onClose}
            className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`}>
            <Icon className="w-4 h-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
        <button onClick={handleLogout}
          className="nav-link nav-link-inactive text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full">
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block w-64 flex-shrink-0 h-screen sticky top-0 overflow-hidden">
        {sidebarContent}
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 lg:hidden overflow-hidden">
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
