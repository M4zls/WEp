class AuthService {
  private token: string | null = null;

  setToken(token: string): void {
    this.token = token;
    sessionStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = sessionStorage.getItem('authToken');
    }
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    sessionStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    this.clearToken();
    sessionStorage.clear();
  }
}

export default new AuthService();
