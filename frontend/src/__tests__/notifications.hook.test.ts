/**
 * Tests for useNotifications hook.
 *
 * @module notifications.hook.test
 */

vi.mock('../pages/notifications/notifications.service', () => ({
  default: {
    getByUsuario: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
  },
}));

import { renderHook, waitFor, act } from '@testing-library/react';
import { useNotifications } from '../pages/notifications/use-notifications';
import notificationsService from '../pages/notifications/notifications.service';

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  /**
   * Should load notifications on mount when a valid user exists in sessionStorage.
   */
  it('should load notifications on mount when user exists', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 123 }));
    const mockNotis = [
      {
        id: 1,
        titulo: 'Test',
        mensaje: 'Hello',
        tipo: 'info',
        leida: false,
        usuarioId: 123,
        url: null,
        fechaCreacion: null,
        fechaLectura: null,
      },
    ];
    vi.mocked(notificationsService.getByUsuario).mockResolvedValue(mockNotis);

    const { result } = renderHook(() => useNotifications());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.notifications).toEqual(mockNotis);
    expect(result.current.usuarioId).toBe(123);
  });

  /**
   * Should return empty notifications when no user is stored in sessionStorage.
   */
  it('should return empty when no user', async () => {
    const { result } = renderHook(() => useNotifications());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.notifications).toEqual([]);
    expect(result.current.usuarioId).toBeNull();
  });

  /**
   * Should set the error state when the service call fails.
   */
  it('should set error on fetch failure', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 1 }));
    vi.mocked(notificationsService.getByUsuario).mockRejectedValue(
      new Error('Network error'),
    );

    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Network error');
  });

  /**
   * Should mark a notification as read and update the local state.
   */
  it('should markAsRead and update state', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 1 }));
    const mockNotis = [
      {
        id: 1,
        titulo: 'Test',
        mensaje: 'Hello',
        tipo: 'info',
        leida: false,
        usuarioId: 1,
        url: null,
        fechaCreacion: null,
        fechaLectura: null,
      },
    ];
    vi.mocked(notificationsService.getByUsuario).mockResolvedValue(mockNotis);
    vi.mocked(notificationsService.markAsRead).mockResolvedValue(undefined);

    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.markAsRead(1);
    });
    expect(result.current.notifications[0].leida).toBe(true);
  });

  /**
   * Should reload notifications from the server and update the state.
   */
  it('should reload', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 1 }));
    vi.mocked(notificationsService.getByUsuario).mockResolvedValue([]);

    const { result } = renderHook(() => useNotifications());
    await waitFor(() => expect(result.current.loading).toBe(false));

    vi.mocked(notificationsService.getByUsuario).mockResolvedValue([
      {
        id: 2,
        titulo: 'New',
        mensaje: 'New',
        tipo: 'info',
        leida: false,
        usuarioId: 1,
        url: null,
        fechaCreacion: null,
        fechaLectura: null,
      },
    ]);
    await act(async () => {
      await result.current.reload();
    });
    expect(result.current.notifications).toHaveLength(1);
  });
});
