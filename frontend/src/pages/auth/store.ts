import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../../common/types';

interface AuthState {
  user: User | null;
  token: string | null;
  role: 'estudiante' | 'profesor' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, role: 'estudiante' | 'profesor') => Promise<boolean>;
  setLoginSuccess: (user: User, token: string, role: 'estudiante' | 'profesor') => void;
  logout: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, _password, role) => {
        set({ isLoading: true, error: null });
        try {
          const user: User = { email, role };
          set({
            user,
            token: 'token_' + Date.now(),
            role,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return true;
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Error desconocido';
          set({ isLoading: false, error: msg, isAuthenticated: false });
          return false;
        }
      },

      setLoginSuccess: (user, token, role) => {
        set({ user, token, role, isAuthenticated: true, isLoading: false, error: null });
      },

      logout: () => {
        sessionStorage.clear();
        set({ user: null, token: null, role: null, isAuthenticated: false, isLoading: false, error: null });
      },

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
