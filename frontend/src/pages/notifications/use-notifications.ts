import { useState, useEffect, useCallback } from 'react';
import notificationsService from './notifications.service';
import type { InAppNotificacion } from './notifications.service';

export function useNotifications() {
  const [notifications, setNotifications] = useState<InAppNotificacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const usuarioId = (() => {
    try {
      const stored = sessionStorage.getItem('user');
      if (!stored) return null;
      const user = JSON.parse(stored);
      return user.id ?? null;
    } catch {
      return null;
    }
  })();

  const load = useCallback(async () => {
    if (!usuarioId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await notificationsService.getByUsuario(usuarioId);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    load();
  }, [load]);

  const markAsRead = async (id: number) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch {
      // silent
    }
  };

  return { notifications, loading, error, markAsRead, reload: load, usuarioId };
}
