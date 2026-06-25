import type { IStudent } from '../types/student.js';

export interface IStudentsService {
    getAllStudents(): Promise<IStudent[]>;
    getStudentByRut(rut: string): Promise<IStudent | null>;
    authenticateStudent(email: string, password: string): Promise<{ estudiante: Omit<IStudent, 'password'>; token: string }>;
    createStudent(datos: IStudent): Promise<void>;
    updateStudent(rut: string, datos: Partial<IStudent>): Promise<void>;
    deleteStudent(rut: string): Promise<void>;
    getStudentsByCourse(curso: string): Promise<IStudent[]>;
}
