/**
 * Hook personalizado para manejo de autenticación
 * Proporciona acceso al estado y funciones de autenticación
 */

import { useState, useCallback } from 'react';
import AuthService from '../infra/AuthService';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await AuthService.login(email, password);
      setUser(result.user);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
  }, []);

  return {
    isLoading,
    error,
    user,
    login,
    logout,
    isAuthenticated: AuthService.isAuthenticated(),
  };
}
