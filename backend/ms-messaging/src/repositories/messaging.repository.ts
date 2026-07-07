import { and, desc, eq, not, or, inArray, count } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { conversations, messages, conversationParticipants } from '../models/schema.js';
import type { Conversation, ConversationListEntry, ConversationParticipant, Message } from '../types/messaging.types.js';
import type { IMessagingRepository } from './messaging.repository.interface.js';

/** Repositorio de mensajería. Encapsula todas las consultas a la base de datos. */
export class MessagingRepository implements IMessagingRepository {
  private get db() { return getDatabaseInstance(); }

  /** Crea una nueva conversación vacía y devuelve el registro insertado. */
  async createConversation(): Promise<Conversation> {
    const result = await this.db.insert(conversations).values({}).returning();
    return result[0];
  }

  /** Agrega un participante a una conversación. */
  async addParticipant(data: Omit<ConversationParticipant, 'id'>): Promise<void> {
    await this.db.insert(conversationParticipants).values(data);
  }

  /**
   * Busca una conversación existente entre los participantes dados.
   * Compara agrupando por conversación para determinar si exactamente los mismos usuarios
   * ya comparten una conversación.
   */
  async findConversationByParticipants(participantIds: string[]): Promise<Conversation | null> {
    const participants = await this.db.select().from(conversationParticipants)
      .where(
        or(
          ...participantIds.map((id) => eq(conversationParticipants.userId, id as string))
        )
      );

    if (participants.length < participantIds.length) return null;

    const grouped = new Map<number, number>();
    for (const p of participants) {
      grouped.set(p.conversationId, (grouped.get(p.conversationId) || 0) + 1);
    }

    for (const [convId, count] of grouped) {
      if (count === participantIds.length) {
        const result = await this.db.select().from(conversations).where(eq(conversations.id, convId)).limit(1);
        return result[0] ?? null;
      }
    }
    return null;
  }

  /**
   * Lista las conversaciones de un usuario con:
   * - El otro participante (para conversaciones 1 a 1).
   * - El último mensaje (más reciente).
   * - La cantidad de mensajes no leídos del otro participante.
   */
  async listConversations(userId: string): Promise<ConversationListEntry[]> {
    const userConvs = await this.db.select()
      .from(conversationParticipants)
      .where(eq(conversationParticipants.userId, userId));

    if (userConvs.length === 0) return [];

    const convIds = userConvs.map((c) => c.conversationId);

    const allParticipants = await this.db.select()
      .from(conversationParticipants)
      .where(inArray(conversationParticipants.conversationId, convIds));

    const lastMsgRows = await this.db.select()
      .from(messages)
      .where(inArray(messages.conversationId, convIds))
      .orderBy(desc(messages.createdAt));

    const lastMsgMap = new Map<number, Message>();
    for (const msg of lastMsgRows) {
      if (!lastMsgMap.has(msg.conversationId)) {
        lastMsgMap.set(msg.conversationId, msg);
      }
    }

    const unreadRows = await this.db.select({
      conversationId: messages.conversationId,
      count: count(),
    })
      .from(messages)
      .where(
        and(
          inArray(messages.conversationId, convIds),
          eq(messages.read, false),
          not(eq(messages.senderId, userId))
        )
      )
      .groupBy(messages.conversationId);

    const unreadMap = new Map(unreadRows.map((r) => [r.conversationId, r.count]));

    return convIds.map((convId) => ({
      id: convId,
      otherParticipant: allParticipants.find((p) => p.conversationId === convId && p.userId !== userId),
      lastMessage: lastMsgMap.get(convId) ?? null,
      unreadCount: unreadMap.get(convId) ?? 0,
      createdAt: userConvs.find((c) => c.conversationId === convId)?.createdAt ?? null,
    }));
  }

  /** Obtiene todos los participantes de una conversación. */
  async getParticipants(conversationId: number): Promise<ConversationParticipant[]> {
    return  this.db.select()
      .from(conversationParticipants)
      .where(eq(conversationParticipants.conversationId, conversationId));
  }

  /** Inserta un nuevo mensaje en la base de datos y lo devuelve. */
  async sendMessage(data: Omit<Message, 'id' | 'read' | 'createdAt'>): Promise<Message> {
    const result = await this.db.insert(messages).values(data as any).returning();
    return result[0];
  }

  /** Obtiene todos los mensajes de una conversación ordenados por fecha ascendente. */
  async getMessages(conversationId: number): Promise<Message[]> {
    return  this.db.select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(messages.createdAt);
  }

  /**
   * Marca como leídos los mensajes de otros participantes en una conversación.
   * Solo se marcan mensajes cuyo remitente NO sea el usuario que está leyendo.
   */
  async markAsRead(conversationId: number, userId: string): Promise<void> {
    await this.db.update(messages)
      .set({ read: true })
      .where(
        and(
          eq(messages.conversationId, conversationId),
          not(eq(messages.senderId, userId)),
          eq(messages.read, false)
        )
      );
  }
}
