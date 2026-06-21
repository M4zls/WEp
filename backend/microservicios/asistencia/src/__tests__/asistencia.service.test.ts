import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  findByClaseId: mock(() => undefined),
  findByEstudianteRut: mock(() => undefined),
  findByCursoAsignaturaId: mock(() => undefined),
  upsert: mock(() => undefined),
  update: mock(() => undefined),
  delete: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/AsistenciaRepository.js', () => ({
  AsistenciaRepository: function () { return mockRepo; },
}));

const { AsistenciaService } = await import('../services/AsistenciaService.js');

describe('AsistenciaService', () => {
  let service: AsistenciaService;

  beforeEach(() => {
    service = new AsistenciaService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  describe('listarPorClase', () => {
    it('debe retornar asistencias filtradas por clase', async () => {
      mockRepo.findByClaseId.mockResolvedValue([{ id: 1, claseId: 1 }]);
      const result = await service.listarPorClase(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('listarPorEstudiante', () => {
    it('debe retornar asistencias filtradas por RUT de estudiante', async () => {
      mockRepo.findByEstudianteRut.mockResolvedValue([{ id: 1, estudianteRut: '12345678' }]);
      const result = await service.listarPorEstudiante('12345678');
      expect(result).toHaveLength(1);
    });
  });

  describe('listarPorCursoAsignatura', () => {
    it('debe retornar asistencias filtradas por curso_asignatura', async () => {
      mockRepo.findByCursoAsignaturaId.mockResolvedValue([{ id: 1, cursoAsignaturaId: 1 }]);
      const result = await service.listarPorCursoAsignatura(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('marcarBatch', () => {
    const data = {
      claseId: 1,
      cursoAsignaturaId: 1,
      registros: [
        { estudianteRut: '12345678', estudianteNombre: 'Juan Perez', presente: true },
        { estudianteRut: '87654321', estudianteNombre: 'Maria Lopez', presente: false, justificacion: 'Enfermo' },
      ],
    };

    it('debe marcar asistencia para todos los estudiantes', async () => {
      mockRepo.upsert.mockResolvedValue({ id: 1 });
      const result = await service.marcarBatch(data);
      expect(result).toHaveLength(2);
      expect(mockRepo.upsert).toHaveBeenCalledTimes(2);
      expect(mockRepo.upsert).toHaveBeenCalledWith({
        claseId: 1,
        cursoAsignaturaId: 1,
        estudianteRut: '12345678',
        estudianteNombre: 'Juan Perez',
        presente: true,
        justificacion: undefined,
      });
      expect(mockRepo.upsert).toHaveBeenCalledWith({
        claseId: 1,
        cursoAsignaturaId: 1,
        estudianteRut: '87654321',
        estudianteNombre: 'Maria Lopez',
        presente: false,
        justificacion: 'Enfermo',
      });
    });
  });

  describe('actualizar', () => {
    it('debe actualizar un registro de asistencia', async () => {
      await service.actualizar(1, { presente: true });
      expect(mockRepo.update).toHaveBeenCalledWith(1, { presente: true });
    });
  });

  describe('eliminar', () => {
    it('debe eliminar un registro de asistencia', async () => {
      await service.eliminar(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});
