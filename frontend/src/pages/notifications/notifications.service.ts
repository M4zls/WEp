import apiClient from '../../api/apiClient';

export interface InAppNotificacion {
  id: number;
  usuarioId: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  url: string | null;
  createdAt: string | null;
  readAt: string | null;
}

class NotificationsService {
  async getByUsuario(usuarioId: number): Promise<InAppNotificacion[]> {
    return apiClient.get(`/notifications/usuario/${usuarioId}`);
  }

  async getUnreadCount(usuarioId: number): Promise<{ count: number }> {
    return apiClient.get(`/notifications/usuario/${usuarioId}/no-leidas`);
  }

  async markAsRead(id: number): Promise<void> {
    return apiClient.put(`/notifications/${id}/leer`, {});
  }
}

export default new NotificationsService();
