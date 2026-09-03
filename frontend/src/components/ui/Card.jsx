import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const Card = ({ children, className = '', hover = false, glass = false, onClick }) => {
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';

  const base = isDark
    ? 'bg-slate-800/50 border border-slate-700/50 text-slate-100'
    : 'bg-white border border-slate-200 text-slate-900';

  const glassStyle = glass
    ? isDark
      ? 'backdrop-blur-xl bg-white/5 border-white/10'
      : 'backdrop-blur-xl bg-white/70 border-white/50'
    : base;

  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4, boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.1)' } : {}}
      transition={{ duration: 0.2 }}
      className={`rounded-2xl shadow-sm transition-all duration-200 ${glassStyle} ${hover ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </motion.div>
  );
};

// Stat Card
export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'eco', className = '' }) => {
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';

  const colors = {
    eco: { bg: 'bg-eco-500/10', text: 'text-eco-400', icon: 'text-eco-400' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', icon: 'text-blue-400' },
    orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', icon: 'text-orange-400' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', icon: 'text-purple-400' },
    red: { bg: 'bg-red-500/10', text: 'text-red-400', icon: 'text-red-400' },
  };

  const c = colors[color] || colors.eco;

  return (
    <Card hover className={`p-5 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${c.bg}`}>
          {Icon && <Icon className={`w-5 h-5 ${c.icon}`} />}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${trend >= 0 ? 'bg-eco-500/10 text-eco-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{title}</p>
      <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
      {subtitle && <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{subtitle}</p>}
    </Card>
  );
};

export default Card;
