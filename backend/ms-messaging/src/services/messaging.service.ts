import { MessagingRepository } from '../repositories/messaging.repository.js';
import type { IMessagingRepository } from '../repositories/messaging.repository.interface.js';
import type { IMessagingService } from './messaging.service.interface.js';
import type { Conversation, ConversationListEntry, Message, CreateConversation, SendMessage } from '../types/messaging.types.js';
import { MENSAJERIA_ERRORS } from '../common/consts.js';

/** Servicio de mensajería. Orquesta la lógica de negocio entre controladores y repositorio. */
export class MessagingService implements IMessagingService {
  private repo: IMessagingRepository;
  constructor(repo?: IMessagingRepository) { this.repo = repo ?? new MessagingRepository(); }

  /**
   * Crea una nueva conversación o devuelve una existente si ya hay una con los mismos participantes.
   * @param data - Arreglos paralelos de IDs, nombres, apellidos y roles de los participantes.
   * @returns La conversación creada o encontrada.
   */
  async getOrCreateConversation(data: CreateConversation): Promise<Conversation> {
    const existing = await this.repo.findConversationByParticipants(data.participantIds);
    if (existing) return existing;

    const conv = await this.repo.createConversation();

    for (let i = 0; i < data.participantIds.length; i++) {
      await this.repo.addParticipant({
        conversationId: conv.id!,
        userId: data.participantIds[i],
        userName: data.participantNames[i],
        userLastName: data.participantLastNames[i],
        userRole: data.participantRoles[i],
      });
    }

    return conv;
  }

  /** Lista todas las conversaciones en las que participa un usuario, incluyendo participantes. */
  async listConversations(userId: string): Promise<ConversationListEntry[]> {
    const conversations = await this.repo.listConversations(userId);
    return Promise.all(
      conversations.map(async (conv) => {
        const participants = await this.repo.getParticipants(conv.id);
        return { ...conv, participants };
      })
    );
  }

  /** Obtiene los participantes de una conversación. */
  async getParticipants(conversationId: number) {
    return this.repo.getParticipants(conversationId);
  }

  /** Persiste un nuevo mensaje en la base de datos. */
  async sendMessage(data: SendMessage): Promise<Message> {
    return this.repo.sendMessage({
      conversationId: data.conversationId,
      senderId: data.senderId,
      senderName: data.senderName,
      senderLastName: data.senderLastName,
      senderRole: data.senderRole,
      content: data.content,
    });
  }

  /** Obtiene todos los mensajes de una conversación ordenados cronológicamente. */
  async getMessages(conversationId: number): Promise<Message[]> {
    return this.repo.getMessages(conversationId);
  }

  /**
   * Marca como leídos los mensajes de una conversación que fueron enviados por otros participantes.
   * @param conversationId - ID de la conversación.
   * @param userId - ID del usuario que está leyendo (sus propios mensajes no se marcan).
   */
  async markAsRead(conversationId: number, userId: string): Promise<void> {
    await this.repo.markAsRead(conversationId, userId);
  }
}
