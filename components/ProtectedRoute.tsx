import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSession } from '../contexts/AppSessionContext';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const location = useLocation();
  const { authStatus, isAuthenticated } = useAppSession();

  if (authStatus === 'loading') {
    return (
      <div className="px-4 py-12 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
        Checking your account...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
