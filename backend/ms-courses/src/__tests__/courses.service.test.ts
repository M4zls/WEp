import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  findAll: mock(() => undefined),
  findById: mock(() => undefined),
  create: mock(() => undefined),
  update: mock(() => undefined),
  delete: mock(() => undefined),
};

const mockCSRepo = {
  findByCourse: mock(() => undefined),
  assign: mock(() => undefined),
  update: mock(() => undefined),
  remove: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/courses.repository.js', () => ({
  CoursesRepository: function () { return mockRepo; },
}));
mock.module('../repositories/course-subjects.repository.js', () => ({
  CourseSubjectsRepository: function () { return mockCSRepo; },
}));

const { CoursesService } = await import('../services/courses.service.js');

describe('CoursesService', () => {
  let service: CoursesService;

  beforeEach(() => {
    service = new CoursesService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
    for (const key of Object.keys(mockCSRepo) as (keyof typeof mockCSRepo)[]) {
      mockCSRepo[key].mockClear();
    }
  });

  it('listCourses', async () => {
    mockRepo.findAll.mockResolvedValue([{ id: 1 }]);
    expect(await service.listCourses()).toHaveLength(1);
  });

  it('getCourse', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    mockCSRepo.findByCourse.mockResolvedValue([]);
    const r = await service.getCourse(1);
    expect(r).toHaveProperty('subjects');
  });

  it('getCourse throws on not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.getCourse(999)).rejects.toThrow('Curso no encontrado');
  });

  it('createCourse', async () => {
    mockRepo.findAll.mockResolvedValue([]);
    mockRepo.create.mockResolvedValue({ id: 1 });
    const r = await service.createCourse({ id: 1, name: '1A', level: 'Primero', letter: 'A' });
    expect(r).toBeDefined();
  });

  it('createCourse throws on duplicate', async () => {
    mockRepo.findAll.mockResolvedValue([{ name: '1A' }]);
    await expect(service.createCourse({ id: 2, name: '1A', level: 'Primero', letter: 'B' })).rejects.toThrow('Ya existe un curso con ese nombre');
  });

  it('updateCourse', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    await service.updateCourse(1, { name: '1B' });
    expect(mockRepo.update).toHaveBeenCalled();
  });

  it('deleteCourse', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    await service.deleteCourse(1);
    expect(mockRepo.delete).toHaveBeenCalled();
  });
});
