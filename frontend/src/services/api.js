import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const user = localStorage.getItem('ecochain_user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ecochain_user');
    }
    return Promise.reject(error);
  }
);

// Auth
export const loginUser = (data) => api.post('/auth/login', data);
export const registerUser = (data) => api.post('/auth/register', data);
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (data) => api.put('/auth/profile', data);

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProductById = (id) => api.get(`/products/${id}`);
export const compareProducts = (ids) => api.get('/products/compare', { params: { ids: ids.join(',') } });
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// AI
export const getAIInsights = (id) => api.get(`/ai/insights/${id}`);
export const analyzeProductCustom = (productName) => api.post('/ai/analyze', { productName });
export const getCarbonWallet = () => api.get('/ai/carbon-wallet');
export const getRepairCenters = () => api.get('/ai/repair-centers');
export const getRecycleCenters = () => api.get('/ai/recycle-centers');

// Reviews
export const getProductReviews = (productId, params) => api.get(`/reviews/product/${productId}`, { params });
export const createReview = (productId, data) => api.post(`/reviews/product/${productId}`, data);
export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
export const toggleHelpfulVote = (id) => api.put(`/reviews/${id}/helpful`);

// Community Forum
export const getForumThreads = (params) => api.get('/forum', { params });
export const createForumThread = (data) => api.post('/forum', data);
export const addForumComment = (threadId, data) => api.post(`/forum/${threadId}/comments`, data);
export const toggleForumLike = (threadId) => api.put(`/forum/${threadId}/like`);

// Notifications
export const getNotifications = () => api.get('/notifications');
export const markAllNotificationsRead = () => api.put('/notifications/read-all');
export const toggleNotificationRead = (id) => api.put(`/notifications/${id}/read`);
export const deleteNotificationApi = (id) => api.delete(`/notifications/${id}`);

// Admin
export const getAdminStats = () => api.get('/admin/stats');
export const getAllUsers = () => api.get('/admin/users');
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const updateUserRole = (id, role) => api.put(`/admin/users/${id}/role`, { role });
export const syncExternalCatalog = () => api.post('/admin/sync-amazon');

export default api;

