export interface Class {
  id?: number;
  courseSubjectId: number;
  title: string;
  description?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status?: string | null;
  createdAt?: string | null;
}

export interface CreateClass {
  courseSubjectId: number;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  status?: string;
}

export interface UpdateClass {
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
}
