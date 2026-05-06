import React, { useState, useEffect } from 'react';
import { Users, ShieldAlert, Lock, Shield, Crown, Info, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuperAdmin = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lockdownModal, setLockdownModal] = useState(false);
  const [lockdownReason, setLockdownReason] = useState('');
  const [lockdownStatus, setLockdownStatus] = useState({ active: false });
  const [currentUserId, setCurrentUserId] = useState(null);

  const fetchSuperAdminData = async () => {
    try {
      const userInfoStr = localStorage.getItem('userInfo');
      if (!userInfoStr) return;
      const userInfo = JSON.parse(userInfoStr);
      setCurrentUserId(userInfo._id);

      const usersRes = await fetch('http://localhost:5000/api/admin/users', { 
        headers: { 'Authorization': `Bearer ${userInfo.token}` } 
      });
      const statsRes = await fetch('http://localhost:5000/api/admin/stats', { 
        headers: { 'Authorization': `Bearer ${userInfo.token}` } 
      });
      const lockdownRes = await fetch('http://localhost:5000/api/lockdown/status');

      if (usersRes.ok) {
        const uData = await usersRes.json();
        setUsers(uData);
      } else {
        console.error('Users API failed:', usersRes.status);
      }

      if (statsRes.ok) {
        const sData = await statsRes.json();
        setStats(sData);
      } else {
        console.error('Stats API failed:', statsRes.status);
      }

      if (lockdownRes.ok) {
        const ld = await lockdownRes.json();
        setLockdownStatus(ld.data);
      }
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchSuperAdminData(); }, []);

  const updateUserRole = async (userId, role) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    await fetch('http://localhost:5000/api/admin/users/role', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
      body: JSON.stringify({ userId, role })
    });
    fetchSuperAdminData();
  };

  const handleLockdown = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const url = lockdownStatus.active ? '/api/lockdown/deactivate' : '/api/lockdown/activate';
    const body = lockdownStatus.active ? {} : { reason: lockdownReason };
    
    await fetch(`http://localhost:5000${url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
      body: JSON.stringify(body)
    });
    
    setLockdownModal(false);
    setLockdownReason('');
    fetchSuperAdminData();
  };

  if (loading) return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
      <Crown size={64} className="animate-pulse" />
      <p style={{ marginTop: '1rem', letterSpacing: '0.3em', fontSize: '1rem', fontWeight: 'bold' }}>INITIALIZING GOD MODE...</p>
    </div>
  );

  const activeAdmins = users.filter(u => u.role === 'admin' || u.role === 'superadmin').length;

  return (
    <div style={{ padding: '2rem', minHeight: '100vh', background: 'transparent' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderLeft: '4px solid #fbbf24', paddingLeft: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.02em', color: '#fff', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Crown color="#fbbf24" size={36} /> AccessShield <span style={{ color: '#fbbf24' }}>Super Admin</span>
          </h1>
          <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fbbf24' }}>Global Project Owner & Identity Access</p>
        </div>
        <div>
          {!lockdownStatus.active ? (
            <button onClick={() => setLockdownModal(true)} style={{ background: '#dc2626', color: 'white', fontWeight: 'bold', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)' }}>
              <ShieldAlert size={20} /> EMERGENCY STOP
            </button>
          ) : (
            <button onClick={handleLockdown} style={{ background: '#10b981', color: 'white', fontWeight: 'bold', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
              <ShieldCheck size={20} /> DEACTIVATE LOCKDOWN
            </button>
          )}
        </div>
      </div>

      {/* LOCKDOWN MODAL */}
      {lockdownModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', border: '2px solid #dc2626', padding: '2rem', borderRadius: '16px', width: '400px' }}>
            <h2 style={{ color: '#dc2626', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldAlert /> CONFIRM LOCKDOWN</h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Activating a global lockdown will freeze all non-admin sessions immediately.</p>
            <textarea 
              value={lockdownReason} 
              onChange={(e) => setLockdownReason(e.target.value)} 
              placeholder="Reason for lockdown (Required)..." 
              style={{ width: '100%', height: '100px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #dc2626', background: 'rgba(0,0,0,0.5)', color: 'white', marginTop: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setLockdownModal(false)} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
              <button disabled={!lockdownReason} onClick={handleLockdown} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: lockdownReason ? 'pointer' : 'not-allowed', opacity: lockdownReason ? 1 : 0.5 }}>Confirm Lockdown</button>
            </div>
          </div>
        </div>
      )}

      {/* GOD MODE STATS */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
          {[
            { label: 'Total Identities', val: stats.totalUsers, icon: <Shield size={20} />, color: '#fbbf24' },
            { label: 'Global Security Events', val: stats.totalScans, icon: <ShieldAlert size={20} />, color: '#ef4444' },
            { label: 'Active Admins', val: activeAdmins, icon: <Users size={20} />, color: '#10b981' },
            { label: 'System Access', val: 'UNRESTRICTED', icon: <Lock size={20} />, color: '#a855f7' }
          ].map((kpi, i) => (
            <div key={i} style={{ background: 'rgba(30, 41, 59, 0.8)', border: '1px solid rgba(251, 191, 36, 0.2)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                 <div style={{ padding: '8px', borderRadius: '8px', background: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</div>
               </div>
               <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#fff' }}>{kpi.val}</div>
               <div style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem', color: '#fbbf24' }}>{kpi.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      )}

      {/* IDENTITY MANAGEMENT */}
      <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(251, 191, 36, 0.2)', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <ShieldCheck color="#fbbf24" size={28} />
            <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#fff' }}>Global Identity Management</h3>
         </div>
         
         <div style={{ padding: '1rem', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '8px', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#fbbf24', fontSize: '0.9rem' }}>
            <Info size={20} /> Only Super Admins can assign or revoke administrative privileges across the network.
         </div>

         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
               <tr style={{ textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <th style={{ padding: '1.5rem', color: '#fbbf24', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identity</th>
                  <th style={{ padding: '1.5rem', color: '#fbbf24', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Clearance</th>
                  <th style={{ padding: '1.5rem', color: '#fbbf24', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
               </tr>
            </thead>
            <tbody>
               {users.map((u, i) => (
                 <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1.5rem' }}>
                       <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.1rem' }}>{u.name}</div>
                       <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{u.email}</div>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                       <span style={{ 
                         background: u.role === 'superadmin' ? 'rgba(251, 191, 36, 0.2)' : u.role === 'superuser' ? 'rgba(168, 85, 247, 0.2)' : u.role === 'admin' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)', 
                         color: u.role === 'superadmin' ? '#fbbf24' : u.role === 'superuser' ? '#a855f7' : u.role === 'admin' ? '#818cf8' : '#94a3b8', 
                         padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: `1px solid ${u.role === 'superadmin' ? '#fbbf24' : u.role === 'superuser' ? '#a855f7' : 'transparent'}`
                       }}>
                          {u.role.toUpperCase()}
                       </span>
                    </td>
                    <td style={{ padding: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {u._id === currentUserId ? (
                           <span style={{ color: '#fbbf24', fontWeight: 'bold', fontSize: '0.8rem' }}>Current Session</span>
                        ) : (
                           <>
                              {u.role !== 'user' && u.role !== 'superadmin' && (
                                <button onClick={() => updateUserRole(u._id, 'user')} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', transition: 'all 0.2s' }}>
                                  Revoke Role
                                </button>
                              )}
                              {u.role !== 'admin' && u.role !== 'superadmin' && (
                                <button onClick={() => updateUserRole(u._id, 'admin')} style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', transition: 'all 0.2s' }}>
                                  Make Admin
                                </button>
                              )}
                              {u.role !== 'superuser' && u.role !== 'superadmin' && (
                                <button onClick={() => updateUserRole(u._id, 'superuser')} style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#a855f7', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem', transition: 'all 0.2s' }}>
                                  Make Premium
                                </button>
                              )}
                              {u.role !== 'superadmin' && (
                                <button onClick={() => updateUserRole(u._id, 'superadmin')} style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)', border: 'none', color: '#000', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '900', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)' }}>
                                  <Crown size={16} /> Grant GOD MODE
                                </button>
                              )}
                           </>
                        )}
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default SuperAdmin;
