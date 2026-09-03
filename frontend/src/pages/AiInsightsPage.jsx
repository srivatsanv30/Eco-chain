import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Leaf, Wrench, Shield, AlertTriangle, Cpu, HelpCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AiInsightsPage = () => {
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';

  const [inputProduct, setInputProduct] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!inputProduct.trim()) {
      toast.error('Please enter a product name');
      return;
    }

    setAnalyzing(true);
    setResult(null);

    // Mock API delay for AI generation
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        name: inputProduct,
        ecoScore: Math.floor(Math.random() * 25) + 65, // 65 to 90
        carbonFootprint: Math.floor(Math.random() * 150) + 20, // 20 to 170
        repairabilityScore: (Math.random() * 4 + 5).toFixed(1), // 5.0 to 9.0
        lifespanYears: Math.floor(Math.random() * 6) + 4, // 4 to 10
        materialsAnalysis: [
          { name: 'Post-Consumer Plastics', percentage: 35, impact: 'Low' },
          { name: 'Aluminum Framework', percentage: 45, impact: 'Medium' },
          { name: 'Copper & Rare Earths', percentage: 12, impact: 'High' },
          { name: 'Glass & Other Resins', percentage: 8, impact: 'Low' },
        ],
        advices: [
          { type: 'maintenance', text: 'Clean filters and fans bi-monthly to maintain thermal efficiency and avoid battery degradation.' },
          { type: 'repair', text: 'Display and battery modular modules are replaceable. Self-repairs are supported with common screwdriver sets.' },
          { type: 'recycling', text: 'Contains specialized lithium-ion cells. Take-back programs exist at electronics retailers; do not dispose in household trash.' },
        ],
        alternatives: [
          { name: 'Xiaomi 14 Ultra', ecoScore: 88, price: '₹99,999' },
          { name: 'OnePlus 12R', ecoScore: 85, price: '₹39,999' },
        ]
      });
      toast.success('AI lifecycle analysis generated!');
    }, 2000);
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
      <motion.div variants={itemVariants}>
        <h1 className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2.5`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-eco-500 to-teal-500 flex items-center justify-center text-white shadow-eco">
            <Brain className="w-5 h-5" />
          </div>
          AI Insights & Analytics
        </h1>
        <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Leverage machine learning to estimate a product's lifespan, repairability, and true ecological footprint before making a purchase.
        </p>
      </motion.div>

      {/* Input Form */}
      <motion.div variants={itemVariants} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <form onSubmit={handleAnalyze} className="space-y-4">
          <label className={`block font-bold text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            Enter Product Model or Category
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputProduct}
              onChange={(e) => setInputProduct(e.target.value)}
              placeholder="e.g. Sony WH-1000XM5, Cordless Vacuum, Laptop..."
              disabled={analyzing}
              className={`flex-1 px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
                isDark 
                  ? 'bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-600 focus:border-eco-500/60 focus:ring-2 focus:ring-eco-500/20' 
                  : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-eco-500 focus:ring-2 focus:ring-eco-500/20'
              }`}
            />
            <button
              type="submit"
              disabled={analyzing}
              className="btn-primary px-6 py-3 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Analyze Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence mode="wait">
        {analyzing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`text-center py-12 rounded-2xl border border-dashed ${isDark ? 'border-slate-800 bg-slate-900/10' : 'border-slate-300 bg-slate-50/50'}`}
          >
            <Cpu className="w-12 h-12 text-eco-400 animate-spin mx-auto mb-4" />
            <h3 className={`text-base font-bold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Crunching Lifecycle Data</h3>
            <p className={`text-xs max-w-xs mx-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              Evaluating carbon footprints, mining materials lists, warranty indices, and calculating the custom Eco Score...
            </p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            {/* Left: Summary Metrics */}
            <div className="space-y-4">
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>predicted eco score</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-eco-400">{result.ecoScore}</span>
                  <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/ 100</span>
                </div>
                <p className={`text-xs mt-3 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  This score covers material recyclability, power efficiency, and manufacture-to-disposal carbon output.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>carbon footprint</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-amber-400">{result.carbonFootprint}</span>
                  <span className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>kg CO₂</span>
                </div>
                <p className={`text-xs mt-3 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Equivalent to driving approximately {Math.round(result.carbonFootprint * 2.5)} miles in a gasoline-powered car.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>repair score</h4>
                    <p className={`text-2xl font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{result.repairabilityScore}/10</p>
                  </div>
                  <div>
                    <h4 className={`text-xs uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>lifespan</h4>
                    <p className={`text-2xl font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{result.lifespanYears} years</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Materials & Advice */}
            <div className="lg:col-span-2 space-y-6">
              {/* Materials Breakdown */}
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Estimated Materials Impact</h3>
                <div className="space-y-3">
                  {result.materialsAnalysis.map((material, index) => (
                    <div key={index} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{material.name}</span>
                        <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>{material.percentage}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex-1 h-2 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'} overflow-hidden`}>
                          <div
                            className="h-full bg-gradient-to-r from-eco-500 to-teal-400 rounded-full"
                            style={{ width: `${material.percentage}%` }}
                          />
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                          material.impact === 'High' ? 'bg-red-500/10 text-red-400' :
                          material.impact === 'Medium' ? 'bg-amber-500/10 text-amber-400' : 'bg-eco-500/10 text-eco-400'
                        }`}>
                          {material.impact} Impact
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance & Repair Advices */}
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>AI Actions & Advisories</h3>
                <div className="space-y-4">
                  {result.advices.map((advice, index) => (
                    <div key={index} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${
                        advice.type === 'maintenance' ? 'bg-eco-500/15 text-eco-400' :
                        advice.type === 'repair' ? 'bg-blue-500/15 text-blue-400' : 'bg-amber-500/15 text-amber-400'
                      }`}>
                        {advice.type === 'maintenance' ? <Leaf className="w-4 h-4" /> :
                         advice.type === 'repair' ? <Wrench className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{advice.type}</h4>
                        <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{advice.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternatives Suggestions */}
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-bold mb-3 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Recommended Eco-Friendly Alternatives</h3>
                <p className={`text-xs mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>These choices offer higher repair parameters and lower carbon lifecycle footprints.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {result.alternatives.map((alt, index) => (
                    <div key={index} className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <div>
                        <h4 className={`text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{alt.name}</h4>
                        <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Est. Price: {alt.price}</p>
                      </div>
                      <div className="text-right">
                        <span className="badge-eco font-bold">Score {alt.ecoScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AiInsightsPage;
