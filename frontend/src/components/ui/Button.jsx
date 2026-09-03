import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-eco-500 text-white hover:bg-eco-600 shadow-eco hover:shadow-eco-lg',
  secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600',
  ghost: 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50',
  danger: 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20',
  outline: 'border border-eco-500/40 text-eco-400 hover:bg-eco-500/10',
  white: 'bg-white text-slate-900 hover:bg-slate-100',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-xl',
  lg: 'px-6 py-3 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  type = 'button',
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
