import apiClient from '../../api/apiClient';

export interface InAppNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  url: string | null;
  createdAt: string | null;
  readAt: string | null;
}

class NotificationsService {
  async getByUser(userId: number): Promise<InAppNotification[]> {
    return apiClient.get(`/notifications/user/${userId}`);
  }

  async getUnreadCount(userId: number): Promise<{ count: number }> {
    return apiClient.get(`/notifications/user/${userId}/unread`);
  }

  async markAsRead(id: number): Promise<void> {
    return apiClient.put(`/notifications/${id}/read`, {});
  }
}

export default new NotificationsService();
