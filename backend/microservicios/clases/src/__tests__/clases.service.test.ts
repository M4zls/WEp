import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRepo = vi.hoisted(() => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock('../repositories/ClasesRepository.js', () => ({
  ClasesRepository: function () { return mockRepo; },
}));

import { ClasesService } from '../services/ClasesService.js';

describe('ClasesService', () => {
  let service: ClasesService;

  beforeEach(() => {
    service = new ClasesService();
    vi.clearAllMocks();
  });

  describe('listarClases', () => {
    it('should return all clases', async () => {
      mockRepo.findAll.mockResolvedValue([{ id: 1, titulo: 'Clase 1' }]);
      const result = await service.listarClases();
      expect(result).toHaveLength(1);
    });

    it('should filter by cursoAsignaturaId', async () => {
      mockRepo.findAll.mockResolvedValue([{ id: 1, cursoAsignaturaId: 5 }]);
      const result = await service.listarClases(5);
      expect(mockRepo.findAll).toHaveBeenCalledWith(5);
    });
  });

  describe('obtenerClase', () => {
    it('should return clase by id', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1, titulo: 'Clase 1' });
      const result = await service.obtenerClase(1);
      expect(result).toBeDefined();
    });

    it('should throw on not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.obtenerClase(999)).rejects.toThrow('Clase no encontrada');
    });
  });

  describe('crearClase', () => {
    it('should create clase', async () => {
      mockRepo.create.mockResolvedValue({ id: 1, titulo: 'Nueva Clase' });
      const data = { cursoAsignaturaId: 1, titulo: 'Nueva Clase', fecha: '2026-06-10', horaInicio: '10:00', horaTermino: '11:00' };
      const result = await service.crearClase(data);
      expect(result).toBeDefined();
      expect(mockRepo.create).toHaveBeenCalledWith(data);
    });
  });

  describe('actualizarClase', () => {
    it('should update existing clase', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1 });
      await service.actualizarClase(1, { titulo: 'Actualizado' });
      expect(mockRepo.update).toHaveBeenCalledWith(1, { titulo: 'Actualizado' });
    });

    it('should throw on not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.actualizarClase(999, {})).rejects.toThrow('Clase no encontrada');
    });
  });

  describe('eliminarClase', () => {
    it('should delete existing clase', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1 });
      await service.eliminarClase(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw on not found', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.eliminarClase(999)).rejects.toThrow('Clase no encontrada');
    });
  });
});
