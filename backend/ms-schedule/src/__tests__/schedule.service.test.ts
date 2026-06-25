import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  findAll: mock(() => undefined),
  findById: mock(() => undefined),
  findByCourseSubjectAndDay: mock(() => undefined),
  create: mock(() => undefined),
  update: mock(() => undefined),
  delete: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/schedule.repository.js', () => ({
  ScheduleRepository: function () { return mockRepo; },
}));

const { ScheduleService } = await import('../services/schedule.service.js');

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(() => {
    service = new ScheduleService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) {
      mockRepo[key].mockClear();
    }
  });

  describe('listHorarios', () => {
    it('should return all schedules without filter', async () => {
      mockRepo.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      const result = await service.listHorarios();
      expect(result).toHaveLength(2);
      expect(mockRepo.findAll).toHaveBeenCalledWith(undefined);
    });

    it('should return schedules filtered by course_subject', async () => {
      mockRepo.findAll.mockResolvedValue([{ id: 1, courseSubjectId: 1 }]);
      const result = await service.listHorarios(1);
      expect(result).toHaveLength(1);
      expect(mockRepo.findAll).toHaveBeenCalledWith(1);
    });
  });

  describe('getSchedule', () => {
    it('should return an existing schedule', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1, weekDay: 1 });
      const result = await service.getSchedule(1);
      expect(result.id).toBe(1);
    });

    it('should throw if schedule does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.getSchedule(999)).rejects.toThrow('Horario no encontrado');
    });
  });

  describe('listByCourseSubjectAndDay', () => {
    it('should return schedules filtered by course and day', async () => {
      mockRepo.findByCourseSubjectAndDay.mockResolvedValue([{ id: 1 }]);
      const result = await service.listByCourseSubjectAndDay(1, 2);
      expect(result).toHaveLength(1);
      expect(mockRepo.findByCourseSubjectAndDay).toHaveBeenCalledWith(1, 2);
    });
  });

  describe('createSchedule', () => {
    it('should create a schedule successfully', async () => {
      const data = { courseSubjectId: 1, weekDay: 1, startTime: '08:00', endTime: '08:45' };
      mockRepo.create.mockResolvedValue({ id: 1, ...data });
      const result = await service.createSchedule(data);
      expect(result.id).toBe(1);
      expect(mockRepo.create).toHaveBeenCalledWith(data);
    });
  });

  describe('updateSchedule', () => {
    it('should update an existing schedule', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1 });
      await service.updateSchedule(1, { startTime: '09:00' });
      expect(mockRepo.update).toHaveBeenCalledWith(1, { startTime: '09:00' });
    });

    it('should throw if schedule does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.updateSchedule(999, { startTime: '09:00' })).rejects.toThrow('Horario no encontrado');
      expect(mockRepo.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteSchedule', () => {
    it('should delete an existing schedule', async () => {
      mockRepo.findById.mockResolvedValue({ id: 1 });
      await service.deleteSchedule(1);
      expect(mockRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw if schedule does not exist', async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.deleteSchedule(999)).rejects.toThrow('Horario no encontrado');
      expect(mockRepo.delete).not.toHaveBeenCalled();
    });
  });
});
