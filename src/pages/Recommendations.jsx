import React, { useEffect, useState } from 'react';
import { ShieldAlert, Info, ExternalLink } from 'lucide-react';

const Recommendations = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const response = await fetch('http://localhost:5000/api/history', {
          headers: {
            'Authorization': `Bearer ${userInfo.token}`
          }
        });
        const data = await response.json();
        
        if (response.ok) {
          // Filter history items that are suspicious or dangerous and have recommendations
          const filtered = data.filter(item => item.status !== 'SAFE' && item.recommendation);
          setAlerts(filtered);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 style={{ margin: 0, textAlign: 'left', fontSize: '2rem' }}>Security Recommendations</h1>
          <p style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.875rem' }}>Actionable advice based on your recent activity</p>
        </div>
      </div>
      
      <div className="panel" style={{ flexGrow: 1 }}>
        <div className="panel-header">Urgent Actions Required</div>
        
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Analyzing your history...</div>
        ) : alerts.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <div style={{ marginBottom: '1rem' }}>✅</div>
            <p>Your security posture looks great! No urgent recommendations at this time.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
            {alerts.map((alert) => (
              <div 
                key={alert._id} 
                style={{ 
                  padding: '1.5rem', 
                  background: alert.status === 'DANGEROUS' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)', 
                  borderLeft: `4px solid ${alert.status === 'DANGEROUS' ? '#ef4444' : '#f59e0b'}`, 
                  borderRadius: '8px',
                  border: `1px solid ${alert.status === 'DANGEROUS' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {alert.status === 'DANGEROUS' ? <ShieldAlert size={20} color="#ef4444" /> : <Info size={20} color="#f59e0b" />}
                    <span style={{ fontWeight: '600', color: alert.status === 'DANGEROUS' ? '#ef4444' : '#f59e0b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {alert.status} Alert
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(alert.createdAt).toLocaleDateString()}</span>
                </div>

                <h3 style={{ margin: '0 0 0.75rem 0', color: '#e2e8f0', fontSize: '1.1rem' }}>{alert.recommendation}</h3>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  padding: '0.5rem 0.75rem', 
                  background: 'rgba(15, 23, 42, 0.5)', 
                  borderRadius: '6px',
                  width: 'fit-content'
                }}>
                  <ExternalLink size={14} color="#94a3b8" />
                  <span style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {alert.url}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Recommendations;
