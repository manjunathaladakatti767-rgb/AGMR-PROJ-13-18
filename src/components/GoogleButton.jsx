import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

const GoogleButton = () => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userInfo', JSON.stringify(data));
        window.location.href = '/dashboard';
      } else {
        alert(data.message || 'Google Login Failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      alert('An error occurred during Google Login');
    }
  };

  const handleError = () => {
    console.error('Google Login Failed');
    alert('Google Login Failed');
  };

  return (
    <div className="google-auth-container" style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap
        theme="filled_blue"
        shape="pill"
        width="250"
      />
    </div>
  );
};

export default GoogleButton;
