import React, { useEffect, useState } from 'react';
import { History as HistoryIcon, Search, ShieldAlert, CheckCircle, AlertTriangle, User } from 'lucide-react';

const AdminHistory = () => {
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalHistory = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const res = await fetch('http://localhost:5000/api/admin/history', {
          headers: { 'Authorization': `Bearer ${userInfo.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setHistory(data);
        } else {
          console.error('Global History API failed:', res.status);
        }
      } catch (err) {
        console.error('Failed to fetch global history:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGlobalHistory();
  }, []);

  const filteredHistory = history.filter(item => 
    item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case 'SAFE': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircle size={14} /> };
      case 'DANGEROUS': return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', icon: <ShieldAlert size={14} /> };
      case 'SUSPICIOUS': return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: <AlertTriangle size={14} /> };
      default: return { color: '#94a3b8', bg: 'rgba(255, 255, 255, 0.05)', icon: <HistoryIcon size={14} /> };
    }
  };

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', padding: '5rem' }}>Loading Global Audit Log...</div>;

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 style={{ margin: 0, textAlign: 'left', fontSize: '2rem' }}>Global Audit Log</h1>
          <p style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.875rem' }}>Full visibility into all system-wide URL activity</p>
        </div>
      </div>

      <div className="panel">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="text" 
              placeholder="Search by URL or Status..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0', minWidth: '800px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>User ID</th>
                <th style={{ padding: '1rem' }}>URL Address</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem' }}>Risk Score</th>
                <th style={{ padding: '1rem' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', opacity: 0.5 }}>
                    No audit records found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => {
                  const style = getStatusStyle(item.status);
                  return (
                    <tr key={item._id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.05)', transition: 'all 0.2s' }}>
                      <td style={{ padding: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                           <User size={14} /> {item.user ? item.user.slice(-6) : 'System'}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.url}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ 
                          display: 'flex', alignItems: 'center', gap: '0.4rem', 
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', 
                          fontWeight: '600', color: style.color, background: style.bg, width: 'fit-content'
                        }}>
                          {style.icon} {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                        {item.riskScore}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.8rem', opacity: 0.6 }}>
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminHistory;
