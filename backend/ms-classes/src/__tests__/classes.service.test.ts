import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  findAll: mock(() => undefined),
  findById: mock(() => undefined),
  create: mock(() => undefined),
  update: mock(() => undefined),
  delete: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/classes.repository.js', () => ({
  ClassesRepository: function () { return mockRepo; },
}));

const { ClassesService } = await import('../services/classes.service.js');

describe('ClassesService', () => {
  let service: ClassesService;

  beforeEach(() => {
    service = new ClassesService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) mockRepo[key].mockClear();
  });

  it('listClasses', async () => {
    mockRepo.findAll.mockResolvedValue([{ id: 1 }]);
    expect(await service.listClasses()).toHaveLength(1);
  });

  it('listClasses filters by courseSubjectId', async () => {
    await service.listClasses(5);
    expect(mockRepo.findAll).toHaveBeenCalledWith(5);
  });

  it('getClass', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    expect(await service.getClass(1)).toBeDefined();
  });

  it('getClass throws on not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getClass(999)).rejects.toThrow('Clase no encontrada');
  });

  it('createClass', async () => {
    const d = { courseSubjectId: 1, title: 'Nueva Clase', date: '2026-06-10', startTime: '10:00', endTime: '11:00' };
    mockRepo.create.mockResolvedValue({ id: 1 });
    const r = await service.createClass(d);
    expect(r).toBeDefined();
    expect(mockRepo.create).toHaveBeenCalledWith(d);
  });

  it('updateClass', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    await service.updateClass(1, { title: 'Actualizado' });
    expect(mockRepo.update).toHaveBeenCalled();
  });

  it('deleteClass', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    await service.deleteClass(1);
    expect(mockRepo.delete).toHaveBeenCalled();
  });
});
