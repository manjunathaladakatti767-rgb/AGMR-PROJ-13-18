import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleButton from './GoogleButton';
import { API_BASE_URL } from '../api/config';

const SignUpForm = ({ toggleForm }) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Cannot connect to server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h1>Create Account</h1>
      <p>Set up your secure profile</p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {error && <div style={{ color: '#ef4444', fontSize: '0.875rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
        </div>

        <div className="input-group">
          <label htmlFor="signup-email">Email Address</label>
          <input type="email" id="signup-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
        </div>
        
        <div className="input-group">
          <label htmlFor="signup-password">Password</label>
          <input type="password" id="signup-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="divider">or register with</div>
      
      <GoogleButton />

      <div className="toggle-text">
        Already have an account? 
        <button className="toggle-link" onClick={toggleForm}>
          Sign in
        </button>
      </div>
    </div>
  );
};

export default SignUpForm;
