import { getDatabaseInstance } from '../models/data.js';
import { students } from '../models/schema.js';
import { eq } from 'drizzle-orm';
import type { IStudent } from '../types/student.js';
import type { IStudentsRepository } from './students.repository.interface.js';

export class StudentsRepository implements IStudentsRepository {
    private db = getDatabaseInstance();

    async getAllStudents(): Promise<IStudent[]> {
        const resultado = await this.db.select().from(students);
        return resultado;
    }

    async findStudentByRut(rut: string): Promise<IStudent | null> {
        const resultado = await this.db
            .select()
            .from(students)
            .where(eq(students.rut, rut));

        return resultado.length > 0 ? resultado[0] : null;
    }

    async findStudentByEmail(email: string): Promise<IStudent | null> {
        const resultado = await this.db
            .select()
            .from(students)
            .where(eq(students.email, email));

        return resultado.length > 0 ? resultado[0] : null;
    }

    async createStudent(datos: IStudent): Promise<void> {
        await this.db.insert(students).values({
            rut: datos.rut,
            dv: datos.dv,
            name: datos.name,
            lastName: datos.lastName,
            courses: datos.courses,
            email: datos.email,
            password: datos.password,
            phone: datos.phone,
            guardian: datos.guardian,
        });
    }

    async updateStudent(rut: string, datos: Partial<IStudent>): Promise<void> {
        await this.db
            .update(students)
            .set(datos)
            .where(eq(students.rut, rut));
    }

    async deleteStudent(rut: string): Promise<void> {
        await this.db
            .delete(students)
            .where(eq(students.rut, rut));
    }

    async findStudentsByCourse(curso: string): Promise<IStudent[]> {
        const resultado = await this.db
            .select()
            .from(students)
            .where(eq(students.courses, curso));

        return resultado;
    }
}
