import type { Attendance, CreateAttendance, UpdateAttendance } from '../types/attendance.types.js';

export interface IAttendanceRepository {
  findByClassId(classId: number): Promise<Attendance[]>;
  findByStudentRut(studentRut: string): Promise<Attendance[]>;
  findByCourseSubjectId(courseSubjectId: number): Promise<Attendance[]>;
  findOne(classId: number, studentRut: string): Promise<Attendance | null>;
  upsert(data: CreateAttendance): Promise<Attendance>;
  update(id: number, data: UpdateAttendance): Promise<void>;
  delete(id: number): Promise<void>;
  deleteByClassId(classId: number): Promise<void>;
}
