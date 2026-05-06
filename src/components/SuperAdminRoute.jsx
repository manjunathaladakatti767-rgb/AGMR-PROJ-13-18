import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const SuperAdminRoute = () => {
  const userInfoStr = localStorage.getItem('userInfo');
  let userInfo = null;

  try {
    if (userInfoStr) {
      userInfo = JSON.parse(userInfoStr);
    }
  } catch (error) {
    console.error('Failed to parse userInfo:', error);
  }

  // Restrict everything except superadmin
  if (!userInfo) {
    return <Navigate to="/" replace />;
  }

  if (userInfo.role !== 'superadmin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default SuperAdminRoute;
