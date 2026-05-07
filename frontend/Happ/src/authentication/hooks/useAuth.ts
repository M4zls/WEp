import { useState, useCallback } from 'react';

interface User {
  email: string;
  role: 'estudiante' | 'profesor';
}

interface UseAuthReturn {
  isLoading: boolean;
  error: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<any> => {
    setIsLoading(true);
    setError(null);
    try {
      // Aquí iría la llamada al servicio real
      const result = { user: { email, role: 'estudiante' as const } };
      setUser(result.user);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback((): void => {
    setUser(null);
  }, []);

  return {
    isLoading,
    error,
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
