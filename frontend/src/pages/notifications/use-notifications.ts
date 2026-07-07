import { useState, useEffect, useCallback } from 'react';
import notificationsService from './notifications.service';
import type { InAppNotification } from './notifications.service';

export function useNotifications() {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = (() => {
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
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await notificationsService.getByUser(userId);
      setNotifications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading notifications');
    } finally {
      setLoading(false);
    }
  }, [userId]);

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

  return { notifications, loading, error, markAsRead, reload: load, userId };
}
