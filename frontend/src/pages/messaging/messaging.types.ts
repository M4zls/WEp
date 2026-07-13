export interface OtherParticipant {
  userId: string;
  userFirstName: string;
  userLastName: string;
  userRole: string;
}

export interface Conversation {
  id: number;
  otherParticipant: OtherParticipant | null;
  participants: ConversationParticipant[];
  lastMessage: Message | null;
  unreadCount: number;
  createdAt?: string | null;
}

export interface ConversationParticipant {
  id?: number;
  conversationId: number;
  userId: string;
  userFirstName: string;
  userLastName: string;
  userRole: string;
}

export interface Message {
  id?: number;
  conversationId: number;
  senderId: string;
  senderFirstName: string;
  senderLastName: string;
  senderRole: string;
  content: string;
  read?: boolean | null;
  createdAt?: string | null;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'professor';
  context: string;
}
