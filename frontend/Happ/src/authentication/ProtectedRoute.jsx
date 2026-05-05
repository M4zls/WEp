import { Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
