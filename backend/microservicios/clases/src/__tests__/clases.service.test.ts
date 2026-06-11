import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  findAll: mock(() => undefined),
  findById: mock(() => undefined),
  create: mock(() => undefined),
  update: mock(() => undefined),
  delete: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/ClasesRepository.js', () => ({
  ClasesRepository: function () { return mockRepo; },
}));

const { ClasesService } = await import('../services/ClasesService.js');

describe('ClasesService', () => {
  let service: ClasesService;

  beforeEach(() => {
    service = new ClasesService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) mockRepo[key].mockClear();
  });

  it('listarClases', async () => {
    mockRepo.findAll.mockResolvedValue([{ id: 1 }]);
    expect(await service.listarClases()).toHaveLength(1);
  });

  it('listarClases filtra por cursoAsignaturaId', async () => {
    await service.listarClases(5);
    expect(mockRepo.findAll).toHaveBeenCalledWith(5);
  });

  it('obtenerClase', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    expect(await service.obtenerClase(1)).toBeDefined();
  });

  it('obtenerClase throws on not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.obtenerClase(999)).rejects.toThrow('Clase no encontrada');
  });

  it('crearClase', async () => {
    const d = { cursoAsignaturaId: 1, titulo: 'Nueva Clase', fecha: '2026-06-10', horaInicio: '10:00', horaTermino: '11:00' };
    mockRepo.create.mockResolvedValue({ id: 1 });
    const r = await service.crearClase(d);
    expect(r).toBeDefined();
    expect(mockRepo.create).toHaveBeenCalledWith(d);
  });

  it('actualizarClase', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    await service.actualizarClase(1, { titulo: 'Actualizado' });
    expect(mockRepo.update).toHaveBeenCalled();
  });

  it('eliminarClase', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    await service.eliminarClase(1);
    expect(mockRepo.delete).toHaveBeenCalled();
  });
});
