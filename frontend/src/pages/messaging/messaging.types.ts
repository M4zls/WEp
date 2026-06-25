export interface OtherParticipant {
  usuarioId: string;
  usuarioNombre: string;
  usuarioApellido: string;
  usuarioRol: string;
}

export interface Conversation {
  id: number;
  otherParticipant: OtherParticipant | null;
  participantes: ConversationParticipant[];
  ultimoMensaje: Message | null;
  noLeidos: number;
  createdAt?: string | null;
}

export interface ConversationParticipant {
  id?: number;
  conversacionId: number;
  usuarioId: string;
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
  contenido: string;
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
