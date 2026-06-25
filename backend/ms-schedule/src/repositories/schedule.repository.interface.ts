import type { Schedule, CreateSchedule, UpdateSchedule } from '../types/schedule.types.js';

export interface IScheduleRepository {
  findAll(courseSubjectId?: number): Promise<Schedule[]>;
  findById(id: number): Promise<Schedule | null>;
  findByCourseSubjectAndDay(courseSubjectId: number, weekDay: number): Promise<Schedule[]>;
  create(data: CreateSchedule): Promise<Schedule>;
  update(id: number, data: UpdateSchedule): Promise<void>;
  delete(id: number): Promise<void>;
}
