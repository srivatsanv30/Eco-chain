import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="p-4 md:p-6 max-w-screen-2xl mx-auto"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
