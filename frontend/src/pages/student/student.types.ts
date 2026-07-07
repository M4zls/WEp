export interface UserData {
  id?: number;
  rut?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  courses?: string;
}

export interface CourseInfo {
  id: number;
  name: string;
  level: string;
  letter: string;
  subjects: {
    id: number;
    subjectName: string;
    subjectCode?: string;
    professorFirstName: string;
    professorLastName?: string;
  }[];
}
