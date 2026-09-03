import User from '../models/User.js';
import Product from '../models/Product.js';
import CarbonReport from '../models/CarbonReport.js';

export const getAdminStats = async (req, res) => {
  try {
    const [totalUsers, totalProducts, totalReports] = await Promise.all([
      User.countDocuments({}),
      Product.countDocuments({}),
      CarbonReport.countDocuments({})
    ]);
    const recentUsers = await User.find({}).select('-password').sort({ createdAt: -1 }).limit(5);
    res.json({ success: true, data: { totalUsers, totalProducts, totalReports, recentUsers } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const syncExternalProducts = async (req, res) => {
  try {
    // Dynamic import to avoid circular dependencies or path issues during boot
    const { syncProducts } = await import('../jobs/productFetcherJob.js');
    const result = await syncProducts();
    if (result.success) {
      res.json({ success: true, message: `Successfully synced ${result.count} products from external stores.` });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
