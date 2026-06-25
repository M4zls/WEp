import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  findAllCursos: mock(() => undefined),
  findCursoById: mock(() => undefined),
  createCurso: mock(() => undefined),
  updateCurso: mock(() => undefined),
  deleteCurso: mock(() => undefined),
  findAllAsignaturas: mock(() => undefined),
  findAsignaturaById: mock(() => undefined),
  createAsignatura: mock(() => undefined),
  updateAsignatura: mock(() => undefined),
  deleteAsignatura: mock(() => undefined),
  findAsignaturasByCurso: mock(() => undefined),
  assignAsignatura: mock(() => undefined),
  updateCursoAsignatura: mock(() => undefined),
  removeAsignatura: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/CursosRepository.js', () => ({
  CursosRepository: function () { return mockRepo; },
}));

const { CursosService } = await import('../services/CursosService.js');

describe('CursosService', () => {
  let service: CursosService;

  beforeEach(() => {
    service = new CursosService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  it('listarCursos', async () => {
    mockRepo.findAllCursos.mockResolvedValue([{ id: 1 }]);
    expect(await service.listarCursos()).toHaveLength(1);
  });

  it('obtenerCurso', async () => {
    mockRepo.findCursoById.mockResolvedValue({ id: 1 });
    mockRepo.findAsignaturasByCurso.mockResolvedValue([]);
    const r = await service.obtenerCurso(1);
    expect(r).toHaveProperty('materias');
  });

  it('obtenerCurso throws on not found', async () => {
    mockRepo.findCursoById.mockResolvedValue(null);
    await expect(service.obtenerCurso(999)).rejects.toThrow('Curso no encontrado');
  });

  it('crearCurso', async () => {
    mockRepo.findAllCursos.mockResolvedValue([]);
    mockRepo.createCurso.mockResolvedValue({ id: 1 });
    const r = await service.crearCurso({ id: 1, nombre: '1A', nivel: 'Primero', letra: 'A' });
    expect(r).toBeDefined();
  });

  it('crearCurso throws on duplicate', async () => {
    mockRepo.findAllCursos.mockResolvedValue([{ nombre: '1A' }]);
    await expect(service.crearCurso({ id: 2, nombre: '1A', nivel: 'Primero', letra: 'B' })).rejects.toThrow('Ya existe un curso con ese nombre');
  });

  it('actualizarCurso', async () => {
    mockRepo.findCursoById.mockResolvedValue({ id: 1 });
    await service.actualizarCurso(1, { nombre: '1B' });
    expect(mockRepo.updateCurso).toHaveBeenCalled();
  });

  it('eliminarCurso', async () => {
    mockRepo.findCursoById.mockResolvedValue({ id: 1 });
    await service.eliminarCurso(1);
    expect(mockRepo.deleteCurso).toHaveBeenCalled();
  });

  it('listarAsignaturas', async () => {
    mockRepo.findAllAsignaturas.mockResolvedValue([{ id: 1 }]);
    expect(await service.listarAsignaturas()).toHaveLength(1);
  });

  it('crearAsignatura', async () => {
    mockRepo.createAsignatura.mockResolvedValue({ id: 1 });
    expect(await service.crearAsignatura({ nombre: 'Mat', codigo: 'MAT101' })).toBeDefined();
  });

  it('actualizarAsignatura', async () => {
    mockRepo.findAsignaturaById.mockResolvedValue({ id: 1 });
    await service.actualizarAsignatura(1, { nombre: 'Fisica' });
    expect(mockRepo.updateAsignatura).toHaveBeenCalled();
  });

  it('eliminarAsignatura', async () => {
    mockRepo.findAsignaturaById.mockResolvedValue({ id: 1 });
    await service.eliminarAsignatura(1);
    expect(mockRepo.deleteAsignatura).toHaveBeenCalled();
  });

  it('obtenerMateriasDelCurso', async () => {
    mockRepo.findAsignaturasByCurso.mockResolvedValue([{ id: 1 }]);
    expect(await service.obtenerMateriasDelCurso(1)).toHaveLength(1);
  });

  it('asignarMateriaACurso', async () => {
    await service.asignarMateriaACurso({ cursoId: 1, asignaturaId: 1 });
    expect(mockRepo.assignAsignatura).toHaveBeenCalled();
  });

  it('eliminarAsignacion', async () => {
    await service.eliminarAsignacion(1);
    expect(mockRepo.removeAsignatura).toHaveBeenCalled();
  });
});
