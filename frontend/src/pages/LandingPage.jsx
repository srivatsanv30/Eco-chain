import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSelector } from 'react-redux';
import { Leaf, ArrowRight, Star, Zap, Shield, Globe, TrendingUp, ChevronDown, Menu, X, Sun, Moon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/slices/themeSlice';

const STATS = [
  { value: '2.4M+', label: 'Products Analyzed' },
  { value: '840K', label: 'Kg CO₂ Saved' },
  { value: '190K', label: 'Users Worldwide' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const FEATURES = [
  { icon: Leaf, title: 'Eco Score Intelligence', desc: 'Every product gets an AI-calculated sustainability score covering materials, carbon footprint, and end-of-life impact.', color: 'text-eco-400 bg-eco-400/10' },
  { icon: Zap, title: 'Lifespan Prediction', desc: 'Our AI predicts how long a product will last based on usage patterns, materials, and manufacturer history.', color: 'text-amber-400 bg-amber-400/10' },
  { icon: Shield, title: 'Repair vs Replace', desc: 'Get instant AI recommendations on whether to repair or replace, with cost estimates and carbon impact analysis.', color: 'text-blue-400 bg-blue-400/10' },
  { icon: Globe, title: 'Carbon Wallet', desc: 'Track your personal carbon footprint, earn eco-achievements, and get personalized reduction recommendations.', color: 'text-purple-400 bg-purple-400/10' },
  { icon: TrendingUp, title: 'Cost Prediction', desc: 'See the true total ownership cost of any product over its lifetime, including maintenance and energy costs.', color: 'text-rose-400 bg-rose-400/10' },
  { icon: Star, title: 'Green Alternatives', desc: 'When a product scores poorly, we instantly suggest better alternatives with higher eco scores and lower footprints.', color: 'text-teal-400 bg-teal-400/10' },
];

const COMPANIES = ['Apple', 'Samsung', 'Framework', 'Google', 'Bosch', 'Patagonia', 'Fairphone', 'Sony', 'LG', 'Dell'];

const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'Sustainability Director, TechCorp', text: 'EcoChain transformed how we evaluate procurement decisions. We reduced our tech carbon footprint by 34% in one year.', rating: 5 },
  { name: 'Marcus Williams', role: 'Environmental Engineer', text: 'The AI recommendations are remarkably accurate. It predicted our washing machine would fail 3 months before it did.', rating: 5 },
  { name: 'Anika Patel', role: 'Consumer & Climate Activist', text: 'Finally a tool that makes sustainable shopping accessible. The Carbon Wallet feature is genuinely motivating.', rating: 5 },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode } = useSelector(state => state.theme);
  const { user } = useSelector(state => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const isDark = mode === 'dark';

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
      {/* Navbar */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-xl ${isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-eco-400 to-teal-500 flex items-center justify-center shadow-eco">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">EcoChain</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            {['Features', 'How it Works', 'Pricing', 'About'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(' ', '-')}`}
                className={`font-medium transition-colors ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`}>{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => dispatch(toggleTheme())} className={`p-2 rounded-xl ${isDark ? 'text-amber-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link to="/auth" className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}>Login</Link>
            <Link to="/auth?mode=signup" className="btn-primary text-sm px-4 py-2 rounded-xl font-medium hidden sm:inline-flex items-center gap-1.5">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className={`sm:hidden px-4 pb-4 flex flex-col gap-2 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
            <Link to="/auth" className="btn-secondary text-center">Login</Link>
            <Link to="/auth?mode=signup" className="btn-primary text-center">Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className={`relative overflow-hidden pt-24 pb-20 px-4 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-eco-50/30'}`}>
        {/* Background orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-eco-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-sm font-medium"
            style={{ borderColor: 'rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.05)', color: '#4ade80' }}>
            <Leaf className="w-3.5 h-3.5" />
            AI-Powered Lifecycle Intelligence
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-[1.08] tracking-tight">
            <span className={isDark ? 'text-white' : 'text-slate-900'}>Buy Smarter.</span>
            <br />
            <span className="gradient-text-hero">Waste Less.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            EcoChain analyzes every product's true environmental cost — from raw materials to recycling.
            Make purchases you'll never regret.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/auth?mode=signup"
              className="btn-primary px-8 py-4 text-base rounded-2xl font-semibold flex items-center gap-2 shadow-eco-lg">
              Start for Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/auth"
              className={`px-8 py-4 text-base rounded-2xl font-semibold flex items-center gap-2 border transition-all ${isDark ? 'border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:border-slate-400'}`}>
              Sign in to Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className={`py-16 px-4 border-y ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-3xl md:text-4xl font-black gradient-text mb-1">{stat.value}</div>
              <div className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trusted Companies */}
      <section className={`py-12 px-4 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <p className={`text-center text-sm font-medium uppercase tracking-wider mb-8 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Products tracked from the world's leading brands</p>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {COMPANIES.map(company => (
            <span key={company} className={`px-5 py-2.5 rounded-xl border text-sm font-medium transition-all ${isDark ? 'border-slate-800 text-slate-500 hover:border-eco-500/30 hover:text-slate-300' : 'border-slate-200 text-slate-500 hover:border-eco-400 hover:text-slate-700'}`}>
              {company}
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className={`py-24 px-4 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Everything you need to shop <span className="gradient-text">sustainably</span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Our AI analyzes thousands of data points to give you complete transparency on every product.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className={`p-6 rounded-2xl border transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-eco-500/30' : 'bg-white border-slate-200 hover:border-eco-400'}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-24 px-4 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Loved by <span className="gradient-text">conscious consumers</span></h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-current" />)}
                </div>
                <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>"{t.text}"</p>
                <div>
                  <p className={`font-semibold text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{t.name}</p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className={`p-12 rounded-3xl border ${isDark ? 'bg-gradient-to-br from-eco-500/10 to-teal-500/10 border-eco-500/20' : 'bg-gradient-to-br from-eco-50 to-teal-50 border-eco-200'}`}>
            <h2 className={`text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Start your <span className="gradient-text">eco journey</span> today</h2>
            <p className={`text-lg mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Join 190,000+ users making smarter purchasing decisions.</p>
            <Link to="/auth?mode=signup" className="btn-primary px-8 py-4 text-base rounded-2xl font-semibold inline-flex items-center gap-2">
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 border-t ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-eco-400 to-teal-500 flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold gradient-text">EcoChain</span>
          </div>
          <p className={`text-sm ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>© 2024 EcoChain. AI-Powered Product Lifecycle Intelligence.</p>
          <div className="flex gap-4 text-sm">
            {['Privacy', 'Terms', 'Contact'].map(item => (
              <a key={item} href="#" className={`${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'} transition-colors`}>{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
