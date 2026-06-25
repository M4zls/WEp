/** Representa una conversación en la base de datos. */
export interface Conversacion {
  id?: number;
  createdAt?: string | null;
}

/** Representa un participante asociado a una conversación. */
export interface ConversacionParticipante {
  id?: number;
  conversacionId: number;
  usuarioId: string;
  usuarioNombre: string;
  usuarioApellido: string;
  usuarioRol: string;
}

/** Representa un mensaje dentro de una conversación. */
export interface Mensaje {
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

/** Datos necesarios para crear una nueva conversación. */
export interface CreateConversacion {
  participanteIds: string[];
  participanteNombres: string[];
  participanteApellidos: string[];
  participanteRoles: string[];
}

/** Datos necesarios para enviar un mensaje. */
export interface SendMensaje {
  conversacionId: number;
  remitenteId: string;
  remitenteNombre: string;
  remitenteApellido: string;
  remitenteRol: string;
  contenido: string;
}
