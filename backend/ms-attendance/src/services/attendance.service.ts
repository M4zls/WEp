import type { IAttendanceRepository } from '../repositories/attendance.repository.interface.js';
import { AttendanceRepository } from '../repositories/attendance.repository.js';
import type { Attendance, UpdateAttendance, MarkAttendanceBatchDto } from '../types/attendance.types.js';
import type { IAttendanceService } from './attendance.service.interface.js';

export class AttendanceService implements IAttendanceService {
  private repo: IAttendanceRepository;
  constructor(repo?: IAttendanceRepository) { this.repo = repo ?? new AttendanceRepository(); }

  async listByClass(classId: number): Promise<Attendance[]> {
    return  this.repo.findByClassId(classId);
  }

  async listByStudent(studentRut: string): Promise<Attendance[]> {
    return  this.repo.findByStudentRut(studentRut);
  }

  async listByCourseSubject(courseSubjectId: number): Promise<Attendance[]> {
    return  this.repo.findByCourseSubjectId(courseSubjectId);
  }

  async markBatch(data: MarkAttendanceBatchDto): Promise<Attendance[]> {
    const results: Attendance[] = [];
    for (const record of data.records) {
      const result = await this.repo.upsert({
        classId: data.classId,
        courseSubjectId: data.courseSubjectId,
        studentRut: record.studentRut,
        studentName: record.studentName,
        present: record.present,
        justification: record.justification,
      });
      results.push(result);
    }
    return results;
  }

  async update(id: number, data: UpdateAttendance): Promise<void> {
    await this.repo.update(id, data);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
