import type { IStudent } from '../types/student.js';

export interface IStudentsRepository {
    getAllStudents(): Promise<IStudent[]>;
    findStudentByRut(rut: string): Promise<IStudent | null>;
    findStudentByEmail(email: string): Promise<IStudent | null>;
    createStudent(datos: IStudent): Promise<void>;
    updateStudent(rut: string, datos: Partial<IStudent>): Promise<void>;
    deleteStudent(rut: string): Promise<void>;
    findStudentsByCourse(curso: string): Promise<IStudent[]>;
}
