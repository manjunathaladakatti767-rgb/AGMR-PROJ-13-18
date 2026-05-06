import React, { useEffect, useState, useRef } from 'react';
import KpiWidget from '../components/KpiWidget';
import CircleChart from '../components/CircleChart';
import { Activity, ShieldCheck, AlertOctagon, Globe } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalScans: 0,
    dangerousFound: 0,
    safePercentage: 100,
    activeProtection: 'Online'
  });
  const [recentScans, setRecentScans] = useState([]);
  const [userName, setUserName] = useState('User');
  const [loading, setLoading] = useState(true);
  const terminalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) return;
        
        const userInfo = JSON.parse(userInfoStr);
        setUserName(userInfo.name);

        const isAdminUser = userInfo.role === 'admin' || userInfo.role === 'superuser' || userInfo.role === 'superadmin';
        
        if (isAdminUser) {
          const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
            headers: { 'Authorization': `Bearer ${userInfo.token}` }
          });
          const sData = await statsRes.json();
          if (statsRes.ok) {
            setStats({
              totalScans: sData.totalScans,
              dangerousFound: sData.dangerousScans,
              safePercentage: sData.totalScans > 0 ? Math.round((sData.safeScans / sData.totalScans) * 100) : 100,
              activeProtection: 'Online'
            });
          }

          const historyRes = await fetch('http://localhost:5000/api/admin/history', {
            headers: { 'Authorization': `Bearer ${userInfo.token}` }
          });
          const hData = await historyRes.json();
          if (historyRes.ok) {
            setRecentScans(hData.slice(0, 10));
          }
        } else {
          const response = await fetch('http://localhost:5000/api/history', {
            headers: { 'Authorization': `Bearer ${userInfo.token}` }
          });
          const data = await response.json();
          
          if (response.ok) {
            const total = data.length;
            const dangerous = data.filter(item => item.status === 'DANGEROUS').length;
            const safe = data.filter(item => item.status === 'SAFE').length;
            const safePct = total > 0 ? Math.round((safe / total) * 100) : 100;

            setStats({
              totalScans: total,
              dangerousFound: dangerous,
              safePercentage: safePct,
              activeProtection: 'Online'
            });

            setRecentScans(data.slice(0, 10));
          }
        }
      } catch (error) {
        console.error('Dashboard Data Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  };

  return (
    <>
      <div className="dashboard-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, textAlign: 'left', fontSize: '2rem' }}>Welcome, {userName}</h1>
            <p style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.875rem' }}>Your personal security overview and browsing protection status</p>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'rgba(239, 68, 68, 0.1)', 
              color: '#ef4444', 
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            Logout
          </button>
        </div>
        <div className="live-indicator">
          <div className="pulse"></div>
          {stats.activeProtection === 'Online' ? 'PROTECTION ACTIVE' : 'PROTECTION PAUSED'}
        </div>
      </div>

      <div className="kpi-grid">
        <KpiWidget 
          title="Total URLs Protected" 
          value={stats.totalScans.toLocaleString()} 
          trend="true" 
          trendValue="All-time" 
          isPositive={true} 
        />
        <KpiWidget 
          title="Threats Blocked" 
          value={stats.dangerousFound.toLocaleString()} 
          trend="true" 
          trendValue="Dangerous" 
          isPositive={false} 
        />
        <KpiWidget 
          title="Safe Browsing Rate" 
          value={`${stats.safePercentage}%`} 
          trend="true" 
          trendValue="Score" 
          isPositive={true} 
        />
        <KpiWidget 
          title="Engine Status" 
          value={stats.activeProtection} 
          trend="true" 
          trendValue="Heuristic" 
          isPositive={true} 
        />
      </div>

      <div className="bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <Globe size={20} color="#94a3b8" />
            Security Health Overview
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <CircleChart 
              safe={stats.totalScans - stats.dangerousFound} 
              dangerous={stats.dangerousFound} 
              total={stats.totalScans} 
            />
            
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-around', marginTop: '0.5rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#10b981', fontSize: '1.25rem', fontWeight: 'bold' }}>{stats.totalScans - stats.dangerousFound}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Safe Sites</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#ef4444', fontSize: '1.25rem', fontWeight: 'bold' }}>{stats.dangerousFound}</div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>Threats</div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <Activity size={20} color="#94a3b8" />
            Live Security Feed
          </div>
          <div className="terminal" ref={terminalRef}>
            {loading ? (
              <div className="terminal-line">Initializing secure connection...</div>
            ) : recentScans.length === 0 ? (
              <div className="terminal-line">No recent activity found. Browsing is safe.</div>
            ) : (
              recentScans.map((scan, index) => (
                <div key={index} className="terminal-line">
                  <span style={{ color: '#94a3b8' }}>[{new Date(scan.createdAt).toLocaleTimeString()}]</span>{' '}
                  <span style={{ color: '#60a5fa' }}>SCAN:</span>{' '}
                  <span style={{ 
                    color: scan.status === 'SAFE' ? '#10b981' : scan.status === 'DANGEROUS' ? '#ef4444' : '#f59e0b'
                  }}>
                    {scan.status}
                  </span>{' '}
                  <span style={{ opacity: 0.7 }}>{'->'} {scan.url}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
