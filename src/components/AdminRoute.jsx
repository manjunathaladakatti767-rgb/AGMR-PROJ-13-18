import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const userInfoStr = localStorage.getItem('userInfo');
  let userInfo = null;

  try {
    if (userInfoStr) {
      userInfo = JSON.parse(userInfoStr);
    }
  } catch (error) {
    console.error('Failed to parse userInfo:', error);
  }

  // If there's no user, or the user is not an admin, redirect to dashboard or login
  if (!userInfo) {
    return <Navigate to="/" replace />;
  }

  if (userInfo.role !== 'admin' && userInfo.role !== 'superuser') {
    return <Navigate to="/dashboard" replace />;
  }

  // If user is admin, allow them to access the nested routes
  return <Outlet />;
};

export default AdminRoute;
