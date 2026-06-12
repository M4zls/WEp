import authService from '../pages/auth/service';

const API_BASE_URL: string = 'http://localhost:3000/api';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

class ApiClient {
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
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error en petición ${endpoint}:`, error);
      throw error;
    }
  }

  get(endpoint: string, options?: RequestOptions): Promise<any> {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint: string, data: any, options?: RequestOptions): Promise<any> {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint: string, data: any, options?: RequestOptions): Promise<any> {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint: string, options?: RequestOptions): Promise<any> {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export default new ApiClient();
