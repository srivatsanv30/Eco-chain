import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Shield, Users, ShoppingBag, FileBarChart, Trash2, Award, UserCheck, Package, Edit2, Plus } from 'lucide-react';
import { getAdminStats, getAllUsers, deleteUser, updateUserRole, getProducts, deleteProduct as deleteProductApi, createProduct, updateProduct } from '../services/api';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import toast from 'react-hot-toast';
import ProductModal from '../components/ui/ProductModal';

ChartJS.register(ArcElement, ChartTooltip, Legend);

const AdminPage = () => {
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';

  const [stats, setStats] = useState({ usersCount: 0, productsCount: 0, reportsCount: 0 });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEditProduct, setCurrentEditProduct] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes, productsRes] = await Promise.all([
          getAdminStats(),
          getAllUsers(),
          getProducts({ limit: 100 })
        ]);
        setStats(statsRes.data.data || { usersCount: 2, productsCount: 12, reportsCount: 6 });
        setUsers(usersRes.data.data || []);
        setProducts(productsRes.data.data || []);
      } catch (err) {
        // Fallback mock data
        setStats({ usersCount: 140, productsCount: 124, reportsCount: 680 });
        setUsers([
          { _id: '1', name: 'Alex Johnson', email: 'demo@ecochain.io', role: 'user', username: 'alex_eco' },
          { _id: '2', name: 'EcoChain Admin', email: 'admin@ecochain.io', role: 'admin', username: 'ecochain_admin' },
          { _id: '3', name: 'Samantha Miller', email: 'samantha@greenlife.com', role: 'user', username: 'sam_green' },
        ]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success(`User role updated to ${newRole}`);
    } catch {
      // Offline fallback
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success(`[Demo] User role toggled to ${newRole}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('User deleted successfully');
    } catch {
      // Offline fallback
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast.success('[Demo] User deleted');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProductApi(productId);
      setProducts(prev => prev.filter(p => p._id !== productId));
      setStats(prev => ({ ...prev, productsCount: prev.productsCount - 1 }));
      toast.success('Product deleted successfully');
    } catch {
      setProducts(prev => prev.filter(p => p._id !== productId));
      setStats(prev => ({ ...prev, productsCount: prev.productsCount - 1 }));
      toast.success('[Demo] Product deleted');
    }
  };

  const handleSaveProduct = async (productData) => {
    try {
      if (currentEditProduct) {
        // Update
        const { data } = await updateProduct(currentEditProduct._id, productData);
        setProducts(prev => prev.map(p => p._id === currentEditProduct._id ? data.data : p));
        toast.success('Product updated successfully');
      } else {
        // Create
        const { data } = await createProduct(productData);
        setProducts(prev => [data.data, ...prev]);
        setStats(prev => ({ ...prev, productsCount: prev.productsCount + 1 }));
        toast.success('Product created successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const categoryCounts = products.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  const doughnutData = {
    labels: Object.keys(categoryCounts),
    datasets: [{
      data: Object.values(categoryCounts),
      backgroundColor: ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#14b8a6', '#f43f5e', '#06b6d4'],
      borderWidth: 0,
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 10 } } }
    },
    cutout: '70%'
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white shadow-eco">
            <Shield className="w-5 h-5" />
          </div>
          Admin Dashboard
        </h1>
        <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Manage platform parameters, oversee user directories, and audit activity statistics.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Total Registered Users', value: stats.usersCount, icon: Users, bg: 'bg-blue-500/10', text: 'text-blue-400' },
          { title: 'Seeded Products Catalog', value: stats.productsCount, icon: ShoppingBag, bg: 'bg-eco-500/10', text: 'text-eco-400' },
          { title: 'Carbon Footprints Generated', value: stats.reportsCount, icon: FileBarChart, bg: 'bg-purple-500/10', text: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className={`p-2 w-fit rounded-lg ${stat.bg} ${stat.text} mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.title}</p>
            <p className={`text-2xl font-black mt-1 ${stat.text}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Analytics Chart */}
      {products.length > 0 && (
        <motion.div variants={itemVariants} className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h3 className={`font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Category Distribution</h3>
          <div className="h-64">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </motion.div>
      )}

      {/* Users Management list */}
      <motion.div variants={itemVariants} className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'} overflow-hidden`}>
        <h3 className={`font-bold mb-4 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Users Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-150 text-slate-400'} font-semibold uppercase`}>
                <th className="py-2.5">User</th>
                <th className="py-2.5">Username</th>
                <th className="py-2.5">Email</th>
                <th className="py-2.5">Access Role</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-350' : 'divide-slate-100 text-slate-700'}`}>
              {users.map(u => (
                <tr key={u._id} className={`hover:${isDark ? 'bg-slate-850/20' : 'bg-slate-50'}`}>
                  <td className="py-3 font-semibold">{u.name}</td>
                  <td className="py-3 text-slate-500">@{u.username}</td>
                  <td className="py-3">{u.email}</td>
                  <td className="py-3">
                    <span className={`badge uppercase text-[9px] font-bold ${
                      u.role === 'admin' ? 'badge-red' : 'badge-eco'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleRoleChange(u._id, u.role)}
                      title="Toggle role admin/user"
                      className={`p-1.5 rounded-lg border transition-all ${
                        isDark 
                          ? 'border-slate-700 hover:border-slate-500 text-slate-400' 
                          : 'border-slate-250 hover:border-slate-455 text-slate-600'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      title="Delete User"
                      disabled={u.email === 'admin@ecochain.io'}
                      className={`p-1.5 rounded-lg border transition-all ${
                        isDark 
                          ? 'border-slate-700 hover:bg-red-500/10 hover:border-red-500/30 text-red-400' 
                          : 'border-slate-250 hover:bg-red-50 text-red-500'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Products Management list */}
      <motion.div variants={itemVariants} className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700/50' : 'bg-white border-slate-200 shadow-sm'} overflow-hidden`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Products Catalog</h3>
          <button
            onClick={() => { setCurrentEditProduct(null); setIsModalOpen(true); }}
            className="px-3 py-1.5 rounded-lg bg-eco-600 hover:bg-eco-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-150 text-slate-400'} font-semibold uppercase`}>
                <th className="py-2.5">Product</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Price</th>
                <th className="py-2.5">Eco Score</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-350' : 'divide-slate-100 text-slate-700'}`}>
              {products.map(p => (
                <tr key={p._id} className={`hover:${isDark ? 'bg-slate-850/20' : 'bg-slate-50'}`}>
                  <td className="py-3 font-semibold flex items-center gap-2">
                    <img src={p.primaryImage || p.image || 'https://via.placeholder.com/40'} alt={p.productName || p.name} className="w-8 h-8 rounded object-cover" />
                    <div>
                      <p className="line-clamp-1">{p.productName || p.name}</p>
                      <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{p.brand}</p>
                    </div>
                  </td>
                  <td className="py-3 text-slate-500">{p.category}</td>
                  <td className="py-3">₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.ecoScore >= 80 ? 'bg-eco-500/10 text-eco-400' : p.ecoScore >= 60 ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                      {p.ecoScore}/100
                    </span>
                  </td>
                  <td className="py-3 text-right flex justify-end gap-2">
                    <button
                      onClick={() => { setCurrentEditProduct(p); setIsModalOpen(true); }}
                      title="Edit Product"
                      className={`p-1.5 rounded-lg border transition-all ${
                        isDark 
                          ? 'border-slate-700 hover:border-slate-500 text-slate-400' 
                          : 'border-slate-250 hover:border-slate-455 text-slate-600'
                      }`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      title="Delete Product"
                      className={`p-1.5 rounded-lg border transition-all ${
                        isDark 
                          ? 'border-slate-700 hover:bg-red-500/10 hover:border-red-500/30 text-red-400' 
                          : 'border-slate-250 hover:bg-red-50 text-red-500'
                      }`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500">
                    No products found. Run the seed script to populate data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        product={currentEditProduct} 
        onSave={handleSaveProduct} 
      />
    </motion.div>
  );
};

export default AdminPage;
