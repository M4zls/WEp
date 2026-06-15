import { and, desc, eq, not, or } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { conversaciones, mensajes, conversacionParticipantes } from '../models/schema.js';
import type { Conversacion, ConversacionParticipante, Mensaje, CreateConversacion, SendMensaje } from '../types/MensajeriaTypes.js';

/** Repositorio de mensajería. Encapsula todas las consultas a la base de datos. */
export class MensajeriaRepository {
  private get db() { return getDatabaseInstance(); }

  /** Crea una nueva conversación vacía y devuelve el registro insertado. */
  async crearConversacion(): Promise<Conversacion> {
    const result = await this.db.insert(conversaciones).values({}).returning();
    return result[0];
  }

  /** Agrega un participante a una conversación. */
  async agregarParticipante(data: Omit<ConversacionParticipante, 'id'>): Promise<void> {
    await this.db.insert(conversacionParticipantes).values(data);
  }

  /**
   * Busca una conversación existente entre los participantes dados.
   * Compara agrupando por conversación para determinar si exactamente los mismos usuarios
   * ya comparten una conversación.
   */
  async findConversacionByParticipantes(participanteIds: string[]): Promise<Conversacion | null> {
    const participants = await this.db.select().from(conversacionParticipantes)
      .where(
        or(
          ...participanteIds.map((id) => eq(conversacionParticipantes.usuarioId, id as string))
        )
      );

    if (participants.length < participanteIds.length) return null;

    const grouped = new Map<number, number>();
    for (const p of participants) {
      grouped.set(p.conversacionId, (grouped.get(p.conversacionId) || 0) + 1);
    }

    for (const [convId, count] of grouped) {
      if (count === participanteIds.length) {
        const result = await this.db.select().from(conversaciones).where(eq(conversaciones.id, convId)).limit(1);
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
  async listarConversaciones(usuarioId: string): Promise<any[]> {
    const userConvs = await this.db.select()
      .from(conversacionParticipantes)
      .where(eq(conversacionParticipantes.usuarioId, usuarioId));

    if (userConvs.length === 0) return [];

    const convIds = userConvs.map((c) => c.conversacionId);

    const allParticipants = await this.db.select()
      .from(conversacionParticipantes)
      .where(
        or(...convIds.map((id) => eq(conversacionParticipantes.conversacionId, id as number)))
      );

    const ultimosMensajes = await Promise.all(
      convIds.map(async (convId) => {
        const msgs = await this.db.select()
          .from(mensajes)
          .where(eq(mensajes.conversacionId, convId))
          .orderBy(desc(mensajes.createdAt))
          .limit(1);
        return msgs[0] ?? null;
      })
    );

    const noLeidos = await Promise.all(
      convIds.map(async (convId) => {
        const result = await this.db.select()
          .from(mensajes)
          .where(
            and(
              eq(mensajes.conversacionId, convId),
              eq(mensajes.leido, false),
              not(eq(mensajes.remitenteId, usuarioId))
            )
          );
        return result.length;
      })
    );

    return convIds.map((convId, i) => ({
      id: convId,
      otherParticipant: allParticipants.find((p) => p.usuarioId !== usuarioId),
      ultimoMensaje: ultimosMensajes[i],
      noLeidos: noLeidos[i],
      createdAt: userConvs.find((c) => c.conversacionId === convId) ? null : null,
    }));
  }

  /** Obtiene todos los participantes de una conversación. */
  async obtenerParticipantes(conversacionId: number): Promise<ConversacionParticipante[]> {
    return await this.db.select()
      .from(conversacionParticipantes)
      .where(eq(conversacionParticipantes.conversacionId, conversacionId));
  }

  /** Inserta un nuevo mensaje en la base de datos y lo devuelve. */
  async enviarMensaje(data: Omit<Mensaje, 'id' | 'leido' | 'createdAt'>): Promise<Mensaje> {
    const result = await this.db.insert(mensajes).values(data as any).returning();
    return result[0];
  }

  /** Obtiene todos los mensajes de una conversación ordenados por fecha ascendente. */
  async obtenerMensajes(conversacionId: number): Promise<Mensaje[]> {
    return await this.db.select()
      .from(mensajes)
      .where(eq(mensajes.conversacionId, conversacionId))
      .orderBy(mensajes.createdAt);
  }

  /**
   * Marca como leídos los mensajes de otros participantes en una conversación.
   * Solo se marcan mensajes cuyo remitente NO sea el usuario que está leyendo.
   */
  async marcarLeidos(conversacionId: number, usuarioId: string): Promise<void> {
    await this.db.update(mensajes)
      .set({ leido: true })
      .where(
        and(
          eq(mensajes.conversacionId, conversacionId),
          not(eq(mensajes.remitenteId, usuarioId)),
          eq(mensajes.leido, false)
        )
      );
  }
}
