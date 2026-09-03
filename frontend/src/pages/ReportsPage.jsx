import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FileBarChart, Download, FileText, Share2, Calendar, Award } from 'lucide-react';
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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = user?.token;
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const { data } = await axios.get('http://localhost:5000/api/ai/carbon-wallet', config);
        setReports(data.data?.reports || []);
      } catch (error) {
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
    
    // Simulate generation of download link
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + ["Month,Carbon Footprint (kg CO2),Waste Generated (kg),Money Saved ($)"].concat(
          reports.map(r => `${r.month},${r.carbonFootprint},${r.wasteGeneratedKg},${r.moneySaved}`)
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
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2.5`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-eco-500 to-teal-500 flex items-center justify-center text-white shadow-eco">
              <FileBarChart className="w-5 h-5" />
            </div>
            Carbon & Sustainability Reports
          </h1>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Track, export, and share detailed environmental footprint histories and audit reports.
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

      {/* Main Charts card */}
      <motion.div variants={itemVariants} className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Carbon vs. Waste Metrics</h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Monthly comparisons of emissions and physical waste reductions</p>
          </div>
          <span className="badge-eco flex items-center gap-1"><Calendar className="w-3 h-3" /> H1 2026</span>
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
                      <span className="badge-eco">Excellent</span>
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
          <button className="btn-secondary w-full mt-6 flex items-center justify-center gap-1.5">
            <Share2 className="w-4 h-4" />
            <span>Share My Eco Badge</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReportsPage;
