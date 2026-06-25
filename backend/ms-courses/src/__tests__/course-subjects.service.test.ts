import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  findByCourse: mock(() => undefined),
  assign: mock(() => undefined),
  update: mock(() => undefined),
  remove: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/course-subjects.repository.js', () => ({
  CourseSubjectsRepository: function () { return mockRepo; },
}));

const { CourseSubjectsService } = await import('../services/course-subjects.service.js');

describe('CourseSubjectsService', () => {
  let service: CourseSubjectsService;

  beforeEach(() => {
    service = new CourseSubjectsService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  it('getSubjectsByCourse', async () => {
    mockRepo.findByCourse.mockResolvedValue([{ id: 1 }]);
    expect(await service.getSubjectsByCourse(1)).toHaveLength(1);
  });

  it('assignSubject', async () => {
    mockRepo.assign.mockResolvedValue({ id: 1 });
    expect(await service.assignSubject({ courseId: 1, subjectId: 1 })).toBeDefined();
  });

  it('updateAssignment', async () => {
    await service.updateAssignment(1, { professorId: 2 });
    expect(mockRepo.update).toHaveBeenCalled();
  });

  it('deleteAssignment', async () => {
    await service.deleteAssignment(1);
    expect(mockRepo.remove).toHaveBeenCalled();
  });
});
