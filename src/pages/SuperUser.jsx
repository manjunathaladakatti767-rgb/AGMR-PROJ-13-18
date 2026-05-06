import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, Shield, Activity, Lock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SettingsPanel from '../features/settings/SettingsPanel';
import ContentDashboard from '../features/content/ContentDashboard';

const SuperUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading premium data
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
      <Sparkles size={64} className="animate-pulse" />
      <p style={{ marginTop: '1rem', letterSpacing: '0.3em', fontSize: '1rem', fontWeight: 'bold' }}>LOADING PREMIUM FEATURES...</p>
    </div>
  );

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'transparent' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderLeft: '4px solid #a855f7', paddingLeft: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', color: '#fff', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Sparkles color="#a855f7" size={36} /> AccessShield <span style={{ color: '#a855f7' }}>Premium</span>
          </h1>
          <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a855f7' }}>Super User Insights & Deep Scanning</p>
        </div>
      </div>

      {/* PREMIUM STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'Deep Scans Performed', val: '1,248', icon: <Search size={20} />, color: '#a855f7' },
          { label: 'Premium Protection Level', val: 'MAXIMUM', icon: <Shield size={20} />, color: '#3b82f6' },
          { label: 'Threat Intelligence DB', val: 'SYNCED', icon: <Activity size={20} />, color: '#10b981' }
        ].map((kpi, i) => (
          <div key={i} style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(168, 85, 247, 0.2)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
               <div style={{ padding: '8px', borderRadius: '8px', background: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</div>
             </div>
             <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fff' }}>{kpi.val}</div>
             <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem', color: '#a855f7' }}>{kpi.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* PREMIUM FEATURES LOCKOUT FOR STANDARD USERS */}
      <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Lock color="#a855f7" size={28} />
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#fff' }}>Exclusive Threat Intelligence</h3>
         </div>
         
         <div style={{ padding: '2rem', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '12px', border: '1px solid rgba(168, 85, 247, 0.1)', color: '#cbd5e1', lineHeight: 1.6 }}>
            <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1rem' }}>Real-time Heuristic Engine</h4>
            <p style={{ marginBottom: '1rem' }}>As a Premium Super User, your web traffic is analyzed by our advanced heuristic engine. You receive priority zero-day threat protection.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button style={{ background: '#a855f7', border: 'none', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={18} /> Initiate Deep System Scan
              </button>
            </div>
         </div>
      </div>

      {/* MODULE 1: SETTINGS */}
      <SettingsPanel />

      {/* MODULE 2: CONTENT MANAGEMENT */}
      <ContentDashboard />

    </div>
  );
};

export default SuperUser;
