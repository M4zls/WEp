export interface Attendance {
  id: number;
  classId: number;
  courseSubjectId: number;
  studentRut: string;
  studentFirstName: string;
  present: boolean;
  justification?: string | null;
  date?: string | null;
  createdAt?: string | null;
}

export interface MarkAttendanceDto {
  classId: number;
  courseSubjectId: number;
  records: {
    studentRut: string;
    studentFirstName: string;
    present: boolean;
    justification?: string;
  }[];
}
