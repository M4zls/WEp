const MS_MESSAGING_SERVICE = process.env.MS_MESSAGING_SERVICE || 'http://localhost:3009';
const MS_NOTIFICATIONS_SERVICE = process.env.MS_NOTIFICATIONS_SERVICE || 'http://localhost:3003';

interface MessageBody {
  remitenteId: string;
  remitenteNombre: string;
  remitenteApellido: string;
  contenido: string;
  conversacionId: string;
}

export class MessagingService {
  async sendMessageNotification(body: MessageBody) {
    try {
      const participantesRes = await fetch(
        `${MS_MESSAGING_SERVICE}/mensajeria/conversaciones/${body.remitenteId}`
      );
      if (participantesRes.ok) {
        const conversaciones: any[] = await participantesRes.json();
        const conv = conversaciones.find((c: any) => c.id === body.conversacionId);
        if (conv && conv.otherParticipant) {
          const dest = conv.otherParticipant;
          fetch(`${MS_NOTIFICATIONS_SERVICE}/notificaciones/aviso-mensaje`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              destinatarioRut: dest.usuarioId,
              destinatarioRol: dest.usuarioRol,
              remitenteNombre: body.remitenteNombre,
              remitenteApellido: body.remitenteApellido,
              contenidoPreview: body.contenido,
              conversacionId: body.conversacionId,
            }),
          }).catch((err: any) => {
            console.error('[mensajes] notification failed:', err.message);
          });
        }
      }
    } catch (err: any) {
      console.error('[mensajes] participant fetch failed:', err.message);
    }
  }
}
