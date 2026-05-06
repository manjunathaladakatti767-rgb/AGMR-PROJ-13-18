import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SharedLayout from './components/SharedLayout';
import DashboardLayout from './components/DashboardLayout';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import RiskAnalysis from './pages/RiskAnalysis';
import Recommendations from './pages/Recommendations';
import Admin from './pages/Admin';
import AdminHistory from './pages/AdminHistory';
import AdminRoute from './components/AdminRoute';
import SuperUser from './pages/SuperUser';
import SuperUserRoute from './components/SuperUserRoute';
import SuperAdmin from './pages/SuperAdmin';
import SuperAdminRoute from './components/SuperAdminRoute';
import { Toaster } from 'react-hot-toast';
import Settings from './pages/Settings';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<AuthPage />} />
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            {/* Super Admin Only Routes */}
            <Route element={<SuperAdminRoute />}>
              <Route path="superadmin" element={<SuperAdmin />} />
            </Route>

            {/* Super User (Premium) Routes */}
            <Route element={<SuperUserRoute />}>
              <Route path="superuser" element={<SuperUser />} />
            </Route>

            {/* Admin Only Routes */}
            <Route element={<AdminRoute />}>
              <Route path="admin" element={<Admin />} />
              <Route path="admin-history" element={<AdminHistory />} />
            </Route>
            <Route path="history" element={<History />} />
            <Route path="risk-analysis" element={<RiskAnalysis />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
