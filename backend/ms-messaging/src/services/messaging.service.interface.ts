import type { Conversation, ConversationListEntry, ConversationParticipant, Message, CreateConversation, SendMessage } from '../types/messaging.types.js';

export interface IMessagingService {
  getOrCreateConversation(data: CreateConversation): Promise<Conversation>;
  listConversations(userId: string): Promise<ConversationListEntry[]>;
  getParticipants(conversationId: number): Promise<ConversationParticipant[]>;
  sendMessage(data: SendMessage): Promise<Message>;
  getMessages(conversationId: number): Promise<Message[]>;
  markAsRead(conversationId: number, userId: string): Promise<void>;
}
