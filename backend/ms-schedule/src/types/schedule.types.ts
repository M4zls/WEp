export interface Schedule {
  id?: number;
  courseSubjectId: number;
  weekDay: number;
  startTime: string;
  endTime: string;
  createdAt?: string | null;
}

export interface CreateSchedule {
  courseSubjectId: number;
  weekDay: number;
  startTime: string;
  endTime: string;
}

export interface UpdateSchedule {
  courseSubjectId?: number;
  weekDay?: number;
  startTime?: string;
  endTime?: string;
}
