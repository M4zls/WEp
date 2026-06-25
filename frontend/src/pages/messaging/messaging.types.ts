export interface Conversation {
  id: number;
  otherParticipant: {
    userId: string;
    usuarioNombre: string;
    usuarioApellido: string;
    usuarioRol: string;
  } | null;
  participantes: ConversationParticipant[];
  ultimoMensaje: Message | null;
  noLeidos: number;
  createdAt?: string | null;
}

export interface ConversationParticipant {
  id?: number;
  conversacionId: number;
  userId: string;
  usuarioNombre: string;
  usuarioApellido: string;
  usuarioRol: string;
}

export interface Message {
  id?: number;
  conversacionId: number;
  remitenteId: string;
  remitenteNombre: string;
  remitenteApellido: string;
  remitenteRol: string;
  content: string;
  leido?: boolean | null;
  createdAt?: string | null;
}

export interface Contact {
  id: string;
  nombre: string;
  apellido: string;
  rol: 'estudiante' | 'profesor';
  contexto: string;
}
