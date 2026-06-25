export interface Course {
  id?: number;
  name: string;
  level: string;
  letter: string;
  year?: string | null;
  createdAt?: string | null;
}

export interface Subject {
  id?: number;
  name: string;
  code: string;
  description?: string | null;
  createdAt?: string | null;
}

export interface CourseSubject {
  id?: number;
  courseId: number;
  subjectId: number;
  professorId?: number | null;
  createdAt?: string | null;
}
