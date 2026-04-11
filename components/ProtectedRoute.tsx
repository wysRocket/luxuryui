import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSession } from '../contexts/AppSessionContext';

const ProtectedRoute: React.FC<{
  children: React.ReactElement;
  requireAdmin?: boolean;
  fallbackPath?: string;
}> = ({ children, requireAdmin = false, fallbackPath = '/account' }) => {
  const location = useLocation();
  const { authStatus, isAuthenticated, isAdmin = false, adminStatus = 'ready' } = useAppSession();

  if (authStatus === 'loading' || (requireAdmin && adminStatus !== 'ready')) {
    return (
      <div className="px-4 py-12 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
        {requireAdmin ? 'Checking your backoffice access...' : 'Checking your account...'}
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
