import type { Schedule, CreateSchedule, UpdateSchedule } from '../types/schedule.types.js';

export interface IScheduleService {
  listHorarios(courseSubjectId?: number): Promise<Schedule[]>;
  getSchedule(id: number): Promise<Schedule>;
  listByCourseSubjectAndDay(courseSubjectId: number, weekDay: number): Promise<Schedule[]>;
  createSchedule(data: CreateSchedule): Promise<Schedule>;
  updateSchedule(id: number, data: UpdateSchedule): Promise<void>;
  deleteSchedule(id: number): Promise<void>;
}
