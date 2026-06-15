import React, { FC, ReactElement, FormEvent } from 'react';
import { useMensajeria } from './useMensajeria';

/** Página principal de mensajería con panel lateral de conversaciones y panel de chat. */
const MensajeriaPage: FC = (): ReactElement => {
  const {
    conversaciones, conversacionActiva, mensajes,
    loadingConvs, loadingMsgs, error,
    nuevoMensaje, enviando,
    vista, contactos, loadingContactos,
    usuarioId,
    setNuevoMensaje, seleccionarConversacion, handleEnviar,
    iniciarConversacion, abrirNuevo, setVista, setError,
  } = useMensajeria();

  /** Maneja el envío del formulario de mensaje. */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleEnviar();
  };

  /** Formatea una fecha ISO a hora local (HH:MM). */
  const formatTime = (dateStr?: string | null): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  };

  /**
   * Formatea una fecha ISO de forma relativa:
   * - Hoy → hora (HH:MM)
   * - Ayer → "Ayer"
   * - Otros → "dd mes"
   */
  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return formatTime(dateStr);
    if (d.toDateString() === yesterday.toDateString()) return 'Ayer';
    return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' });
  };

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => setError(null)} className="text-emerald-600 hover:underline text-sm">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Panel lateral */}
      <div className="w-80 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">
            {vista === 'nuevo' ? 'Nueva Conversación' : 'Mensajes'}
          </h3>
          {vista === 'conversaciones' ? (
            <button
              onClick={abrirNuevo}
              className="text-sm px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              + Nuevo
            </button>
          ) : (
            <button
              onClick={() => setVista('conversaciones')}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Volver
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {vista === 'conversaciones' ? (
            loadingConvs ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : conversaciones.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-10">Sin conversaciones</p>
            ) : (
              conversaciones.map((conv) => {
                const otro = conv.otherParticipant || conv.participantes?.find((p) => p.usuarioId !== usuarioId);
                const activa = conversacionActiva?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => seleccionarConversacion(conv)}
                    className={`w-full text-left px-4 py-3 border-b border-slate-50 transition-colors ${
                      activa ? 'bg-emerald-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-slate-800 truncate">
                        {otro ? `${otro.usuarioNombre} ${otro.usuarioApellido}` : 'Usuario'}
                      </span>
                      <span className="text-xs text-slate-400 shrink-0 ml-2">
                        {formatDate(conv.ultimoMensaje?.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {conv.ultimoMensaje?.contenido || 'Sin mensajes'}
                    </p>
                    {conv.noLeidos > 0 && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                        {conv.noLeidos}
                      </span>
                    )}
                  </button>
                );
              })
            )
          ) : vista === 'nuevo' ? (
            loadingContactos ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : contactos.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-10">No hay contactos disponibles</p>
            ) : (
              contactos.map((contacto, i) => (
                <button
                  key={`${contacto.id}-${i}`}
                  onClick={() => iniciarConversacion(contacto)}
                  className="w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {(contacto.nombre?.charAt(0) || '') + (contacto.apellido?.charAt(0) || '')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-slate-800 truncate">
                        {contacto.nombre} {contacto.apellido}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{contacto.contexto}</p>
                    </div>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${
                      contacto.rol === 'profesor' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {contacto.rol === 'profesor' ? 'Prof' : 'Est'}
                    </span>
                  </div>
                </button>
              ))
            )
          ) : null}
        </div>
      </div>

      {/* Panel de chat */}
      <div className="flex-1 flex flex-col">
        {!conversacionActiva ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            {vista === 'nuevo' ? 'Selecciona un contacto' : 'Selecciona una conversación'}
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
              {(() => {
                const otro = conversacionActiva.otherParticipant ||
                  conversacionActiva.participantes?.find((p) => p.usuarioId !== usuarioId);
                return (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                      {otro ? (otro.usuarioNombre?.charAt(0) || '') + (otro.usuarioApellido?.charAt(0) || '') : '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">
                        {otro ? `${otro.usuarioNombre} ${otro.usuarioApellido}` : 'Usuario'}
                      </p>
                      <span className={`text-xs ${
                        otro?.usuarioRol === 'profesor' ? 'text-purple-500' : 'text-blue-500'
                      }`}>
                        {otro?.usuarioRol === 'profesor' ? 'Profesor' : 'Estudiante'}
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {loadingMsgs ? (
                <div className="flex justify-center py-10">
                  <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : mensajes.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-10">
                  No hay mensajes. Escribe algo para iniciar la conversación.
                </p>
              ) : (
                mensajes.map((msg) => {
                  const esMio = msg.remitenteId === usuarioId;
                  return (
                    <div key={msg.id} className={`flex ${esMio ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                        esMio
                          ? 'bg-emerald-500 text-white rounded-br-md'
                          : 'bg-slate-100 text-slate-800 rounded-bl-md'
                      }`}>
                        {!esMio && (
                          <p className="text-xs font-medium text-slate-500 mb-0.5">
                            {msg.remitenteNombre} {msg.remitenteApellido}
                          </p>
                        )}
                        <p className="text-sm">{msg.contenido}</p>
                        <p className={`text-xs mt-1 ${esMio ? 'text-emerald-100' : 'text-slate-400'}`}>
                          {formatTime(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-slate-200 p-4 flex gap-3">
              <input
                type="text"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all text-sm"
                disabled={enviando}
              />
              <button
                type="submit"
                disabled={enviando || !nuevoMensaje.trim()}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {enviando ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MensajeriaPage;
