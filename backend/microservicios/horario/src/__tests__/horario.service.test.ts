import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  findAll: mock(() => undefined),
  findById: mock(() => undefined),
  findByCursoAsignaturaAndDia: mock(() => undefined),
  create: mock(() => undefined),
  update: mock(() => undefined),
  delete: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/HorariosRepository.js', () => ({
  HorariosRepository: function () { return mockRepo; },
}));

const { HorariosService } = await import('../services/HorariosService.js');

describe('HorariosService', () => {
  let service: HorariosService;

  beforeEach(() => {
    service = new HorariosService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  describe('listarHorarios', () => {
    it('debe retornar todos los horarios sin filtro', async () => {
      mockRepo.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      const result = await service.listarHorarios();
      expect(result).toHaveLength(2);
      expect(mockRepo.findAll).toHaveBeenCalledWith(undefined);
    });

    it('debe retornar horarios filtrados por curso_asignatura', async () => {
      mockRepo.findAll.mockResolvedValue([{ id: 1, cursoAsignaturaId: 1 }]);
      const result = await service.listarHorarios(1);
      expect(result).toHaveLength(1);
      expect(mockRepo.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('obtenerHorario', () => {
    it('debe retornar un horario existente', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1, diaSemana: 1 });
      const result = await service.obtenerHorario(1);
      expect(result.id).toBe(1);
    });

    it('debe lanzar error si el horario no existe', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.obtenerHorario(999)).rejects.toThrow('Horario no encontrado');
    });
  });

  describe('listarPorCursoYDia', () => {
    it('debe retornar horarios filtrados por curso y dia', async () => {
      mockRepo.findByCursoAsignaturaAndDia.mockResolvedValue([{ id: 1 }]);
      const result = await service.listarPorCursoYDia(1, 2);
      expect(result).toHaveLength(1);
      expect(mockRepo.findByCursoAsignaturaAndDia).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('crearHorario', () => {
    it('debe crear un horario exitosamente', async () => {
      const data = { cursoAsignaturaId: 1, diaSemana: 1, horaInicio: '08:00', horaTermino: '08:45' };
      mockRepo.create.mockResolvedValue({ id: 1, ...data });
      const result = await service.crearHorario(data);
      expect(result.id).toBe(1);
      expect(mockRepo.create).toHaveBeenCalledWith(data);
    });
  });

  describe('actualizarHorario', () => {
    it('debe actualizar un horario existente', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1 });
      await service.actualizarHorario(1, { horaInicio: '09:00' });
      expect(mockRepo.update).toHaveBeenCalledWith(1, { horaInicio: '09:00' });
    });

    it('debe lanzar error si el horario no existe', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.actualizarHorario(999, { horaInicio: '09:00' })).rejects.toThrow('Horario no encontrado');
      expect(mockRepo.update).not.toHaveBeenCalled();
    });
  });

  describe('eliminarHorario', () => {
    it('debe eliminar un horario existente', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1 });
      await service.eliminarHorario(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });

    it('debe lanzar error si el horario no existe', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.eliminarHorario(999)).rejects.toThrow('Horario no encontrado');
      expect(mockRepo.delete).not.toHaveBeenCalled();
    });
  });
});
