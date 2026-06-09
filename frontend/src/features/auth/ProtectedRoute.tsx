import React, { ReactNode, FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from './auth.store';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }): ReactElement => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
