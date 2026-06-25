import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  findByClassId: mock(() => undefined),
  findByStudentRut: mock(() => undefined),
  findByCourseSubjectId: mock(() => undefined),
  upsert: mock(() => undefined),
  update: mock(() => undefined),
  delete: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/attendance.repository.js', () => ({
  AttendanceRepository: function () { return mockRepo; },
}));

const { AttendanceService } = await import('../services/attendance.service.js');

describe('AttendanceService', () => {
  let service: AttendanceService;

  beforeEach(() => {
    service = new AttendanceService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  describe('listByClass', () => {
    it('should return attendance filtered by class', async () => {
      mockRepo.findByClassId.mockResolvedValue([{ id: 1, classId: 1 }]);
      const result = await service.listByClass(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('listByStudent', () => {
    it('should return attendance filtered by student RUT', async () => {
      mockRepo.findByStudentRut.mockResolvedValue([{ id: 1, studentRut: '12345678' }]);
      const result = await service.listByStudent('12345678');
      expect(result).toHaveLength(1);
    });
  });

  describe('listByCourseSubject', () => {
    it('should return attendance filtered by course_subject', async () => {
      mockRepo.findByCourseSubjectId.mockResolvedValue([{ id: 1, courseSubjectId: 1 }]);
      const result = await service.listByCourseSubject(1);
      expect(result).toHaveLength(1);
    });
  });

  describe('markBatch', () => {
    const data = {
      classId: 1,
      courseSubjectId: 1,
      records: [
        { studentRut: '12345678', studentName: 'Juan Perez', present: true },
        { studentRut: '87654321', studentName: 'Maria Lopez', present: false, justification: 'Enfermo' },
      ],
    };

    it('should mark attendance for all students', async () => {
      mockRepo.upsert.mockResolvedValue({ id: 1 });
      const result = await service.markBatch(data);
      expect(result).toHaveLength(2);
      expect(mockRepo.upsert).toHaveBeenCalledTimes(2);
      expect(mockRepo.upsert).toHaveBeenCalledWith({
        classId: 1,
        courseSubjectId: 1,
        studentRut: '12345678',
        studentName: 'Juan Perez',
        present: true,
        justification: undefined,
      });
      expect(mockRepo.upsert).toHaveBeenCalledWith({
        classId: 1,
        courseSubjectId: 1,
        studentRut: '87654321',
        studentName: 'Maria Lopez',
        present: false,
        justification: 'Enfermo',
      });
    });
  });

  describe('update', () => {
    it('should update an attendance record', async () => {
      await service.update(1, { present: true });
      expect(mockRepo.update).toHaveBeenCalledWith(1, { present: true });
    });
  });

  describe('delete', () => {
    it('should delete an attendance record', async () => {
      await service.delete(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });
  });
});
