import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSession } from '../contexts/AppSessionContext';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useAppSession();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
