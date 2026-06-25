import type { ITeacher } from '../types/teacher.js';

export interface ITeachersRepository {
    getAllTeachers(): Promise<ITeacher[]>;
    findTeacherByRut(rut: string): Promise<ITeacher | null>;
    findTeacherByEmail(email: string): Promise<ITeacher | null>;
    createTeacher(datos: ITeacher): Promise<void>;
    updateTeacher(rut: string, datos: Partial<ITeacher>): Promise<void>;
    deleteTeacher(rut: string): Promise<void>;
    findTeacherSubject(materia: string): Promise<string | null>;
}
