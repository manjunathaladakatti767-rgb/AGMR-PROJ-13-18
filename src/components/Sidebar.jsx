import React from 'react';
import { Shield, LayoutDashboard, History as HistoryIcon, Activity, ThumbsUp, Settings, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    if (closeSidebar) closeSidebar();
  };

  const isActive = (path) => location.pathname === path ? 'nav-item active' : 'nav-item';

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header" style={{ cursor: 'pointer' }} onClick={() => handleNav('/dashboard')}>
        <Shield size={28} color="#3b82f6" />
        <span>AccessShield</span>
      </div>

      <div className="sidebar-nav">
        <div className={isActive('/dashboard')} onClick={() => handleNav('/dashboard')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>
        <div className={isActive('/history')} onClick={() => handleNav('/history')}>
          <HistoryIcon size={20} />
          <span>History</span>
        </div>
        <div className={isActive('/risk-analysis')} onClick={() => handleNav('/risk-analysis')}>
          <Activity size={20} />
          <span>Risk Analyses</span>
        </div>
        <div className={isActive('/recommendations')} onClick={() => handleNav('/recommendations')}>
          <ThumbsUp size={20} />
          <span>Recommendations</span>
        </div>
        <div className={isActive('/settings')} onClick={() => handleNav('/settings')}>
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="btn btn-danger" onClick={() => navigate('/')}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
