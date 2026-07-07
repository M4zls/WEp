import authService from '../pages/auth/service';

const API_BASE_URL: string = 'http://localhost:3100/api';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

/** Cliente HTTP base para todas las llamadas a la API del BFF.
 * Incluye automáticamente el token JWT en cada petición. */
class ApiClient {
  /**
   * Realiza una petición HTTP genérica.
   * @param endpoint - Ruta relativa (se concatena con API_BASE_URL).
   * @param options - Opciones de fetch (method, body, headers, etc.).
   * @throws Error si la respuesta HTTP no es exitosa.
   */
  async request(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = authService.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let detail = `HTTP Error: ${response.status}`;
        try {
          const errBody = await response.json();
          if (errBody?.error) detail = errBody.error;
        } catch { /* ignore */ }
        throw new Error(detail);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error en petición ${endpoint}:`, error);
      throw error;
    }
  }

  /** Petición GET. */
  get(endpoint: string, options?: RequestOptions): Promise<any> {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /** Petición POST con cuerpo JSON. */
  post(endpoint: string, data: any, options?: RequestOptions): Promise<any> {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /** Petición PUT con cuerpo JSON. */
  put(endpoint: string, data: any, options?: RequestOptions): Promise<any> {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /** Petición DELETE. */
  delete(endpoint: string, options?: RequestOptions): Promise<any> {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export default new ApiClient();
