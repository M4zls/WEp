import apiClient from '../../api/apiClient';

export interface InAppNotificacion {
  id: number;
  usuarioId: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
  url: string | null;
  fechaCreacion: string | null;
  fechaLectura: string | null;
}

class NotificacionesService {
  async getByUsuario(usuarioId: number): Promise<InAppNotificacion[]> {
    return apiClient.get(`/notificaciones/usuario/${usuarioId}`);
  }

  async getUnreadCount(usuarioId: number): Promise<{ count: number }> {
    return apiClient.get(`/notificaciones/usuario/${usuarioId}/no-leidas`);
  }

  async markAsRead(id: number): Promise<void> {
    return apiClient.put(`/notificaciones/${id}/leer`, {});
  }
}

export default new NotificacionesService();
