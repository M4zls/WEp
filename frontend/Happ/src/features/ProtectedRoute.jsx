/**
 * Componente de autenticación reutilizable
 * Envuelve rutas que requieren autenticación
 */

import { Navigate } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
