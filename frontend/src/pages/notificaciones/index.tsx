import React, { FC, ReactElement } from 'react';
import { useNotificaciones } from './useNotificaciones';

const NotificacionesPage: FC = (): ReactElement => {
  const { notificaciones, loading, error, marcarLeida } = useNotificaciones();

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) {
      return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
    }
    if (d.toDateString() === yesterday.toDateString()) return 'Ayer';
    return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  };

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100">
        <h3 className="text-lg font-semibold text-slate-800">Notificaciones</h3>
        <p className="text-sm text-slate-500 mt-1">
          {notificaciones.filter((n) => !n.leida).length} sin leer
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-2xl">🔔</span>
            </div>
            <p className="text-slate-500 text-sm">No tienes notificaciones</p>
          </div>
        ) : (
          notificaciones.map((notif) => (
            <div
              key={notif.id}
              className={`px-6 py-4 flex items-start gap-4 transition-colors ${
                !notif.leida ? 'bg-emerald-50/50' : 'hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  notif.tipo === 'nota'
                    ? 'bg-blue-100'
                    : notif.tipo === 'asistencia'
                    ? 'bg-amber-100'
                    : notif.tipo === 'mensaje'
                    ? 'bg-indigo-100'
                    : 'bg-slate-100'
                }`}
              >
                <span className="text-lg">
                  {notif.tipo === 'nota' ? '📊' : notif.tipo === 'asistencia' ? '📋' : notif.tipo === 'mensaje' ? '💬' : '🔔'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm ${!notif.leida ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                    {notif.titulo}
                  </p>
                  <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">
                    {formatDate(notif.fechaCreacion)}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">{notif.mensaje}</p>
                {!notif.leida && (
                  <button
                    onClick={() => marcarLeida(notif.id)}
                    className="mt-2 text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Marcar como leída
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificacionesPage;
