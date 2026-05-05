import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const response = await fetch('http://localhost:5000/api/history', {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setHistory(data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id) => {
    console.log('Attempting to delete record with ID:', id);
    if (!window.confirm('Are you sure you want to delete this record?')) return;

    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) {
        alert('User session not found. Please log in again.');
        return;
      }
      
      const userInfo = JSON.parse(userInfoStr);
      const deleteUrl = `http://localhost:5000/api/history/${id}`;
      console.log('Sending DELETE request to:', deleteUrl);

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Delete Response:', data);

      if (response.ok) {
        // Remove from local state
        setHistory(prevHistory => prevHistory.filter(item => item._id !== id));
        console.log('Successfully removed item from state');
      } else {
        alert(`Failed to delete: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Failed to delete record. Please check if the server is running on port 5000.');
    }
  };

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 style={{ margin: 0, textAlign: 'left', fontSize: '2rem' }}>Access History</h1>
          <p style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.875rem' }}>Historical logs of URL safety checks</p>
        </div>
      </div>
      
      <div className="panel" style={{ flexGrow: 1 }}>
        <div className="panel-header">Historical Records</div>
        
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading history...</div>
        ) : history.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b', marginTop: '4rem' }}>
            No records found. Start scanning URLs to see your history!
          </div>
        ) : (
          <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', color: '#e2e8f0' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', textAlign: 'left' }}>
                  <th style={{ padding: '1rem' }}>URL</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Risk Score</th>
                  <th style={{ padding: '1rem' }}>Date</th>
                  <th style={{ padding: '1rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
                    <td style={{ padding: '1rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.url}>{item.url}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem',
                        background: item.status === 'SAFE' ? 'rgba(16, 185, 129, 0.1)' : item.status === 'DANGEROUS' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: item.status === 'SAFE' ? '#10b981' : item.status === 'DANGEROUS' ? '#ef4444' : '#f59e0b',
                        border: `1px solid ${item.status === 'SAFE' ? 'rgba(16, 185, 129, 0.2)' : item.status === 'DANGEROUS' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>{item.riskScore}%</td>
                    <td style={{ padding: '1rem', color: '#94a3b8' }}>{new Date(item.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => handleDelete(item._id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '0.5rem', transition: 'color 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseOut={(e) => e.currentTarget.style.color = '#64748b'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default History;
