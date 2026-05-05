import React from 'react';
import KpiWidget from '../components/KpiWidget';
import CircleChart from '../components/CircleChart';
import { Users, Globe, ShieldAlert, CheckCircle, List, Server, Cpu, Database } from 'lucide-react';

const Admin = () => {
  // --- MOCK DATA FOR UI PREVIEW ---
  const stats = {
    totalUsers: 1248,
    totalScans: 45602,
    dangerousScans: 3120,
    safeScans: 42482
  };

  const topBlocked = [
    { _id: 'malware-site-01.ru', count: 852 },
    { _id: 'bank-verify-secure.net', count: 641 },
    { _id: 'free-crypto-giveaway.io', count: 423 },
    { _id: 'account-update-login.com', count: 215 },
    { _id: 'suspicious-download.zip', count: 189 }
  ];

  const mockUsers = [
    { _id: '1', name: 'Manjunath', email: 'manju@example.com', role: 'admin', status: 'Active' },
    { _id: '2', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'Active' },
    { _id: '3', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'Blocked' },
    { _id: '4', name: 'Alex Wilson', email: 'alex@example.com', role: 'user', status: 'Active' },
    { _id: '5', name: 'Prajval', email: 'praj@gmail.com', role: 'admin', status: 'Active' }
  ];

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 style={{ margin: 0, textAlign: 'left', fontSize: '2rem' }}>Global Admin Console <span style={{ fontSize: '0.8rem', background: '#3b82f6', padding: '4px 8px', borderRadius: '4px', verticalAlign: 'middle' }}>PREVIEW</span></h1>
          <p style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.875rem' }}>Enterprise-wide security monitoring and threat intelligence</p>
        </div>
      </div>

      <div className="kpi-grid">
        <KpiWidget title="Global Users" value={stats.totalUsers} trend="true" trendValue="+12% this month" isPositive={true} />
        <KpiWidget title="Network Scans" value={stats.totalScans.toLocaleString()} trend="true" trendValue="High Load" isPositive={true} />
        <KpiWidget title="Threats Neutralized" value={stats.dangerousScans} trend="true" trendValue="+5% from yesterday" isPositive={false} />
        <KpiWidget title="System Health" value="98.2%" trend="true" trendValue="Optimal" isPositive={true} />
      </div>

      <div className="bottom-grid">
        <div className="panel">
          <div className="panel-header">
            <Globe size={20} color="#94a3b8" />
            Global Threat Distribution
          </div>
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircleChart 
              safe={stats.safeScans} 
              dangerous={stats.dangerousScans} 
              total={stats.totalScans} 
            />
            
            <h3 style={{ marginTop: '2rem', color: '#fff', fontSize: '1rem' }}>🔥 Top Phishing Domains</h3>
            <div style={{ width: '100%', marginTop: '1rem' }}>
              {topBlocked.map((item, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '0.75rem', 
                  background: 'rgba(239, 68, 68, 0.05)', 
                  border: '1px solid rgba(239, 68, 68, 0.1)',
                  marginBottom: '0.5rem', 
                  borderRadius: '8px',
                  fontSize: '0.85rem'
                }}>
                  <span style={{ color: '#ef4444', fontWeight: '500' }}>{item._id}</span>
                  <span style={{ opacity: 0.8 }}>{item.count} attacks</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header">
            <Users size={20} color="#94a3b8" />
            User Management Hub
          </div>
          <div style={{ overflowY: 'auto', maxHeight: '450px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Role</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map(user => (
                  <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: '600' }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{user.email}</div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '0.7rem',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        background: user.role === 'admin' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                        color: user.role === 'admin' ? '#818cf8' : '#94a3b8',
                        border: `1px solid ${user.role === 'admin' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.1)'}`
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        color: user.status === 'Active' ? '#10b981' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.85rem'
                      }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: user.status === 'Active' ? '#10b981' : '#ef4444' }}></div>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', display: 'flex', gap: '1rem' }}>
             <div style={{ flex: 1, padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>API LATENCY</div>
                <div style={{ color: '#60a5fa', fontWeight: 'bold' }}>24ms</div>
             </div>
             <div style={{ flex: 1, padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>DB UPTIME</div>
                <div style={{ color: '#10b981', fontWeight: 'bold' }}>99.9%</div>
             </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
