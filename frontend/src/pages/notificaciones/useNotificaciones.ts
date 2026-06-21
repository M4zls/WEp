import { useState, useEffect, useCallback } from 'react';
import notificacionesService from './service';
import type { InAppNotificacion } from './service';

export function useNotificaciones() {
  const [notificaciones, setNotificaciones] = useState<InAppNotificacion[]>([]);
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
      const data = await notificacionesService.getByUsuario(usuarioId);
      setNotificaciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    load();
  }, [load]);

  const marcarLeida = async (id: number) => {
    try {
      await notificacionesService.markAsRead(id);
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n)),
      );
    } catch {
      // silent
    }
  };

  return { notificaciones, loading, error, marcarLeida, reload: load, usuarioId };
}
