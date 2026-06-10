import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockRepo = vi.hoisted(() => ({
  findAllCursos: vi.fn(),
  findCursoById: vi.fn(),
  createCurso: vi.fn(),
  updateCurso: vi.fn(),
  deleteCurso: vi.fn(),
  findAllAsignaturas: vi.fn(),
  findAsignaturaById: vi.fn(),
  createAsignatura: vi.fn(),
  updateAsignatura: vi.fn(),
  deleteAsignatura: vi.fn(),
  findAsignaturasByCurso: vi.fn(),
  assignAsignatura: vi.fn(),
  updateCursoAsignatura: vi.fn(),
  removeAsignatura: vi.fn(),
}));

vi.mock('../repositories/CursosRepository.js', () => ({
  CursosRepository: function () { return mockRepo; },
}));

import { CursosService } from '../services/CursosService.js';

describe('CursosService', () => {
  let service: CursosService;

  beforeEach(() => {
    service = new CursosService();
    vi.clearAllMocks();
  });

  describe('listarCursos', () => {
    it('should return all cursos', async () => {
      mockRepo.findAllCursos.mockResolvedValue([{ id: 1, nombre: '1A' }]);
      const result = await service.listarCursos();
      expect(result).toHaveLength(1);
    });
  });

  describe('obtenerCurso', () => {
    it('should return curso with materias', async () => {
      mockRepo.findCursoById.mockResolvedValue({ id: 1, nombre: '1A' });
      mockRepo.findAsignaturasByCurso.mockResolvedValue([{ id: 1, asignaturaNombre: 'Matematicas' }]);
      const result = await service.obtenerCurso(1);
      expect(result).toHaveProperty('materias');
    });

    it('should throw on not found', async () => {
      mockRepo.findCursoById.mockResolvedValue(null);
      await expect(service.obtenerCurso(999)).rejects.toThrow('Curso no encontrado');
    });
  });

  describe('crearCurso', () => {
    it('should create curso', async () => {
      mockRepo.findAllCursos.mockResolvedValue([]);
      mockRepo.createCurso.mockResolvedValue({ id: 1, nombre: '1A' });
      const result = await service.crearCurso({ id: 1, nombre: '1A', nivel: 'Primero', letra: 'A' });
      expect(result).toBeDefined();
    });

    it('should throw on duplicate name', async () => {
      mockRepo.findAllCursos.mockResolvedValue([{ nombre: '1A' }]);
      await expect(service.crearCurso({ id: 2, nombre: '1A', nivel: 'Primero', letra: 'B' })).rejects.toThrow('Ya existe un curso con ese nombre');
    });
  });

  describe('actualizarCurso', () => {
    it('should update existing curso', async () => {
      mockRepo.findCursoById.mockResolvedValue({ id: 1 });
      await service.actualizarCurso(1, { nombre: '1B' });
      expect(mockRepo.updateCurso).toHaveBeenCalledWith(1, { nombre: '1B' });
    });

    it('should throw on not found', async () => {
      mockRepo.findCursoById.mockResolvedValue(null);
      await expect(service.actualizarCurso(999, {})).rejects.toThrow('Curso no encontrado');
    });
  });

  describe('eliminarCurso', () => {
    it('should delete existing curso', async () => {
      mockRepo.findCursoById.mockResolvedValue({ id: 1 });
      await service.eliminarCurso(1);
      expect(mockRepo.deleteCurso).toHaveBeenCalledWith(1);
    });

    it('should throw on not found', async () => {
      mockRepo.findCursoById.mockResolvedValue(null);
      await expect(service.eliminarCurso(999)).rejects.toThrow('Curso no encontrado');
    });
  });

  describe('listarAsignaturas', () => {
    it('should return all asignaturas', async () => {
      mockRepo.findAllAsignaturas.mockResolvedValue([{ id: 1, nombre: 'Matematicas' }]);
      const result = await service.listarAsignaturas();
      expect(result).toHaveLength(1);
    });
  });

  describe('crearAsignatura', () => {
    it('should create asignatura', async () => {
      mockRepo.createAsignatura.mockResolvedValue({ id: 1, nombre: 'Matematicas' });
      const result = await service.crearAsignatura({ nombre: 'Matematicas', codigo: 'MAT101' });
      expect(result).toBeDefined();
    });
  });

  describe('actualizarAsignatura', () => {
    it('should update existing asignatura', async () => {
      mockRepo.findAsignaturaById.mockResolvedValue({ id: 1 });
      await service.actualizarAsignatura(1, { nombre: 'Fisica' });
      expect(mockRepo.updateAsignatura).toHaveBeenCalledWith(1, { nombre: 'Fisica' });
    });

    it('should throw on not found', async () => {
      mockRepo.findAsignaturaById.mockResolvedValue(null);
      await expect(service.actualizarAsignatura(999, {})).rejects.toThrow('Asignatura no encontrada');
    });
  });

  describe('eliminarAsignatura', () => {
    it('should delete existing asignatura', async () => {
      mockRepo.findAsignaturaById.mockResolvedValue({ id: 1 });
      await service.eliminarAsignatura(1);
      expect(mockRepo.deleteAsignatura).toHaveBeenCalledWith(1);
    });

    it('should throw on not found', async () => {
      mockRepo.findAsignaturaById.mockResolvedValue(null);
      await expect(service.eliminarAsignatura(999)).rejects.toThrow('Asignatura no encontrada');
    });
  });

  describe('obtenerMateriasDelCurso', () => {
    it('should return materias for curso', async () => {
      mockRepo.findAsignaturasByCurso.mockResolvedValue([{ id: 1, nombre: 'Matematicas' }]);
      const result = await service.obtenerMateriasDelCurso(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('asignarMateriaACurso', () => {
    it('should assign materia to curso', async () => {
      await service.asignarMateriaACurso({ cursoId: 1, asignaturaId: 1 });
      expect(mockRepo.assignAsignatura).toHaveBeenCalled();
    });
  });

  describe('actualizarAsignacion', () => {
    it('should update asignacion', async () => {
      await service.actualizarAsignacion(1, { cursoId: 2 });
      expect(mockRepo.updateCursoAsignatura).toHaveBeenCalledWith(1, { cursoId: 2 });
    });
  });

  describe('eliminarAsignacion', () => {
    it('should remove asignacion', async () => {
      await service.eliminarAsignacion(1);
      expect(mockRepo.removeAsignatura).toHaveBeenCalledWith(1);
    });
  });
});
