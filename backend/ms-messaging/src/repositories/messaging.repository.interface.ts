import type { Conversation, ConversationListEntry, ConversationParticipant, Message } from '../types/messaging.types.js';

export interface IMessagingRepository {
  createConversation(): Promise<Conversation>;
  addParticipant(data: Omit<ConversationParticipant, 'id'>): Promise<void>;
  findConversationByParticipants(participantIds: string[]): Promise<Conversation | null>;
  listConversations(userId: string): Promise<ConversationListEntry[]>;
  getParticipants(conversationId: number): Promise<ConversationParticipant[]>;
  sendMessage(data: Omit<Message, 'id' | 'read' | 'createdAt'>): Promise<Message>;
  getMessages(conversationId: number): Promise<Message[]>;
  markAsRead(conversationId: number, userId: string): Promise<void>;
}
