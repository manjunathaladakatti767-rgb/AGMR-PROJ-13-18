import React from 'react';
import { Outlet } from 'react-router-dom';
import FloatingShapes from './FloatingShapes';

const SharedLayout = () => {
  return (
    <>
      <FloatingShapes />
      <Outlet />
    </>
  );
};

export default SharedLayout;
