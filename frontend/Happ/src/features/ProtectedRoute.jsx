/**
 * Componente de autenticación reutilizable
 * Envuelve rutas que requieren autenticación
 */

import { useAuth } from './useAuth';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Debes iniciar sesión para acceder a esta página</div>;
  }

  return children;
}
