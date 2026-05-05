import React from 'react';

const Settings = () => {
  return (
    <>
      <div className="dashboard-header">
        <div>
          <h1 style={{ margin: 0, textAlign: 'left', fontSize: '2rem' }}>Settings</h1>
          <p style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.875rem' }}>Configure platform preferences</p>
        </div>
      </div>
      
      <div className="panel" style={{ flexGrow: 1 }}>
        <div className="panel-header">Account Preferences</div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
          <div className="input-group">
            <label style={{ color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>Organization Name</label>
            <input type="text" defaultValue="Acme Corp" style={{ 
              width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px'
            }} />
          </div>
          
          <div className="input-group">
            <label style={{ color: '#94a3b8', marginBottom: '0.5rem', display: 'block' }}>Alert Email</label>
            <input type="email" defaultValue="admin@acme.com" style={{ 
              width: '100%', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '6px'
            }} />
          </div>

          <button className="btn btn-primary" style={{ marginTop: '1rem', width: 'fit-content' }}>Save Changes</button>
        </div>
      </div>
    </>
  );
};

export default Settings;
