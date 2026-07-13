import { sign } from 'hono/jwt';
import type { IStudentsRepository } from '../repositories/students.repository.interface.js';
import { StudentsRepository } from '../repositories/students.repository.js';
import type { IStudent } from '../types/student.js';
import type { IStudentsService } from './students.service.interface.js';
import { STUDENT_ERRORS, JWT_SECRET, JWT_EXPIRES_IN } from '../common/consts.js';
import { hashPassword, comparePassword } from '../common/utils.js';

export class StudentsService implements IStudentsService {
    private repository: IStudentsRepository;

    constructor(repository?: IStudentsRepository) {
        this.repository = repository ?? new StudentsRepository();
    }

    async getAllStudents(): Promise<IStudent[]> {
        return this.repository.getAllStudents();
    }

    async getStudentByRut(rut: string): Promise<IStudent | null> {
        const estudiante = await this.repository.findStudentByRut(rut);
        if (!estudiante) {
            throw new Error(STUDENT_ERRORS.NOT_FOUND);
        }
        return estudiante;
    }

    async authenticateStudent(email: string, password: string): Promise<{ estudiante: Omit<IStudent, 'password'>; token: string }> {
        const estudiante = await this.repository.findStudentByEmail(email);
        if (!estudiante) {
            throw new Error(STUDENT_ERRORS.NOT_FOUND);
        }

        const match = await comparePassword(password, estudiante.password);
        if (!match) {
            throw new Error('Contraseña incorrecta');
        }

        const token = await sign(
            { sub: estudiante.rut, email: estudiante.email, rut: estudiante.rut, role: 'student', exp: Math.floor(Date.now() / 1000) + JWT_EXPIRES_IN },
            JWT_SECRET,
        );

        const { password: _, ...estudianteSeguro } = estudiante;
        return { estudiante: estudianteSeguro, token };
    }

    async createStudent(datos: IStudent): Promise<void> {
        const existente = await this.repository.findStudentByRut(datos.rut);
        if (existente) {
            throw new Error(STUDENT_ERRORS.DUPLICATE_RUT);
        }

        await this.repository.createStudent({ ...datos, password: await hashPassword(datos.password) });
    }

    async updateStudent(rut: string, datos: Partial<IStudent>): Promise<void> {
        const estudiante = await this.repository.findStudentByRut(rut);
        if (!estudiante) {
            throw new Error(STUDENT_ERRORS.NOT_FOUND);
        }

        if (datos.password) {
            datos.password = await hashPassword(datos.password);
        }
        await this.repository.updateStudent(rut, datos);
    }

    async deleteStudent(rut: string): Promise<void> {
        const estudiante = await this.repository.findStudentByRut(rut);
        if (!estudiante) {
            throw new Error(STUDENT_ERRORS.NOT_FOUND);
        }

        await this.repository.deleteStudent(rut);
    }

    async getStudentsByCourse(curso: string): Promise<IStudent[]> {
        return this.repository.findStudentsByCourse(curso);
    }
}
