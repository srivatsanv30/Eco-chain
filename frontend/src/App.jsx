import { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout';

// Guard components
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import ComparePage from './pages/ComparePage';
import SavedProductsPage from './pages/SavedProductsPage';
import CarbonWalletPage from './pages/CarbonWalletPage';
import RepairCenterPage from './pages/RepairCenterPage';
import RecycleCenterPage from './pages/RecycleCenterPage';
import AiInsightsPage from './pages/AiInsightsPage';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import ProductPage from './pages/ProductPage';

// Theme sync component
const ThemeSync = ({ children }) => {
  const { mode } = useSelector(state => state.theme);

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  return children;
};

function AppContent() {
  return (
    <ThemeSync>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="compare" element={<ComparePage />} />
            <Route path="saved" element={<SavedProductsPage />} />
            <Route path="wallet" element={<CarbonWalletPage />} />
            <Route path="repair" element={<RepairCenterPage />} />
            <Route path="recycle" element={<RecycleCenterPage />} />
            <Route path="ai" element={<AiInsightsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="product/:id" element={<ProductPage />} />
          </Route>

          {/* Admin panel route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <DashboardLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeSync>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
