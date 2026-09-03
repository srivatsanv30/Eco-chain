import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShieldAlert, Award, Inbox, Check, Trash2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'alert', title: 'Carbon Footprint Spike', message: 'Your estimated household electronic consumption went up 12% last week.', time: '2 hours ago', read: false },
  { id: 2, type: 'achievement', title: '🌱 "First Eco Buy" Unlocked!', message: 'Congratulations! You purchased your first product with an Eco Score above 80.', time: '1 day ago', read: false },
  { id: 3, type: 'alert', title: 'Battery Degradation Advisory', message: 'The LG C3 OLED display in your list is flagged for higher standby power drainage. Consider enabling ECO-mode.', time: '2 days ago', read: true },
  { id: 4, type: 'system', title: 'System Upgraded', message: 'EcoChain AI engine has been updated to model version 2.4. Expect improved lifespan prediction accuracies.', time: '5 days ago', read: true },
];

const NotificationsPage = () => {
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification removed');
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2.5`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-eco-500 to-teal-500 flex items-center justify-center text-white shadow-eco">
              <Bell className="w-5 h-5" />
            </div>
            Notifications
          </h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Stay updated with alerts, carbon budget limits, and environmental achievements.
          </p>
        </div>
        {notifications.some(n => !n.read) && (
          <button onClick={markAllRead} className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3">
            <Check className="w-3.5 h-3.5" /> Mark all read
          </button>
        )}
      </motion.div>

      {/* Notifications list */}
      <motion.div variants={itemVariants} className="max-w-4xl space-y-3">
        <AnimatePresence mode="popLayout">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className={`p-4 rounded-xl border transition-all duration-200 flex gap-4 items-start ${
                  notif.read 
                    ? (isDark ? 'bg-slate-900/20 border-slate-800/80 text-slate-400' : 'bg-slate-50/50 border-slate-200 text-slate-600') 
                    : (isDark ? 'bg-slate-800/40 border-slate-700/80 text-slate-100' : 'bg-white border-slate-300 shadow-sm text-slate-850')
                }`}
              >
                {/* Icon mapping */}
                <div className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center ${
                  notif.type === 'alert' ? 'bg-red-500/10 text-red-400' :
                  notif.type === 'achievement' ? 'bg-eco-500/10 text-eco-400' : 'bg-blue-500/10 text-blue-400'
                }`}>
                  {notif.type === 'alert' ? <ShieldAlert className="w-4.5 h-4.5" /> :
                   notif.type === 'achievement' ? <Award className="w-4.5 h-4.5" /> : <Bell className="w-4.5 h-4.5" />}
                </div>

                {/* Message details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold truncate">{notif.title}</h3>
                    <span className="text-[10px] whitespace-nowrap opacity-60">{notif.time}</span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed">{notif.message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleRead(notif.id)} 
                    title={notif.read ? "Mark as unread" : "Mark as read"} 
                    className={`p-1.5 rounded-lg hover:bg-slate-700/20 transition-all ${notif.read ? 'text-slate-500' : 'text-eco-400'}`}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => deleteNotification(notif.id)} 
                    title="Delete notification" 
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={`text-center py-16 rounded-xl border border-dashed ${isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-300 bg-slate-50/50'}`}>
              <Inbox className="w-12 h-12 text-slate-500 opacity-40 mx-auto mb-3" />
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>You have no notifications or alerts at this time.</p>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default NotificationsPage;
