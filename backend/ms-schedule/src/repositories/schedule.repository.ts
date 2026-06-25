import { eq } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { schedules } from '../models/schema.js';
import type { Schedule, CreateSchedule, UpdateSchedule } from '../types/schedule.types.js';
import type { IScheduleRepository } from './schedule.repository.interface.js';

export class ScheduleRepository implements IScheduleRepository {
  private get db() { return getDatabaseInstance(); }

  async findAll(courseSubjectId?: number): Promise<Schedule[]> {
    if (courseSubjectId) {
      return  this.db.select().from(schedules)
        .where(eq(schedules.courseSubjectId, courseSubjectId))
        .orderBy(schedules.weekDay, schedules.startTime);
    }
    return  this.db.select().from(schedules).orderBy(schedules.weekDay, schedules.startTime);
  }

  async findById(id: number): Promise<Schedule | null> {
    const result = await this.db.select().from(schedules).where(eq(schedules.id, id)).limit(1);
    return result[0] ?? null;
  }

  async findByCourseSubjectAndDay(courseSubjectId: number, weekDay: number): Promise<Schedule[]> {
    return  this.db.select().from(schedules)
      .where(eq(schedules.courseSubjectId, courseSubjectId))
      .where(eq(schedules.weekDay, weekDay))
      .orderBy(schedules.startTime);
  }

  async create(data: CreateSchedule): Promise<Schedule> {
    const result = await this.db.insert(schedules).values(data).returning();
    return result[0];
  }

  async update(id: number, data: UpdateSchedule): Promise<void> {
    await this.db.update(schedules).set(data).where(eq(schedules.id, id));
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(schedules).where(eq(schedules.id, id));
  }
}
