export interface CourseInfo {
  id: number;
  name: string;
  level: string;
  letter: string;
  subjects: { id: number; subjectName: string; subjectCode?: string; students: number }[];
}

export interface FlatSubject {
  id: number;
  subjectName: string;
  subjectCode?: string;
  courseName: string;
  courseId: number;
  students: number;
}
