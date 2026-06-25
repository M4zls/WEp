import type { Attendance, UpdateAttendance, MarkAttendanceBatchDto } from '../types/attendance.types.js';

export interface IAttendanceService {
  listByClass(classId: number): Promise<Attendance[]>;
  listByStudent(studentRut: string): Promise<Attendance[]>;
  listByCourseSubject(courseSubjectId: number): Promise<Attendance[]>;
  markBatch(data: MarkAttendanceBatchDto): Promise<Attendance[]>;
  update(id: number, data: UpdateAttendance): Promise<void>;
  delete(id: number): Promise<void>;
}
