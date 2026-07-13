import { eq, and } from 'drizzle-orm';
import { getDatabaseInstance } from '../models/data.js';
import { attendance } from '../models/schema.js';
import type { Attendance, CreateAttendance, UpdateAttendance } from '../types/attendance.types.js';
import type { IAttendanceRepository } from './attendance.repository.interface.js';

export class AttendanceRepository implements IAttendanceRepository {
  private get db() { return getDatabaseInstance(); }

  async findByClassId(classId: number): Promise<Attendance[]> {
    return  this.db.select().from(attendance)
      .where(eq(attendance.classId, classId))
      .orderBy(attendance.studentName);
  }

  async findByStudentRut(studentRut: string): Promise<Attendance[]> {
    return  this.db.select().from(attendance)
      .where(eq(attendance.studentRut, studentRut))
      .orderBy(attendance.date);
  }

  async findByCourseSubjectId(courseSubjectId: number): Promise<Attendance[]> {
    return  this.db.select().from(attendance)
      .where(eq(attendance.courseSubjectId, courseSubjectId))
      .orderBy(attendance.date, attendance.studentName);
  }

  async findOne(classId: number, studentRut: string): Promise<Attendance | null> {
    const result = await this.db.select().from(attendance)
      .where(and(eq(attendance.classId, classId), eq(attendance.studentRut, studentRut)))
      .limit(1);
    return result[0] ?? null;
  }

  async upsert(data: CreateAttendance): Promise<Attendance> {
    const existing = await this.findOne(data.classId, data.studentRut);
    if (existing) {
      await this.db.update(attendance)
        .set({ present: data.present, justification: data.justification })
        .where(eq(attendance.id, existing.id!));
      return { ...existing, ...data };
    }
    const result = await this.db.insert(attendance).values(data).returning();
    return result[0];
  }

  async update(id: number, data: UpdateAttendance): Promise<void> {
    await this.db.update(attendance).set(data).where(eq(attendance.id, id));
  }

  async delete(id: number): Promise<void> {
    await this.db.delete(attendance).where(eq(attendance.id, id));
  }

  async deleteByClassId(classId: number): Promise<void> {
    await this.db.delete(attendance).where(eq(attendance.classId, classId));
  }
}
