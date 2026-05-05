import React, { useEffect, useState } from 'react';
import KpiWidget from '../components/KpiWidget';
import CircleChart from '../components/CircleChart';
import { Users, Globe, ShieldAlert, CheckCircle, List } from 'lucide-react';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userInfoStr = localStorage.getItem('userInfo');
        if (!userInfoStr) return;
        const userInfo = JSON.parse(userInfoStr);

        // Fetch Stats
        const statsRes = await fetch('http://localhost:5000/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${userInfo.token}` }
        });
        const statsData = await statsRes.json();

        // Fetch Users
        const usersRes = await fetch('http://localhost:5000/api/admin/users', {
          headers: { 'Authorization': `Bearer ${userInfo.token}` }
        });
        const usersData = await usersRes.json();

        if (statsRes.ok && usersRes.ok) {
          setStats(statsData);
          setUsers(usersData);
        } else {
          setError(statsData.message || 'Access Denied: Admins Only');
        }
      } catch (err) {
        setError('Failed to fetch admin data. Check server connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', padding: '5rem' }}>Loading Admin Console...</div>;
  if (error) return (
    <div style={{ color: '#ef4444', textAlign: 'center', padding: '5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '20px' }}>
      <h1>🚫 {error}</h1>
      <p>Please log in with an administrator account to view this page.</p>
    </div>
  );

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 style={{ margin: 0, textAlign: 'left', fontSize: '2rem' }}>Global Admin Console</h1>
          <p style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.875rem' }}>System-wide security metrics and user oversight</p>
        </div>
      </div>

      <div className="kpi-grid">
        <KpiWidget title="Total Users" value={stats.totalUsers} trend="true" trendValue="Registered" isPositive={true} />
        <KpiWidget title="Global Scans" value={stats.totalScans} trend="true" trendValue="Total" isPositive={true} />
        <KpiWidget title="Threats Detected" value={stats.dangerousScans} trend="true" trendValue="Dangerous" isPositive={false} />
        <KpiWidget title="Safe Sites" value={stats.safeScans} trend="true" trendValue="Verified" isPositive={true} />
      </div>

      <div className="bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <Globe size={20} color="#94a3b8" />
            Global Security Health
          </div>
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircleChart 
              safe={stats.safeScans} 
              dangerous={stats.dangerousScans} 
              total={stats.totalScans} 
            />
            <h3 style={{ marginTop: '2rem', color: '#fff' }}>Top Blocked Threats</h3>
            <div style={{ width: '100%', marginTop: '1rem' }}>
              {stats.topBlocked.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '0.75rem', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  marginBottom: '0.5rem', 
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: '#ef4444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                    {item._id}
                  </span>
                  <span style={{ fontWeight: 'bold' }}>{item.count} hits</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <Users size={20} color="#94a3b8" />
            User Directory
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '0.75rem' }}>Name</th>
                  <th style={{ padding: '0.75rem' }}>Email</th>
                  <th style={{ padding: '0.75rem' }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.75rem' }}>{user.name}</td>
                    <td style={{ padding: '0.75rem', opacity: 0.7 }}>{user.email}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.75rem',
                        background: user.role === 'admin' ? '#6366f1' : 'rgba(255,255,255,0.1)'
                      }}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
