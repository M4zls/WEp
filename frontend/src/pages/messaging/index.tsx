import React, { FC, ReactElement, FormEvent } from 'react';
import { useMessaging } from './use-messaging';

const MessagingPage: FC = (): ReactElement => {
  const {
    conversations, activeConversation, messages,
    loadingConvs, loadingMsgs, error,
    newMessage, sending,
    view, contacts, loadingContacts,
    userId,
    setNewMessage, selectConversation, handleSend,
    startConversation, openNew, setView, setError,
  } = useMessaging();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const formatTime = (dateStr?: string | null): string => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
  };

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
      <div className="w-80 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">
            {view === 'new' ? 'Nueva conversación' : 'Mensajes'}
          </h3>
          {view === 'conversations' ? (
            <button
              onClick={openNew}
              className="text-sm px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              + Nueva
            </button>
          ) : (
            <button
              onClick={() => setView('conversations')}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Volver
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {view === 'conversations' ? (
            loadingConvs ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-10">No hay conversaciones</p>
            ) : (
              conversations.map((conv) => {
                const otro = conv.otherParticipant || conv.participants?.find((p) => p.userId !== userId);
                const activa = activeConversation?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv)}
                    className={`w-full text-left px-4 py-3 border-b border-slate-50 transition-colors ${
                      activa ? 'bg-emerald-50' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-slate-800 truncate">
                        {otro ? `${otro.userFirstName} ${otro.userLastName}` : 'Usuario'}
                      </span>
                      <span className="text-xs text-slate-400 shrink-0 ml-2">
                        {formatDate(conv.lastMessage?.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {conv.lastMessage?.content || 'Sin mensajes'}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )
          ) : view === 'new' ? (
            loadingContacts ? (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : contacts.length === 0 ? (
              <p className="text-center text-slate-400 text-sm py-10">No hay contactos disponibles</p>
            ) : (
              contacts.map((contact, i) => (
                <button
                  key={`${contact.id}-${i}`}
                  onClick={() => startConversation(contact)}
                  className="w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {(contact.firstName?.charAt(0) || '') + (contact.lastName?.charAt(0) || '')}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-slate-800 truncate">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{contact.context}</p>
                    </div>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${
                      contact.role === 'professor' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {contact.role === 'professor' ? 'Prof' : 'Est'}
                    </span>
                  </div>
                </button>
              ))
            )
          ) : null}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {!activeConversation ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            {view === 'new' ? 'Seleccionar un contacto' : 'Seleccionar una conversación'}
          </div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
              {(() => {
                const otro = activeConversation.otherParticipant ||
                  activeConversation.participants?.find((p) => p.userId !== userId);
                return (
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                      {otro ? (otro.userFirstName?.charAt(0) || '') + (otro.userLastName?.charAt(0) || '') : '?'}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">
                        {otro ? `${otro.userFirstName} ${otro.userLastName}` : 'Usuario'}
                      </p>
                      <span className={`text-xs ${
                        otro?.userRole === 'professor' ? 'text-purple-500' : 'text-blue-500'
                      }`}>
                        {otro?.userRole === 'professor' ? 'Profesor' : 'Estudiante'}
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
              ) : messages.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-10">
                  No hay mensajes. Escribe algo para iniciar la conversación.
                </p>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === userId;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                        isMine
                          ? 'bg-emerald-500 text-white rounded-br-md'
                          : 'bg-slate-100 text-slate-800 rounded-bl-md'
                      }`}>
                        {!isMine && (
                          <p className="text-xs font-medium text-slate-500 mb-0.5">
                            {msg.senderFirstName} {msg.senderLastName}
                          </p>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMine ? 'text-emerald-100' : 'text-slate-400'}`}>
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
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-400 focus:border-transparent outline-none transition-all text-sm"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
              >
                {sending ? 'Enviando...' : 'Enviar'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;
