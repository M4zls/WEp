import React, { 
  createContext, 
  useReducer, 
  useCallback, 
  ReactNode,
  FC,
  ReactElement
} from 'react';

interface User {
  email: string;
  role: 'estudiante' | 'profesor';
}

interface AuthState {
  user: User | null;
  token: string | null;
  role: 'estudiante' | 'profesor' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginAction {
  type: 'LOGIN_START';
}

interface LoginSuccessAction {
  type: 'LOGIN_SUCCESS';
  payload: {
    user: User;
    token: string;
    role: 'estudiante' | 'profesor';
  };
}

interface LoginErrorAction {
  type: 'LOGIN_ERROR';
  payload: string;
}

interface LogoutAction {
  type: 'LOGOUT';
}

interface SetErrorAction {
  type: 'SET_ERROR';
  payload: string | null;
}

interface ClearErrorAction {
  type: 'CLEAR_ERROR';
}

type AuthAction = 
  | LoginAction 
  | LoginSuccessAction 
  | LoginErrorAction 
  | LogoutAction 
  | SetErrorAction 
  | ClearErrorAction;

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: 'estudiante' | 'profesor') => Promise<boolean>;
  logout: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  token: null,
  role: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case 'LOGIN_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false,
      };

    case 'LOGOUT':
      return {
        ...initialState,
        token: null,
      };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }): ReactElement => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(
    async (email: string, password: string, role: 'estudiante' | 'profesor'): Promise<boolean> => {
      dispatch({ type: 'LOGIN_START' });
      try {
        const user: User = { email, role };
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('role', role);

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { 
            user, 
            token: 'token_' + Date.now(), 
            role 
          },
        });
        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        dispatch({
          type: 'LOGIN_ERROR',
          payload: errorMessage,
        });
        return false;
      }
    },
    []
  );

  const logout = useCallback((): void => {
    sessionStorage.clear();
    dispatch({ type: 'LOGOUT' });
  }, []);

  const setError = useCallback((error: string | null): void => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const clearError = useCallback((): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    setError,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
