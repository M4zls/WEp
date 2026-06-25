export type AbsenceAlertDto = {
  subscriberId: string;
  guardianName: string;
  studentName: string;
  course: string;
  date: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type GradeAlertDto = {
  subscriberId: string;
  studentRut: string;
  studentName: string;
  studentEmail: string;
  guardianName?: string;
  guardianEmail?: string;
  subject: string;
  grade: string;
  evaluationType: string;
  professorName: string;
  course: string;
};

export type MessageAlertDto = {
  recipientRut: string;
  recipientRole: 'estudiante' | 'profesor';
  senderName: string;
  senderLastName: string;
  contentPreview: string;
  conversationId: number;
};
