import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FileBarChart, Download, FileText, Share2, Calendar, Award, Loader2, TrendingDown, TrendingUp, DollarSign } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import toast from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReportsPage = () => {
  const { mode } = useSelector(state => state.theme);
  const { user } = useSelector(state => state.auth);
  const isDark = mode === 'dark';
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = user?.token;
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const { data } = await axios.get(`${baseUrl}/api/ai/carbon-wallet`, config);
        setReports(data.data?.reports || []);
        setIsOffline(false);
      } catch (error) {
        setIsOffline(true);
        toast.error("Failed to fetch live data. Showing offline mock data.");
        // Fallback to mock data if API is unavailable
        setReports([
          { month: 'Jan', carbonFootprint: 145, wasteGeneratedKg: 15, moneySaved: 50 },
          { month: 'Feb', carbonFootprint: 132, wasteGeneratedKg: 13, moneySaved: 65 },
          { month: 'Mar', carbonFootprint: 118, wasteGeneratedKg: 12, moneySaved: 80 },
          { month: 'Apr', carbonFootprint: 110, wasteGeneratedKg: 11, moneySaved: 95 },
          { month: 'May', carbonFootprint: 108, wasteGeneratedKg: 10, moneySaved: 110 },
          { month: 'Jun', carbonFootprint: 95, wasteGeneratedKg: 9, moneySaved: 130 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user]);

  const barChartData = {
    labels: reports.map(r => r.month),
    datasets: [
      {
        label: 'Carbon Footprint (kg CO₂)',
        data: reports.map(r => r.carbonFootprint),
        backgroundColor: '#10b981',
        borderRadius: 8,
      },
      {
        label: 'Waste Diverted (kg)',
        data: reports.map(r => r.wasteGeneratedKg),
        backgroundColor: '#34d399',
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { size: 11, weight: '500' }
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#94a3b8',
        bodyColor: '#e2e8f0',
        borderColor: '#334155',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: { color: isDark ? 'rgba(51,65,85,0.3)' : 'rgba(226,232,240,0.8)' },
        ticks: { color: isDark ? '#64748b' : '#94a3b8', font: { size: 11 } }
      },
      y: {
        grid: { color: isDark ? 'rgba(51,65,85,0.3)' : 'rgba(226,232,240,0.8)' },
        ticks: { color: isDark ? '#64748b' : '#94a3b8', font: { size: 11 } }
      },
    },
  };

  const handleExport = (format) => {
    toast.success(`Exporting report as ${format.toUpperCase()}...`);
    
    if (format === 'pdf') {
      setTimeout(() => window.print(), 1000);
      return;
    }

    // Simulate generation of download link
    setTimeout(() => {
      if (reports.length === 0) return;
      const headers = Object.keys(reports[0]).join(",");
      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers].concat(
          reports.map(r => Object.values(r).join(","))
        ).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `EcoChain_Report_${new Date().getFullYear()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EcoChain Impact',
          text: 'I am in the top 8% of eco-conscious users this month on EcoChain!',
          url: window.location.href,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      navigator.clipboard.writeText('I am in the top 8% of eco-conscious users this month on EcoChain!');
      toast.success("Badge text copied to clipboard!");
    }
  };

  const getPerformance = (carbon) => {
    if (carbon < 100) return { text: 'Excellent', color: 'text-green-500' };
    if (carbon < 125) return { text: 'Good', color: 'text-blue-500' };
    return { text: 'Fair', color: 'text-yellow-500' };
  };

  const currentYear = new Date().getFullYear();
  const currentHalf = new Date().getMonth() < 6 ? 'H1' : 'H2';

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className={`w-10 h-10 animate-spin ${isDark ? 'text-green-400' : 'text-green-600'}`} />
      </div>
    );
  }

  // Calculate Summaries
  const totalCarbon = reports.reduce((acc, curr) => acc + (curr.carbonFootprint || 0), 0);
  const totalWaste = reports.reduce((acc, curr) => acc + (curr.wasteGeneratedKg || 0), 0);
  const totalSaved = reports.reduce((acc, curr) => acc + (curr.moneySaved || 0), 0);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2.5`}>
            Carbon & Sustainability Reports
          </h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Track, export, and share detailed environmental footprint histories and audit reports.
            {isOffline && <span className="ml-2 text-red-500 font-semibold">(Offline Mode)</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('csv')} className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3 rounded-lg">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button onClick={() => handleExport('pdf')} className="btn-primary flex items-center gap-1.5 text-xs py-2 px-3 rounded-lg">
            <FileText className="w-3.5 h-3.5" /> Get PDF
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'} flex items-center gap-4`}>
          <div className="p-3 bg-red-500/10 text-red-500 rounded-lg"><TrendingDown className="w-6 h-6" /></div>
          <div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Carbon Footprint</p>
            <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalCarbon} kg CO₂</p>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'} flex items-center gap-4`}>
          <div className="p-3 bg-green-500/10 text-green-500 rounded-lg"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Waste Diverted</p>
            <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalWaste} kg</p>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'} flex items-center gap-4`}>
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg"><DollarSign className="w-6 h-6" /></div>
          <div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Savings</p>
            <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>₹{totalSaved}</p>
          </div>
        </div>
      </motion.div>

      {/* Main Charts card */}
      <motion.div variants={itemVariants} className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Carbon vs. Waste Metrics</h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Monthly comparisons of emissions and physical waste reductions</p>
          </div>
          <span className="badge-eco flex items-center gap-1"><Calendar className="w-3 h-3" /> {currentHalf} {currentYear}</span>
        </div>
        <div className="h-72">
          <Bar data={barChartData} options={chartOptions} />
        </div>
      </motion.div>

      {/* Table & Eco summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Table Details */}
        <motion.div variants={itemVariants} className={`lg:col-span-2 p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'} overflow-hidden`}>
          <h3 className={`font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Detailed Monthly Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-150 text-slate-400'} font-semibold uppercase`}>
                  <th className="py-2.5">Month</th>
                  <th className="py-2.5">CO₂ Footprint</th>
                  <th className="py-2.5">Diverted Waste</th>
                  <th className="py-2.5">Estimated Savings</th>
                  <th className="py-2.5">Performance</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                {reports.map((row, i) => (
                  <tr key={i} className={`hover:${isDark ? 'bg-slate-800/20' : 'bg-slate-50'}`}>
                    <td className="py-3 font-semibold">{row.month}</td>
                    <td className="py-3">{row.carbonFootprint} kg</td>
                    <td className="py-3">{row.wasteGeneratedKg} kg</td>
                    <td className="py-3 text-eco-400 font-bold">₹{row.moneySaved}</td>
                    <td className="py-3">
                      <span className={`badge-eco ${getPerformance(row.carbonFootprint).color}`}>
                        {getPerformance(row.carbonFootprint).text}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Action card */}
        <motion.div variants={itemVariants} className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200'} flex flex-col justify-between`}>
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className={`font-bold mb-1.5 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Environmental Impact Badge</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              You are in the <strong>top 8%</strong> of eco-conscious users this month. Share your success badge to social media or embed it in your profile!
            </p>
          </div>
          <button onClick={handleShare} className="btn-secondary w-full mt-6 flex items-center justify-center gap-1.5">
            <Share2 className="w-4 h-4" />
            <span>Share My Eco Badge</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReportsPage;
