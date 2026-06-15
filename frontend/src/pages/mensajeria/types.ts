/** Representa una conversación entre dos o más participantes. */
export interface Conversacion {
  /** ID único de la conversación. */
  id: number;
  /** Datos resumidos del otro participante (para conversaciones 1 a 1). */
  otherParticipant: {
    usuarioId: string;
    usuarioNombre: string;
    usuarioApellido: string;
    usuarioRol: string;
  } | null;
  /** Lista completa de participantes de la conversación. */
  participantes: ConversacionParticipante[];
  /** Último mensaje enviado en la conversación (para vista previa). */
  ultimoMensaje: Mensaje | null;
  /** Cantidad de mensajes no leídos del otro participante. */
  noLeidos: number;
  /** Fecha de creación de la conversación. */
  createdAt?: string | null;
}

/** Participante asociado a una conversación. */
export interface ConversacionParticipante {
  id?: number;
  conversacionId: number;
  usuarioId: string;
  usuarioNombre: string;
  usuarioApellido: string;
  usuarioRol: string;
}

/** Mensaje individual dentro de una conversación. */
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

/** Contacto disponible para iniciar una nueva conversación. */
export interface Contacto {
  /** RUT del contacto (usado como ID único). */
  id: string;
  nombre: string;
  apellido: string;
  rol: 'estudiante' | 'profesor';
  /** Descripción contextual (ej: "Matemáticas - 3°A"). */
  contexto: string;
}
