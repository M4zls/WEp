/**
 * Servicio de autenticación
 * Maneja login, logout, y gestión de tokens
 */

class AuthService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  async login(email, password) {
    try {
      // Llamar a API de backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
        this.token = data.token;
      }
      return data;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  async logout() {
    localStorage.removeItem('auth_token');
    this.token = null;
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export default new AuthService();
