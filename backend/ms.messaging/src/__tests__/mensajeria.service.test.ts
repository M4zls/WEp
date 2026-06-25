import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  crearConversacion: mock(() => undefined),
  agregarParticipante: mock(() => undefined),
  findConversacionByParticipantes: mock(() => undefined),
  listarConversaciones: mock(() => undefined),
  obtenerParticipantes: mock(() => undefined),
  enviarMensaje: mock(() => undefined),
  obtenerMensajes: mock(() => undefined),
  marcarLeidos: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/MensajeriaRepository.js', () => ({
  MensajeriaRepository: function () { return mockRepo; },
}));

const { MensajeriaService } = await import('../services/MensajeriaService.js');

describe('MensajeriaService', () => {
  let service: MensajeriaService;

  beforeEach(() => {
    service = new MensajeriaService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  describe('crearObtenerConversacion', () => {
    const data = {
      participanteIds: ['1', '2'],
      participanteNombres: ['Juan', 'Maria'],
      participanteApellidos: ['Perez', 'Lopez'],
      participanteRoles: ['profesor', 'apoderado'],
    };

    it('debe devolver conversacion existente si ya existe', async () => {
      mockRepo.findConversacionByParticipantes.mockResolvedValue({ id: 1 });
      const result = await service.crearObtenerConversacion(data);
      expect(result).toEqual({ id: 1 });
      expect(mockRepo.crearConversacion).not.toHaveBeenCalled();
    });

    it('debe crear nueva conversacion si no existe', async () => {
      mockRepo.findConversacionByParticipantes.mockResolvedValue(null);
      mockRepo.crearConversacion.mockResolvedValue({ id: 5 });
      const result = await service.crearObtenerConversacion(data);
      expect(result).toEqual({ id: 5 });
      expect(mockRepo.crearConversacion).toHaveBeenCalled();
      expect(mockRepo.agregarParticipante).toHaveBeenCalledTimes(2);
    });
  });

  describe('listarConversaciones', () => {
    it('debe retornar conversaciones del usuario', async () => {
      mockRepo.listarConversaciones.mockResolvedValue([{ id: 1 }]);
      const result = await service.listarConversaciones('1');
      expect(result).toHaveLength(1);
    });
  });

  describe('obtenerParticipantes', () => {
    it('debe retornar participantes de una conversacion', async () => {
      mockRepo.obtenerParticipantes.mockResolvedValue([{ usuarioId: '1' }]);
      const result = await service.obtenerParticipantes(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('enviarMensaje', () => {
    const data = {
      conversacionId: 1,
      remitenteId: '1',
      remitenteNombre: 'Juan',
      remitenteApellido: 'Perez',
      remitenteRol: 'profesor',
      contenido: 'Hola',
    };

    it('debe enviar un mensaje exitosamente', async () => {
      mockRepo.enviarMensaje.mockResolvedValue({ id: 1, ...data, leido: false });
      const result = await service.enviarMensaje(data);
      expect(result.id).toBe(1);
      expect(mockRepo.enviarMensaje).toHaveBeenCalledWith({
        conversacionId: 1,
        remitenteId: '1',
        remitenteNombre: 'Juan',
        remitenteApellido: 'Perez',
        remitenteRol: 'profesor',
        contenido: 'Hola',
      });
    });
  });

  describe('obtenerMensajes', () => {
    it('debe retornar mensajes de una conversacion', async () => {
      mockRepo.obtenerMensajes.mockResolvedValue([{ id: 1, contenido: 'Hola' }]);
      const result = await service.obtenerMensajes(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('marcarLeidos', () => {
    it('debe marcar mensajes como leidos', async () => {
      await service.marcarLeidos(1, '1');
      expect(mockRepo.marcarLeidos).toHaveBeenCalledWith(1, '1');
    });
  });
});
