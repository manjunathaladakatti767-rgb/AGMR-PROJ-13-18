import React, { useEffect, useState } from 'react';
import { Shield, LayoutDashboard, History as HistoryIcon, Activity, ThumbsUp, Settings, LogOut, Lock, ListFilter, Crown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.role === 'admin' || user.role === 'superadmin') setIsAdmin(true);
      if (user.role === 'superuser' || user.role === 'superadmin') setIsSuperUser(true);
      if (user.role === 'superadmin') setIsSuperAdmin(true);
    }
  }, []);

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
        {/* --- USER SECTION --- */}
        <div style={{ padding: '0.5rem 1.5rem', fontSize: '0.65rem', fontWeight: 'bold', color: '#64748b', letterSpacing: '0.05em' }}>USER CONSOLE</div>
        
        <div className={isActive('/dashboard')} onClick={() => handleNav('/dashboard')}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>
        <div className={isActive('/history')} onClick={() => handleNav('/history')}>
          <HistoryIcon size={20} />
          <span>My History</span>
        </div>
        <div className={isActive('/risk-analysis')} onClick={() => handleNav('/risk-analysis')}>
          <Activity size={20} />
          <span>Risk Analyses</span>
        </div>
        <div className={isActive('/recommendations')} onClick={() => handleNav('/recommendations')}>
          <ThumbsUp size={20} />
          <span>Safety Tips</span>
        </div>

        {/* --- ADMIN SECTION --- */}
        {isAdmin && (
          <>
            <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.65rem', fontWeight: 'bold', color: '#818cf8', letterSpacing: '0.05em' }}>ADMINISTRATION</div>
            <div className={isActive('/admin')} onClick={() => handleNav('/admin')}>
              <Lock size={20} />
              <span>Command Center</span>
            </div>
            <div className={isActive('/admin-history')} onClick={() => handleNav('/admin-history')}>
              <ListFilter size={20} />
              <span>Global Audit Log</span>
            </div>
          </>
        )}

        {/* --- PREMIUM SECTION --- */}
        {isSuperUser && (
          <>
            <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.65rem', fontWeight: 'bold', color: '#a855f7', letterSpacing: '0.05em' }}>PREMIUM</div>
            <div className={isActive('/superuser')} onClick={() => handleNav('/superuser')}>
              <Crown size={20} color="#a855f7" />
              <span style={{ color: '#a855f7', fontWeight: 'bold' }}>Premium Insights</span>
            </div>
          </>
        )}

        {/* --- SUPER ADMIN SECTION --- */}
        {isSuperAdmin && (
          <>
            <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.65rem', fontWeight: 'bold', color: '#fbbf24', letterSpacing: '0.05em' }}>GOD MODE</div>
            <div className={isActive('/superadmin')} onClick={() => handleNav('/superadmin')}>
              <Crown size={20} color="#fbbf24" />
              <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>Master Control</span>
            </div>
          </>
        )}

        {/* --- SYSTEM SECTION --- */}
        <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.65rem', fontWeight: 'bold', color: '#64748b', letterSpacing: '0.05em' }}>SYSTEM</div>
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
