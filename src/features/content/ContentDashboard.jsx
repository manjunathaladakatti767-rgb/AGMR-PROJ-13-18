import React, { useState, useEffect } from 'react';
import { Database, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLockdown } from '../lockdown/LockdownContext';

const ContentDashboard = () => {
  const { lockdownState } = useLockdown();
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', type: 'Safety Tip', body: '' });

  const fetchContent = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const res = await fetch(`http://localhost:5000/api/content?status=${statusFilter}&search=${search}`, {
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setContent(result.data);
      }
    } catch (err) {
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [search, statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const res = await fetch('http://localhost:5000/api/content', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Content added successfully');
        setIsModalOpen(false);
        setFormData({ title: '', type: 'Safety Tip', body: '' });
        fetchContent();
      }
    } catch (err) {
      toast.error('Failed to add content');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await fetch(`http://localhost:5000/api/content/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      toast.success('Content deleted');
      fetchContent();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      await fetch(`http://localhost:5000/api/content/${id}/status`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      toast.success(`Content marked as ${status}`);
      fetchContent();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div style={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '24px', padding: '2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', marginTop: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Database color="#a855f7" size={28} />
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: '#fff' }}>Content Management</h3>
        </div>
        {!lockdownState.active && (
          <button onClick={() => setIsModalOpen(true)} style={{ background: '#10b981', color: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Add Content
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input 
          type="text" 
          placeholder="Search titles..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
        />
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: '0.75rem', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
            <th style={{ padding: '1rem' }}>Title</th>
            <th style={{ padding: '1rem' }}>Type</th>
            <th style={{ padding: '1rem' }}>Status</th>
            <th style={{ padding: '1rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>Loading...</td></tr>
          ) : content.length === 0 ? (
            <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center' }}>No content found.</td></tr>
          ) : content.map((item) => (
            <tr key={item._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '1rem' }}>{item.title}</td>
              <td style={{ padding: '1rem' }}>
                <span style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.8rem' }}>{item.type}</span>
              </td>
              <td style={{ padding: '1rem' }}>
                <span style={{ 
                  padding: '4px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold',
                  background: item.status === 'Approved' ? 'rgba(16, 185, 129, 0.2)' : item.status === 'Rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                  color: item.status === 'Approved' ? '#10b981' : item.status === 'Rejected' ? '#ef4444' : '#fbbf24'
                }}>
                  {item.status}
                </span>
              </td>
              <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                {!lockdownState.active && (
                  <>
                    {item.status === 'Pending' && (
                      <>
                        <button onClick={() => handleStatusChange(item._id, 'Approved')} style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer' }}><CheckCircle size={18} /></button>
                        <button onClick={() => handleStatusChange(item._id, 'Rejected')} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><XCircle size={18} /></button>
                      </>
                    )}
                    <button onClick={() => handleDelete(item._id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleSubmit} style={{ background: '#1e293b', padding: '2rem', borderRadius: '16px', width: '500px' }}>
            <h2 style={{ color: 'white', marginTop: 0 }}>Add Content</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>Title</label>
              <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>Type</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                <option>Safety Tip</option>
                <option>URL</option>
                <option>Post</option>
              </select>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#cbd5e1', display: 'block', marginBottom: '0.5rem' }}>Body / Content</label>
              <textarea required rows="4" value={formData.body} onChange={(e) => setFormData({...formData, body: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Cancel</button>
              <button type="submit" style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Save Content</button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default ContentDashboard;
