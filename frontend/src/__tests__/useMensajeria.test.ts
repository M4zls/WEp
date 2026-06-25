vi.mock('../api/apiClient', () => ({
  default: { get: vi.fn(), put: vi.fn(), post: vi.fn() },
}));
vi.mock('../pages/courses/courses.service', () => ({
  default: { getCourses: vi.fn(), getSubjects: vi.fn(), getStudentsByCourse: vi.fn() },
}));

import { renderHook, waitFor, act } from '@testing-library/react';
import { useMessaging } from '../pages/messaging/use-messaging';
import apiClient from '../api/apiClient';

describe('useMessaging', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('should load conversations on mount', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', nombre: 'Juan', apellido: 'Perez' }));
    sessionStorage.setItem('role', 'estudiante');
    vi.mocked(apiClient.get).mockResolvedValue([{ id: 1, otherParticipant: { userId: '2', usuarioNombre: 'Ana', usuarioApellido: 'Lopez', usuarioRol: 'profesor' }, participantes: [], ultimoMensaje: null, noLeidos: 0 }]);

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));
    expect(result.current.conversaciones).toHaveLength(1);
  });

  it('should set error on fetch failure', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', nombre: 'Juan', apellido: 'Perez' }));
    sessionStorage.setItem('role', 'estudiante');
    vi.mocked(apiClient.get).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));
    expect(result.current.error).toBe('Error al cargar conversaciones');
  });

  it('should set nuevoMensaje', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', nombre: 'Juan', apellido: 'Perez' }));
    sessionStorage.setItem('role', 'estudiante');
    vi.mocked(apiClient.get).mockResolvedValue([]);
    vi.mocked(apiClient.post).mockResolvedValue({ id: 1, content: 'Hola' });

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));

    act(() => { result.current.setNuevoMensaje('Hola'); });
    expect(result.current.nuevoMensaje).toBe('Hola');
  });

  it('should have correct initial state', () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', nombre: 'Juan', apellido: 'Perez' }));
    sessionStorage.setItem('role', 'estudiante');

    const { result } = renderHook(() => useMessaging());
    expect(result.current.vista).toBe('conversaciones');
    expect(result.current.nuevoMensaje).toBe('');
    expect(result.current.enviando).toBe(false);
    expect(result.current.conversacionActiva).toBeNull();
  });

  it('should set error to null when setError called', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', nombre: 'Juan', apellido: 'Perez' }));
    sessionStorage.setItem('role', 'estudiante');
    vi.mocked(apiClient.get).mockRejectedValue(new Error('err'));

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.error).toBe('Error al cargar conversaciones'));

    act(() => { result.current.setError(null); });
    expect(result.current.error).toBeNull();
  });
});
