import { MensajeriaRepository } from '../repositories/MensajeriaRepository.js';
import type { Conversacion, Mensaje, CreateConversacion, SendMensaje } from '../types/MensajeriaTypes.js';
import { MENSAJERIA_ERRORS } from '../common/Consts.js';

/** Servicio de mensajería. Orquesta la lógica de negocio entre controladores y repositorio. */
export class MensajeriaService {
  private repo = new MensajeriaRepository();

  /**
   * Crea una nueva conversación o devuelve una existente si ya hay una con los mismos participantes.
   * @param data - Arreglos paralelos de IDs, nombres, apellidos y roles de los participantes.
   * @returns La conversación creada o encontrada.
   */
  async crearObtenerConversacion(data: CreateConversacion): Promise<Conversacion> {
    const existing = await this.repo.findConversacionByParticipantes(data.participanteIds);
    if (existing) return existing;

    const conv = await this.repo.crearConversacion();

    for (let i = 0; i < data.participanteIds.length; i++) {
      await this.repo.agregarParticipante({
        conversacionId: conv.id!,
        usuarioId: data.participanteIds[i],
        usuarioNombre: data.participanteNombres[i],
        usuarioApellido: data.participanteApellidos[i],
        usuarioRol: data.participanteRoles[i],
      });
    }

    return conv;
  }

  /** Lista todas las conversaciones en las que participa un usuario. */
  async listarConversaciones(usuarioId: string): Promise<any[]> {
    return await this.repo.listarConversaciones(usuarioId);
  }

  /** Obtiene los participantes de una conversación. */
  async obtenerParticipantes(conversacionId: number) {
    return await this.repo.obtenerParticipantes(conversacionId);
  }

  /** Persiste un nuevo mensaje en la base de datos. */
  async enviarMensaje(data: SendMensaje): Promise<Mensaje> {
    return await this.repo.enviarMensaje({
      conversacionId: data.conversacionId,
      remitenteId: data.remitenteId,
      remitenteNombre: data.remitenteNombre,
      remitenteApellido: data.remitenteApellido,
      remitenteRol: data.remitenteRol,
      contenido: data.contenido,
    });
  }

  /** Obtiene todos los mensajes de una conversación ordenados cronológicamente. */
  async obtenerMensajes(conversacionId: number): Promise<Mensaje[]> {
    return await this.repo.obtenerMensajes(conversacionId);
  }

  /**
   * Marca como leídos los mensajes de una conversación que fueron enviados por otros participantes.
   * @param conversacionId - ID de la conversación.
   * @param usuarioId - ID del usuario que está leyendo (sus propios mensajes no se marcan).
   */
  async marcarLeidos(conversacionId: number, usuarioId: string): Promise<void> {
    await this.repo.marcarLeidos(conversacionId, usuarioId);
  }
}
