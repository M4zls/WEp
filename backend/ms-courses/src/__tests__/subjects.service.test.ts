import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  findAll: mock(() => undefined),
  findById: mock(() => undefined),
  create: mock(() => undefined),
  update: mock(() => undefined),
  delete: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/subjects.repository.js', () => ({
  SubjectsRepository: function () { return mockRepo; },
}));

const { SubjectsService } = await import('../services/subjects.service.js');

describe('SubjectsService', () => {
  let service: SubjectsService;

  beforeEach(() => {
    service = new SubjectsService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  it('listSubjects', async () => {
    mockRepo.findAll.mockResolvedValue([{ id: 1 }]);
    expect(await service.listSubjects()).toHaveLength(1);
  });

  it('createSubject', async () => {
    mockRepo.create.mockResolvedValue({ id: 1 });
    expect(await service.createSubject({ name: 'Mat', code: 'MAT101' })).toBeDefined();
  });

  it('updateSubject', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    await service.updateSubject(1, { name: 'Fisica' });
    expect(mockRepo.update).toHaveBeenCalled();
  });

  it('deleteSubject', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    await service.deleteSubject(1);
    expect(mockRepo.delete).toHaveBeenCalled();
  });
});
