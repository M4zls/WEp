/**
 * Test suite for NotificationsService.
 * Covers methods for fetching, counting, and marking notifications as read.
 */
vi.mock('../api/apiClient', () => ({
  default: { get: vi.fn(), put: vi.fn() },
}));

import notificationsService from '../pages/notifications/notifications.service';
import apiClient from '../api/apiClient';

describe('NotificationsService', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.put).mockReset();
  });

  /** Verifies that getByUsuario calls GET /notifications/usuario/:id */
  it('should getByUsuario', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await notificationsService.getByUsuario(1);
    expect(apiClient.get).toHaveBeenCalledWith('/notifications/usuario/1');
  });

  /** Verifies that getUnreadCount calls GET /notifications/usuario/:id/no-leidas and returns the count */
  it('should getUnreadCount', async () => {
    vi.mocked(apiClient.get).mockResolvedValue({ count: 3 });
    const result = await notificationsService.getUnreadCount(1);
    expect(apiClient.get).toHaveBeenCalledWith('/notifications/usuario/1/no-leidas');
    expect(result.count).toBe(3);
  });

  /** Verifies that markAsRead sends a PUT to /notifications/:id/leer */
  it('should markAsRead', async () => {
    vi.mocked(apiClient.put).mockResolvedValue(undefined);
    await notificationsService.markAsRead(5);
    expect(apiClient.put).toHaveBeenCalledWith('/notifications/5/leer', {});
  });
});
