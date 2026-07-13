export interface Schedule {
  id: number;
  courseSubjectId: number;
  weekDay: number;
  startTime: string;
  endTime: string;
  createdAt?: string | null;
}

export interface CreateScheduleDto {
  courseSubjectId: number;
  weekDay: number;
  startTime: string;
  endTime: string;
}

export interface UpdateScheduleDto {
  weekDay?: number;
  startTime?: string;
  endTime?: string;
}

export const WEEK_DAYS: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
};
