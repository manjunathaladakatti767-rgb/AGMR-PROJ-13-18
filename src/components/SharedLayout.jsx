import React from 'react';
import { Outlet } from 'react-router-dom';
import FloatingShapes from './FloatingShapes';
import LockdownBanner from '../features/lockdown/LockdownBanner';

const SharedLayout = () => {
  return (
    <>
      <LockdownBanner />
      <FloatingShapes />
      <Outlet />
    </>
  );
};

export default SharedLayout;
