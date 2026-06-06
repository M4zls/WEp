const TOKEN_KEY = 'token';

// SessionPersistence
class AuthService {
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  removeToken(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // jwt decode
  // retornar como JSON el payload del JWT : SessionData = { id: string, username: string }
}

export default new AuthService();
