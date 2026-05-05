import { ApiClient } from '../infra/ApiClient.js';

export const AuthService = {
  // identifier puede ser email o RUT
  async login(identifier, password) {
    const data = await ApiClient.post('/auth/login', { identifier, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    return data;
  },

  async logout() {
    try {
      await ApiClient.post('/auth/logout', {});
    } catch (_) {
      // si falla igual limpiamos local
    }
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUsuario() {
    const u = localStorage.getItem('usuario');
    return u ? JSON.parse(u) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};