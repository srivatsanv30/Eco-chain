import { useSelector } from 'react-redux';

// EcoScore badge with color-coded ring
export const EcoScoreBadge = ({ score, size = 'md' }) => {
  const getColor = (s) => {
    if (s >= 80) return { text: 'text-emerald-400', bg: 'bg-emerald-400/10', ring: 'stroke-emerald-400', label: 'Excellent' };
    if (s >= 60) return { text: 'text-green-400', bg: 'bg-green-400/10', ring: 'stroke-green-400', label: 'Good' };
    if (s >= 40) return { text: 'text-yellow-400', bg: 'bg-yellow-400/10', ring: 'stroke-yellow-400', label: 'Fair' };
    return { text: 'text-red-400', bg: 'bg-red-400/10', ring: 'stroke-red-400', label: 'Poor' };
  };

  const c = getColor(score);
  const r = size === 'lg' ? 36 : 28;
  const cx = size === 'lg' ? 44 : 34;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex flex-col items-center gap-1`}>
      <div className="relative inline-flex">
        <svg width={cx * 2} height={cx * 2} className="-rotate-90">
          <circle cx={cx} cy={cx} r={r} fill="none" strokeWidth="4" className="stroke-slate-700" />
          <circle cx={cx} cy={cx} r={r} fill="none" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={c.ring} style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold ${size === 'lg' ? 'text-xl' : 'text-sm'} ${c.text}`}>{score}</span>
        </div>
      </div>
      <span className={`text-xs font-medium ${c.text}`}>{c.label}</span>
    </div>
  );
};

// Repairability score bar
export const RepairabilityBar = ({ score }) => {
  const pct = (score / 10) * 100;
  const color = score >= 8 ? 'bg-emerald-400' : score >= 6 ? 'bg-green-400' : score >= 4 ? 'bg-yellow-400' : 'bg-red-400';
  const { mode } = useSelector(state => state.theme);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className={`text-xs ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Repairability</span>
        <span className={`text-xs font-bold ${mode === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{score}/10</span>
      </div>
      <div className={`h-2 rounded-full ${mode === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
        <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

// Energy rating badge
export const EnergyRatingBadge = ({ rating }) => {
  const colors = {
    'A++': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'A+': 'bg-green-500/20 text-green-400 border-green-500/30',
    'A': 'bg-lime-500/20 text-lime-400 border-lime-500/30',
    'B': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'C': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'D': 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold border ${colors[rating] || colors['A']}`}>
      ⚡ {rating}
    </span>
  );
};

// Skeleton loader
export const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-xl bg-slate-700/50 ${className}`} />
);

export const ProductCardSkeleton = () => (
  <div className="rounded-2xl overflow-hidden bg-slate-800/50 border border-slate-700/50 p-4">
    <Skeleton className="h-48 w-full mb-4" />
    <Skeleton className="h-4 w-3/4 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-4" />
    <div className="flex gap-2">
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 w-8" />
    </div>
  </div>
);

// Empty state
export const EmptyState = ({ icon: Icon, title, description, action }) => {
  const { mode } = useSelector(state => state.theme);
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {Icon && (
        <div className="p-5 rounded-2xl bg-slate-700/30 mb-5">
          <Icon className="w-10 h-10 text-slate-500" />
        </div>
      )}
      <h3 className={`text-lg font-semibold mb-2 ${mode === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{title}</h3>
      <p className={`text-sm mb-6 max-w-xs ${mode === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>
      {action}
    </div>
  );
};

// Pagination
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-2 justify-center mt-8">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button key={page} onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
            page === currentPage
              ? 'bg-eco-500 text-white shadow-eco'
              : isDark ? 'bg-slate-700/50 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}>
          {page}
        </button>
      ))}
    </div>
  );
};
