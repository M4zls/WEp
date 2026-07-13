import { useAuthStore } from '../pages/auth/store';

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    sessionStorage.clear();
    localStorage.clear();
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.role).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should login successfully as student', async () => {
    const result = await useAuthStore.getState().login('test@alumnocbo.cl', '123456', 'student');
    expect(result).toBe(true);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.user?.email).toBe('test@alumnocbo.cl');
    expect(state.role).toBe('student');
    expect(state.token).toMatch(/^token_/);
  });

  it('should login successfully as professor', async () => {
    const result = await useAuthStore.getState().login('test@profesorcbo.cl', '123456', 'professor');
    expect(result).toBe(true);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.role).toBe('professor');
    expect(state.user?.email).toBe('test@profesorcbo.cl');
  });

  it('should logout and clear state', () => {
    useAuthStore.getState().login('test@alumnocbo.cl', '123456', 'student');
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.role).toBeNull();
  });

  it('should set and clear error', () => {
    useAuthStore.getState().setError('test error');
    expect(useAuthStore.getState().error).toBe('test error');

    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });

  it('should set login success', () => {
    useAuthStore.getState().setLoginSuccess(
      { email: 'test@test.com', role: 'professor' },
      'token123',
      'professor',
    );

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.user?.email).toBe('test@test.com');
    expect(state.token).toBe('token123');
    expect(state.role).toBe('professor');
    expect(state.error).toBeNull();
  });
});
