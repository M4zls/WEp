import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRepo = vi.hoisted(() => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('../repositories/HorariosRepository.js', () => ({
  HorariosRepository: function () { return mockRepo; },
}));

import { HorariosService } from '../services/HorariosService.js';

describe('HorariosService', () => {
  let service: HorariosService;

  beforeEach(() => {
    service = new HorariosService();
    vi.clearAllMocks();
  });

  describe('listarHorarios', () => {
    it('should return all horarios', async () => {
      mockRepo.findAll.mockResolvedValue([{ id: 1, diaSemana: 1 }]);
      const result = await service.listarHorarios();
      expect(result).toHaveLength(1);
    });

    it('should filter by cursoAsignaturaId', async () => {
      mockRepo.findAll.mockResolvedValue([{ id: 1, cursoAsignaturaId: 5 }]);
      const result = await service.listarHorarios(5);
      expect(mockRepo.findAll).toHaveBeenCalledWith(5);
    });
  });

  describe('obtenerHorario', () => {
    it('should return horario by id', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1, diaSemana: 1 });
      const result = await service.obtenerHorario(1);
      expect(result).toBeDefined();
    });

    it('should throw on not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.obtenerHorario(999)).rejects.toThrow('Horario no encontrado');
    });
  });

  describe('crearHorario', () => {
    it('should create horario', async () => {
      mockRepo.create.mockResolvedValue({ id: 1, diaSemana: 1, horaInicio: '08:00', horaTermino: '09:00' });
      const data = { cursoAsignaturaId: 1, diaSemana: 1, horaInicio: '08:00', horaTermino: '09:00' };
      const result = await service.crearHorario(data);
      expect(result).toBeDefined();
    });
  });

  describe('actualizarHorario', () => {
    it('should update existing horario', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1 });
      await service.actualizarHorario(1, { diaSemana: 3 });
      expect(mockRepo.update).toHaveBeenCalledWith(1, { diaSemana: 3 });
    });

    it('should throw on not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.actualizarHorario(999, {})).rejects.toThrow('Horario no encontrado');
    });
  });

  describe('eliminarHorario', () => {
    it('should delete existing horario', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1 });
      await service.eliminarHorario(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw on not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.eliminarHorario(999)).rejects.toThrow('Horario no encontrado');
    });
  });
});
