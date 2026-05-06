import React, { useState, useEffect } from 'react';
import { Save, Lock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLockdown } from '../lockdown/LockdownContext';

const SettingsPanel = () => {
  const { lockdownState } = useLockdown();
  const [settings, setSettings] = useState({
    urlScanning: true,
    notifications: true,
    riskThreshold: 70,
    alertFrequency: 'Instant',
    scanMode: 'Active'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const res = await fetch('http://localhost:5000/api/settings', {
          headers: { 'Authorization': `Bearer ${userInfo.token}` }
        });
        if (res.ok) {
          const result = await res.json();
          setSettings(result.data);
        }
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const res = await fetch('http://localhost:5000/api/settings', {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const isLocked = lockdownState.active;

  if (loading) return <div>Loading settings...</div>;

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', marginTop: '2rem', position: 'relative' }}>
      
      {isLocked && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', backdropFilter: 'blur(4px)' }}>
          <Lock size={48} color="#dc2626" style={{ marginBottom: '1rem' }} />
          <h2 style={{ color: 'white', margin: 0 }}>SETTINGS LOCKED</h2>
          <p style={{ color: '#cbd5e1' }}>Configuration is disabled during global lockdown.</p>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <AlertTriangle color="#a855f7" size={28} />
        <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#fff' }}>Global Security Settings</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* URL Scanning */}
        <div>
          <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>Enable URL Scanning</label>
          <input 
            type="checkbox" 
            checked={settings.urlScanning} 
            onChange={(e) => setSettings({...settings, urlScanning: e.target.checked})}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>

        {/* Notifications */}
        <div>
          <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>Enable Notifications</label>
          <input 
            type="checkbox" 
            checked={settings.notifications} 
            onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        </div>

        {/* Risk Threshold */}
        <div>
          <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>Risk Threshold (0-100): {settings.riskThreshold}</label>
          <input 
            type="range" 
            min="0" max="100" 
            value={settings.riskThreshold} 
            onChange={(e) => setSettings({...settings, riskThreshold: parseInt(e.target.value)})}
            style={{ width: '100%' }}
          />
        </div>

        {/* Alert Frequency */}
        <div>
          <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>Alert Frequency</label>
          <select 
            value={settings.alertFrequency} 
            onChange={(e) => setSettings({...settings, alertFrequency: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#1e293b', color: 'white', border: '1px solid rgba(168, 85, 247, 0.3)' }}
          >
            <option>Instant</option>
            <option>Hourly</option>
            <option>Daily</option>
          </select>
        </div>

        {/* Scan Mode */}
        <div>
          <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>Default Scan Mode</label>
          <select 
            value={settings.scanMode} 
            onChange={(e) => setSettings({...settings, scanMode: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#1e293b', color: 'white', border: '1px solid rgba(168, 85, 247, 0.3)' }}
          >
            <option>Passive</option>
            <option>Active</option>
            <option>Aggressive</option>
          </select>
        </div>
      </div>

      <button onClick={handleSave} style={{ marginTop: '2rem', background: '#a855f7', color: 'white', padding: '0.75rem 2rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Save size={20} /> Save Settings
      </button>

    </div>
  );
};

export default SettingsPanel;
