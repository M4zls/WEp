import authService from '../pages/auth/service';

describe('AuthService', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should return null when no token', () => {
    expect(authService.getToken()).toBeNull();
  });

  it('should set and get token', () => {
    authService.setToken('test-token');
    expect(authService.getToken()).toBe('test-token');
  });

  it('should overwrite existing token', () => {
    authService.setToken('first');
    authService.setToken('second');
    expect(authService.getToken()).toBe('second');
  });

  it('should remove token', () => {
    authService.setToken('test-token');
    authService.removeToken();
    expect(authService.getToken()).toBeNull();
  });

  it('should report not authenticated when no token', () => {
    expect(authService.isAuthenticated()).toBe(false);
  });

  it('should report authenticated when token exists', () => {
    authService.setToken('test-token');
    expect(authService.isAuthenticated()).toBe(true);
  });

  it('should handle removeToken when no token exists', () => {
    expect(() => authService.removeToken()).not.toThrow();
  });
});
