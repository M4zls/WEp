export interface Attendance {
  id?: number;
  classId: number;
  courseSubjectId: number;
  studentRut: string;
  studentName: string;
  present: boolean;
  justification?: string | null;
  fecha?: string | null;
  createdAt?: string | null;
}

export interface CreateAttendance {
  classId: number;
  courseSubjectId: number;
  studentRut: string;
  studentName: string;
  present: boolean;
  justification?: string;
}

export interface UpdateAttendance {
  present?: boolean;
  justification?: string;
}

export interface MarkAttendanceBatchDto {
  classId: number;
  courseSubjectId: number;
  records: {
    studentRut: string;
    studentName: string;
    present: boolean;
    justification?: string;
  }[];
}
