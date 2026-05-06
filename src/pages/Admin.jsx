import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ShieldAlert, Activity, Settings, ArrowRight, Trash2, Info, Zap, Terminal, Lock, Users } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const blacklistRef = useRef(null);
  const settingsRef = useRef(null);

  const [stats, setStats] = useState({ totalUsers: 0, totalScans: 0, dangerousScans: 0, safeScans: 0 });
  const [blacklist, setBlacklist] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [sensitivity, setSensitivity] = useState(75);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) return;
      const userInfo = JSON.parse(userInfoStr);

      const statsRes = await fetch('http://localhost:5000/api/admin/stats', { headers: { 'Authorization': `Bearer ${userInfo.token}` } });
      const policyRes = await fetch('http://localhost:5000/api/admin/policy', { headers: { 'Authorization': `Bearer ${userInfo.token}` } });

      if (statsRes.ok) {
        setStats(await statsRes.json());
      } else {
        console.error('Admin Stats API failed:', statsRes.status);
      }

      if (policyRes.ok) {
        const policyData = await policyRes.json();
        setBlacklist(policyData.blacklist || []);
        setSensitivity(policyData.sensitivityThreshold || 75);
      } else {
        console.error('Admin Policy API failed:', policyRes.status);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchAdminData(); }, []);

  const handleAddBlacklist = async () => {
    if (!newUrl) return;
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    await fetch('http://localhost:5000/api/admin/policy/blacklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
      body: JSON.stringify({ url: newUrl })
    });
    setNewUrl('');
    fetchAdminData();
  };

  const removeBlacklist = async (url) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    await fetch('http://localhost:5000/api/admin/policy/blacklist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
      body: JSON.stringify({ url })
    });
    fetchAdminData();
  };

  const updateSensitivity = async (val) => {
    setSensitivity(val);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    await fetch('http://localhost:5000/api/admin/policy/sensitivity', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
      body: JSON.stringify({ threshold: val })
    });
  };

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020617', color: '#6366f1' }}>
      <Zap size={48} className="animate-pulse" />
      <p style={{ marginTop: '1rem', letterSpacing: '0.2em', fontSize: '0.8rem' }}>INITIALIZING MASTER HUB...</p>
    </div>
  );

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent), #020617' }}>
      
      {/* --- MASTER HEADER --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderLeft: '4px solid #6366f1', paddingLeft: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.02em', color: '#fff' }}>AccessShield <span style={{ color: '#6366f1' }}>Master Hub</span></h1>
          <p style={{ margin: 0, opacity: 0.5, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Enterprise Security Infrastructure Control</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.7rem', opacity: 0.5 }}>ENGINE STATUS</div>
              <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Activity size={14} /> NOMINAL
              </div>
           </div>
        </div>
      </div>

      {/* --- MASTER KPI CARDS --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
         {[
           { label: 'Network Users', val: stats.totalUsers, icon: <Users size={20} />, color: '#3b82f6' },
           { label: 'Global Scans', val: stats.totalScans, icon: <Globe size={20} />, color: '#6366f1' },
           { label: 'Threats Blocked', val: stats.dangerousScans, icon: <ShieldAlert size={20} />, color: '#ef4444' },
           { label: 'System Uptime', val: '99.9%', icon: <Activity size={20} />, color: '#10b981' }
         ].map((kpi, i) => (
           <div key={i} style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ p: '8px', borderRadius: '8px', background: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</div>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fff' }}>{kpi.val}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem' }}>{kpi.label.toUpperCase()}</div>
           </div>
         ))}
      </div>

      {/* --- QUICK ACTION CENTER --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
         <button onClick={() => navigate('/admin-history')} style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#fff', padding: '1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <Terminal size={20} color="#6366f1" /> View History <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
         </button>
         <button onClick={() => scrollTo(blacklistRef)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fff', padding: '1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
            <Lock size={20} color="#ef4444" /> Blacklist <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
         </button>
      </div>

      {/* --- MASTER CONTROL PANELS --- */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* BLACKLIST EDITOR */}
        <div ref={blacklistRef} style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <ShieldAlert color="#ef4444" />
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Global Perimeter Control</h3>
           </div>
           
           <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
              <input 
                type="text" 
                placeholder="Target domain (e.g. malicious-site.com)" 
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', color: '#fff' }}
              />
              <button onClick={handleAddBlacklist} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0 2rem', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                ADD TO VOID
              </button>
           </div>

           <div style={{ display: 'grid', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
              {blacklist.map((url, i) => (
                <div key={i} style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontFamily: 'monospace', color: '#ef4444' }}>{url}</span>
                   <Trash2 size={18} color="#94a3b8" style={{ cursor: 'pointer' }} onClick={() => removeBlacklist(url)} />
                </div>
              ))}
           </div>
        </div>

        {/* SENSITIVITY ENGINE */}
        <div ref={settingsRef} style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <Settings color="#6366f1" />
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Core Heuristics</h3>
           </div>
           
           <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', fontWeight: '900', color: '#6366f1' }}>{sensitivity}%</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.5rem', letterSpacing: '0.2em' }}>SENSITIVITY THRESHOLD</div>
           </div>

           <input 
              type="range" min="20" max="95" value={sensitivity} 
              onChange={(e) => updateSensitivity(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', margin: '2rem 0' }}
           />

           <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1.5rem', borderRadius: '16px', fontSize: '0.8rem', lineHeight: '1.6', color: '#94a3b8' }}>
              <Info size={16} color="#6366f1" style={{ marginBottom: '0.5rem' }} />
              Lower values increase the **Strictness** of the scanning engine.
           </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
