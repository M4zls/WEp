export interface UserData {
  id?: number;
  rut?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
}

export interface CourseInfo {
  id: number;
  name: string;
  level: string;
  letter: string;
  subjects: { id: number; subjectName: string; subjectCode?: string; students: number }[];
}
