import React, { ReactNode, FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }): ReactElement => {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
