import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const SuperUserRoute = () => {
  const userInfoStr = localStorage.getItem('userInfo');
  let userInfo = null;

  try {
    if (userInfoStr) {
      userInfo = JSON.parse(userInfoStr);
    }
  } catch (error) {
    console.error('Failed to parse userInfo:', error);
  }

  // Restrict everything except superuser and superadmin (since superadmin should probably have access too)
  if (!userInfo) {
    return <Navigate to="/" replace />;
  }

  if (userInfo.role !== 'superuser' && userInfo.role !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default SuperUserRoute;
