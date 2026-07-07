vi.mock('../pages/auth/service', () => ({
  default: {
    getToken: vi.fn(),
  },
}));

import apiClient from '../api/apiClient';
import authService from '../pages/auth/service';

describe('ApiClient', () => {
  const mockFetch = vi.fn();

  beforeAll(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  beforeEach(() => {
    mockFetch.mockReset();
    vi.mocked(authService.getToken).mockReturnValue(null);
  });

  it('should make GET request without auth', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });

    const result = await apiClient.get('/cursos');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3100/api/cursos',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    );
    expect(result).toEqual({ data: 'test' });
  });

  it('should include Authorization header when token exists', async () => {
    vi.mocked(authService.getToken).mockReturnValue('secret-token');
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await apiClient.get('/cursos');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer secret-token',
        }),
      }),
    );
  });

  it('should make POST request with JSON body', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 1 }),
    });

    const result = await apiClient.post('/clases', { titulo: 'Test' });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3100/api/clases',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ titulo: 'Test' }),
      }),
    );
    expect(result).toEqual({ id: 1 });
  });

  it('should make PUT request with JSON body', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await apiClient.put('/clases/1', { titulo: 'Updated' });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3100/api/clases/1',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ titulo: 'Updated' }),
      }),
    );
  });

  it('should make DELETE request', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await apiClient.delete('/clases/1');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3100/api/clases/1',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('should merge custom headers', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    await apiClient.get('/test', {
      headers: { 'X-Custom': 'value' },
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3100/api/test',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'X-Custom': 'value',
        }),
      }),
    );
  });

  it('should throw on non-ok response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(apiClient.get('/notfound')).rejects.toThrow('HTTP Error: 404');
  });

  it('should throw on network error', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    await expect(apiClient.get('/fail')).rejects.toThrow('Network error');
  });
});
