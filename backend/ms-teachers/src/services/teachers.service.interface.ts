import type { ITeacher } from '../types/teacher.js';

export interface ITeachersService {
    getAllTeachers(): Promise<ITeacher[]>;
    getTeacherByRut(rut: string): Promise<ITeacher | null>;
    authenticateTeacher(email: string, password: string): Promise<Omit<ITeacher, 'password'>>;
    createTeacher(datos: ITeacher): Promise<void>;
    updateTeacher(rut: string, datos: Partial<ITeacher>): Promise<void>;
    deleteTeacher(rut: string): Promise<void>;
}
