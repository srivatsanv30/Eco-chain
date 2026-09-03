import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Eye, EyeOff, Leaf, Mail, Lock, User, Phone, AtSign, ArrowRight, Check, Shield, Recycle, TreePine } from 'lucide-react';
import { setCredentials } from '../redux/slices/authSlice';
import { loginUser, registerUser } from '../services/api';
import toast from 'react-hot-toast';

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (p) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };
  const strength = getStrength(password);
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const textColors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-600', 'text-green-600'];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? colors[strength] : 'bg-gray-200'}`} />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[strength]}`}>{labels[strength]} password</p>
    </div>
  );
};

const InputField = ({ label, type, value, onChange, placeholder, icon: Icon, error, showToggle, onToggle, showPassword }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
    <div className="relative">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-600">
        <Icon className="w-4 h-4" />
      </div>
      <input
        type={showToggle ? (showPassword ? 'text' : 'password') : type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-10 pr-${showToggle ? '10' : '4'} py-3 rounded-xl border-2 text-sm outline-none transition-all
          bg-white/80 text-gray-800 placeholder:text-gray-400
          ${error ? 'border-red-400 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100'}`}
      />
      {showToggle && (
        <button type="button" onClick={onToggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )}
    </div>
    {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
  </div>
);

const AuthPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { user } = useSelector(state => state.auth);

  const [isLogin, setIsLogin] = useState(searchParams.get('mode') !== 'signup');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [loginForm, setLoginForm] = useState({ email: '', password: '', remember: false });
  const [signupForm, setSignupForm] = useState({ name: '', username: '', email: '', phone: '', password: '', confirmPassword: '', terms: false });

  useEffect(() => { if (user) navigate('/dashboard'); }, [user, navigate]);

  const validateLogin = () => {
    const e = {};
    if (!loginForm.email || !/\S+@\S+\.\S+/.test(loginForm.email)) e.email = 'Enter a valid email';
    if (!loginForm.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSignup = () => {
    const e = {};
    if (!signupForm.name) e.name = 'Name is required';
    if (!signupForm.username || signupForm.username.length < 3) e.username = 'Username must be at least 3 characters';
    if (!signupForm.email || !/\S+@\S+\.\S+/.test(signupForm.email)) e.email = 'Enter a valid email';
    if (!signupForm.password || signupForm.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (signupForm.password !== signupForm.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!signupForm.terms) e.terms = 'You must accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    try {
      const { data } = await loginUser({ email: loginForm.email, password: loginForm.password });
      dispatch(setCredentials(data.data));
      toast.success(`Welcome back, ${data.data.name}! 🌿`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setLoading(true);
    try {
      const { data } = await registerUser(signupForm);
      dispatch(setCredentials(data.data));
      toast.success(`Welcome to EcoChain, ${data.data.name}! 🌿`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async () => {
    setLoading(true);
    try {
      const { data } = await loginUser({ email: 'demo@ecochain.io', password: 'Demo@123' });
      dispatch(setCredentials(data.data));
      toast.success('Logged in as Demo User 🌿');
      navigate('/dashboard');
    } catch {
      toast.error('Demo login failed. Please run the seed script first.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Shield, title: 'Eco Score Analysis', desc: 'AI-powered sustainability ratings for every product in the Indian market' },
    { icon: Recycle, title: 'E-Waste Management', desc: 'Find nearby repair & recycle centres across India' },
    { icon: TreePine, title: 'Carbon Wallet', desc: 'Track your environmental impact and earn green credits' },
  ];

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Full-screen forest background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/forest_background.png')" }}
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 via-green-800/40 to-transparent" />
      {/* Subtle mesh overlay */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(34,197,94,0.15) 0%, transparent 60%)' }} />

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex flex-col justify-center flex-1 relative z-10 px-16 py-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">EcoChain</span>
          </div>

          <h1 className="text-5xl font-black text-white leading-tight mb-4">
            Shop Smart.<br />
            <span className="text-green-300">Go Green.</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-10">
            India's first AI-powered sustainable electronics platform. Make eco-conscious choices with real-time data.
          </p>

          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="flex items-start gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4"
              >
                <div className="w-10 h-10 rounded-xl bg-green-400/20 border border-green-300/30 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{f.title}</p>
                  <p className="text-white/60 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {['🧑🏽', '👩🏻', '🧑🏾', '👩🏿'].map((emoji, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-green-400/30 border-2 border-white/40 flex items-center justify-center text-sm backdrop-blur-sm">{emoji}</div>
              ))}
            </div>
            <p className="text-white/70 text-sm"><span className="text-green-300 font-bold">50,000+</span> eco-conscious users across India</p>
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Auth Card */}
      <div className="flex-1 lg:flex-none lg:w-[480px] flex items-center justify-center p-6 relative z-10">
        {/* Mobile logo */}
        <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-white text-lg">EcoChain</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm"
        >
          {/* Card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8">
            {/* Toggle Tabs */}
            <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
              {['Login', 'Sign Up'].map((tab, i) => (
                <button key={tab} onClick={() => { setIsLogin(i === 0); setErrors({}); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${isLogin === (i === 0)
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'}`}>
                  {tab}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {isLogin ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleLogin}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-2xl font-black text-gray-800">Welcome back 👋</h2>
                    <p className="text-gray-500 text-sm mt-1">Sign in to your EcoChain account</p>
                  </div>

                  <InputField label="Email Address" type="email" value={loginForm.email}
                    onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="you@example.com" icon={Mail} error={errors.email} />

                  <InputField label="Password" type="password" value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Enter your password" icon={Lock} error={errors.password}
                    showToggle onToggle={() => setShowPassword(!showPassword)} showPassword={showPassword} />

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                      <input type="checkbox" checked={loginForm.remember}
                        onChange={e => setLoginForm({ ...loginForm, remember: e.target.checked })}
                        className="w-3.5 h-3.5 accent-green-600" />
                      Remember me
                    </label>
                    <a href="#" className="text-green-600 hover:text-green-700 font-semibold">Forgot password?</a>
                  </div>

                  <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50">
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
                  </motion.button>

                  <div className="relative flex items-center gap-3 my-1">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-gray-400 text-xs font-medium">or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <button type="button" onClick={demoLogin}
                    className="w-full py-3 rounded-xl border-2 border-green-200 text-green-700 hover:bg-green-50 font-semibold text-sm transition-all flex items-center justify-center gap-2">
                    🌿 Try Demo Account
                  </button>

                  <p className="text-center text-sm text-gray-500">Don't have an account?{' '}
                    <button type="button" onClick={() => { setIsLogin(false); setErrors({}); }} className="text-green-600 hover:text-green-700 font-bold">Sign up free</button>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSignup}
                  className="space-y-3"
                >
                  <div>
                    <h2 className="text-2xl font-black text-gray-800">Create account 🌱</h2>
                    <p className="text-gray-500 text-sm mt-1">Join India's green electronics community</p>
                  </div>

                  <InputField label="Full Name" type="text" value={signupForm.name}
                    onChange={e => setSignupForm({ ...signupForm, name: e.target.value })}
                    placeholder="Arjun Sharma" icon={User} error={errors.name} />

                  <InputField label="Username" type="text" value={signupForm.username}
                    onChange={e => setSignupForm({ ...signupForm, username: e.target.value })}
                    placeholder="arjun_eco" icon={AtSign} error={errors.username} />

                  <InputField label="Email Address" type="email" value={signupForm.email}
                    onChange={e => setSignupForm({ ...signupForm, email: e.target.value })}
                    placeholder="you@example.com" icon={Mail} error={errors.email} />

                  <InputField label="Phone Number" type="tel" value={signupForm.phone}
                    onChange={e => setSignupForm({ ...signupForm, phone: e.target.value })}
                    placeholder="+91 98765 43210" icon={Phone} />

                  <InputField label="Password" type="password" value={signupForm.password}
                    onChange={e => setSignupForm({ ...signupForm, password: e.target.value })}
                    placeholder="Create a strong password" icon={Lock} error={errors.password}
                    showToggle onToggle={() => setShowPassword(!showPassword)} showPassword={showPassword} />

                  <PasswordStrengthMeter password={signupForm.password} />

                  <InputField label="Confirm Password" type="password" value={signupForm.confirmPassword}
                    onChange={e => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                    placeholder="Repeat your password" icon={Lock} error={errors.confirmPassword}
                    showToggle={false} />

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={signupForm.terms}
                      onChange={e => setSignupForm({ ...signupForm, terms: e.target.checked })}
                      className="w-3.5 h-3.5 accent-green-600 mt-0.5" />
                    <span className="text-xs text-gray-500">I agree to EcoChain's{' '}
                      <a href="#" className="text-green-600 hover:underline font-semibold">Terms of Service</a>{' '}and{' '}
                      <a href="#" className="text-green-600 hover:underline font-semibold">Privacy Policy</a>
                    </span>
                  </label>
                  {errors.terms && <p className="text-xs text-red-500 font-medium">{errors.terms}</p>}

                  <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50">
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
                  </motion.button>

                  <p className="text-center text-sm text-gray-500">Already have an account?{' '}
                    <button type="button" onClick={() => { setIsLogin(true); setErrors({}); }} className="text-green-600 hover:text-green-700 font-bold">Sign in</button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Footer note */}
          <p className="text-center text-white/60 text-xs mt-4">
            🔒 Your data is secure & never sold. Made in India 🇮🇳
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
