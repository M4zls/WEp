export interface SchoolClass {
  id: number;
  courseSubjectId: number;
  title: string;
  description?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt?: string | null;
}

export interface CreateClassDto {
  courseSubjectId: number;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  status?: string;
}

export interface UpdateClassDto {
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
}

export const CLASS_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;
