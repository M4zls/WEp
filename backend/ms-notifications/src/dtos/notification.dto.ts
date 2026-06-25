import { z } from 'zod';

export const absenceAlertSchema = z.object({
  subscriberId: z.string().min(1),
  guardianName: z.string().optional(),
  studentName: z.string().min(1),
  studentRut: z.string().optional(),
  course: z.string().min(1),
  date: z.string().min(1),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
});

export type AbsenceAlertDto = z.infer<typeof absenceAlertSchema>;

export const gradeAlertSchema = z.object({
  subscriberId: z.string().min(1),
  studentRut: z.string().min(1),
  studentName: z.string().min(1),
  studentEmail: z.string().email(),
  guardianName: z.string().optional(),
  guardianEmail: z.string().email().optional(),
  subject: z.string().min(1),
  grade: z.string().min(1),
  evaluationType: z.string().min(1),
  professorName: z.string().min(1),
  course: z.string().min(1),
});

export type GradeAlertDto = z.infer<typeof gradeAlertSchema>;

export const messageAlertSchema = z.object({
  recipientRut: z.string().min(1),
  recipientRole: z.enum(['estudiante', 'profesor']),
  senderName: z.string().min(1),
  senderLastName: z.string().min(1),
  contentPreview: z.string().min(1),
  conversationId: z.number(),
});

export type MessageAlertDto = z.infer<typeof messageAlertSchema>;
