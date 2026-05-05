import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Search } from 'lucide-react';

const RiskAnalysis = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // 1. Call the URL Safety Checker (Port 5001)
      const scanResponse = await fetch('http://localhost:5001/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const scanData = await scanResponse.json();
      
      if (!scanResponse.ok) throw new Error(scanData.error || 'Scan failed');
      
      setResult(scanData);

      // 2. Save to history in PermGuard Backend (Port 5000)
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await fetch('http://localhost:5000/api/history', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          url: scanData.url,
          status: scanData.status,
          riskScore: scanData.riskScore,
          reasons: scanData.reasons,
          recommendation: scanData.recommendation
        })
      });
    } catch (err) {
      setError(err.message || 'Failed to scan URL. Make sure the safety checker is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 style={{ margin: 0, textAlign: 'left', fontSize: '2rem' }}>URL Risk Analysis</h1>
          <p style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.875rem' }}>Scan any URL for potential security threats</p>
        </div>
      </div>
      
      <div className="panel">
        <div className="panel-header">Scan a URL</div>
        <form onSubmit={handleScan} style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ flexGrow: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="https://example.com" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem 1rem 0.75rem 3rem', 
                background: 'rgba(15, 23, 42, 0.5)', 
                border: '1px solid rgba(148, 163, 184, 0.2)', 
                borderRadius: '8px', 
                color: '#fff' 
              }}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: 'auto', padding: '0 2rem' }}
          >
            {loading ? 'Scanning...' : 'Scan Now'}
          </button>
        </form>

        {error && (
          <div style={{ marginTop: '1rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            {error}
          </div>
        )}

        {result && (
          <div style={{ marginTop: '2rem', animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              background: result.status === 'SAFE' ? 'rgba(16, 185, 129, 0.05)' : result.status === 'DANGEROUS' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(245, 158, 11, 0.05)',
              border: `1px solid ${result.status === 'SAFE' ? 'rgba(16, 185, 129, 0.2)' : result.status === 'DANGEROUS' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: result.status === 'SAFE' ? '#10b981' : result.status === 'DANGEROUS' ? '#ef4444' : '#f59e0b',
                color: '#fff'
              }}>
                {result.status === 'SAFE' ? <CheckCircle size={32} /> : result.status === 'DANGEROUS' ? <Shield size={32} /> : <AlertTriangle size={32} />}
              </div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{result.status}</h2>
                  <span style={{ color: '#94a3b8', fontSize: '1rem' }}>({result.riskScore}% Risk)</span>
                </div>
                <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8' }}>{result.url}</p>
              </div>
            </div>

            {result.recommendation && (
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1rem', 
                borderRadius: '8px', 
                background: 'rgba(255, 255, 255, 0.03)', 
                borderLeft: `4px solid ${result.status === 'SAFE' ? '#10b981' : result.status === 'DANGEROUS' ? '#ef4444' : '#f59e0b'}` 
              }}>
                <h3 style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 0.5rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Recommendation</h3>
                <p style={{ margin: 0, color: '#e2e8f0', fontSize: '1rem', fontWeight: '500' }}>{result.recommendation}</p>
              </div>
            )}

            {result.reasons.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#e2e8f0' }}>Risk Factors Detected:</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.reasons.map((reason, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#94a3b8' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: result.status === 'SAFE' ? '#10b981' : result.status === 'DANGEROUS' ? '#ef4444' : '#f59e0b' }}></div>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default RiskAnalysis;
