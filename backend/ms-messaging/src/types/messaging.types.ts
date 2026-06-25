/** Representa una conversación en la base de datos. */
export interface Conversation {
  id?: number;
  createdAt?: string | null;
}

/** Representa un participante asociado a una conversación. */
export interface ConversationParticipant {
  id?: number;
  conversationId: number;
  userId: string;
  userName: string;
  userLastName: string;
  userRole: string;
}

/** Representa un mensaje dentro de una conversación. */
export interface Message {
  id?: number;
  conversationId: number;
  senderId: string;
  senderName: string;
  senderLastName: string;
  senderRole: string;
  content: string;
  read?: boolean | null;
  createdAt?: string | null;
}

/** Datos necesarios para crear una nueva conversación. */
export interface CreateConversation {
  participantIds: string[];
  participantNames: string[];
  participantLastNames: string[];
  participantRoles: string[];
}

/** Datos necesarios para enviar un mensaje. */
export interface SendMessage {
  conversationId: number;
  senderId: string;
  senderName: string;
  senderLastName: string;
  senderRole: string;
  content: string;
}

/** Conversación listada para un usuario, con participante, último mensaje y no leídos. */
export interface ConversationListEntry {
  id: number;
  otherParticipant: ConversationParticipant | undefined;
  ultimoMensaje: Message | null;
  noLeidos: number;
  createdAt: string | null;
  participants?: ConversationParticipant[];
}
