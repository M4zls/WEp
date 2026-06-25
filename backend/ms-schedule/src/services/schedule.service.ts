import { ScheduleRepository } from '../repositories/schedule.repository.js';
import type { Schedule, CreateSchedule, UpdateSchedule } from '../types/schedule.types.js';
import type { IScheduleRepository } from '../repositories/schedule.repository.interface.js';
import type { IScheduleService } from './schedule.service.interface.js';
import { SCHEDULE_ERRORS } from '../common/consts.js';

export class ScheduleService implements IScheduleService {
  private repo: IScheduleRepository;
  constructor(repo?: IScheduleRepository) { this.repo = repo ?? new ScheduleRepository(); }

  async listHorarios(courseSubjectId?: number): Promise<Schedule[]> {
    return  this.repo.findAll(courseSubjectId);
  }

  async getSchedule(id: number): Promise<Schedule> {
    const horario = await this.repo.findById(id);
    if (!horario) throw new Error(SCHEDULE_ERRORS.NOT_FOUND);
    return horario;
  }

  async listByCourseSubjectAndDay(courseSubjectId: number, weekDay: number): Promise<Schedule[]> {
    return  this.repo.findByCourseSubjectAndDay(courseSubjectId, weekDay);
  }

  async createSchedule(data: CreateSchedule): Promise<Schedule> {
    return  this.repo.create(data);
  }

  async updateSchedule(id: number, data: UpdateSchedule): Promise<void> {
    const horario = await this.repo.findById(id);
    if (!horario) throw new Error(SCHEDULE_ERRORS.NOT_FOUND);
    await this.repo.update(id, data);
  }

  async deleteSchedule(id: number): Promise<void> {
    const horario = await this.repo.findById(id);
    if (!horario) throw new Error(SCHEDULE_ERRORS.NOT_FOUND);
    await this.repo.delete(id);
  }
}
