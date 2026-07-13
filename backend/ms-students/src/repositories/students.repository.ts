import { sql } from '../models/data.js';
import type { IStudent } from '../types/student.js';
import type { IStudentsRepository } from './students.repository.interface.js';

export class StudentsRepository implements IStudentsRepository {
    async getAllStudents(): Promise<IStudent[]> {
        return sql`SELECT id, rut, dv, first_name as "firstName", last_name as "lastName", courses, email, phone, guardian, guardian_email as "guardianEmail", registration_date as "registrationDate" FROM "students"."students" ORDER BY id`;
    }

    async findStudentByRut(rut: string): Promise<IStudent | null> {
        const result = await sql`SELECT id, rut, dv, first_name as "firstName", last_name as "lastName", courses, email, password, phone, guardian, guardian_email as "guardianEmail", registration_date as "registrationDate" FROM "students"."students" WHERE rut = ${rut} LIMIT 1`;
        return result.length > 0 ? result[0] : null;
    }

    async findStudentByEmail(email: string): Promise<IStudent | null> {
        const result = await sql`SELECT id, rut, dv, first_name as "firstName", last_name as "lastName", courses, email, password, phone, guardian, guardian_email as "guardianEmail", registration_date as "registrationDate" FROM "students"."students" WHERE email = ${email} LIMIT 1`;
        return result.length > 0 ? result[0] : null;
    }

    async createStudent(datos: IStudent): Promise<void> {
        await sql`
            INSERT INTO "students"."students" (rut, dv, first_name, last_name, courses, email, password, phone, guardian)
            VALUES (${datos.rut}, ${datos.dv}, ${datos.firstName}, ${datos.lastName}, ${datos.courses}, ${datos.email}, ${datos.password}, ${datos.phone}, ${datos.guardian})
        `;
    }

    async updateStudent(rut: string, datos: Partial<IStudent>): Promise<void> {
        const sets: string[] = [];
        const values: any[] = [];
        let idx = 1;
        if (datos.firstName !== undefined) { sets.push(`first_name = $${idx++}`); values.push(datos.firstName); }
        if (datos.lastName !== undefined) { sets.push(`last_name = $${idx++}`); values.push(datos.lastName); }
        if (datos.courses !== undefined) { sets.push(`courses = $${idx++}`); values.push(datos.courses); }
        if (datos.email !== undefined) { sets.push(`email = $${idx++}`); values.push(datos.email); }
        if (datos.password !== undefined) { sets.push(`password = $${idx++}`); values.push(datos.password); }
        if (datos.phone !== undefined) { sets.push(`phone = $${idx++}`); values.push(datos.phone); }
        if (datos.guardian !== undefined) { sets.push(`guardian = $${idx++}`); values.push(datos.guardian); }
        if (datos.guardianEmail !== undefined) { sets.push(`guardian_email = $${idx++}`); values.push(datos.guardianEmail); }
        if (sets.length === 0) return;
        values.push(rut);
        await sql.unsafe(`UPDATE "students"."students" SET ${sets.join(', ')} WHERE rut = $${idx}`, values);
    }

    async deleteStudent(rut: string): Promise<void> {
        await sql`DELETE FROM "students"."students" WHERE rut = ${rut}`;
    }

    async findStudentsByCourse(curso: string): Promise<IStudent[]> {
        return sql`SELECT id, rut, dv, first_name as "firstName", last_name as "lastName", courses, email, phone, guardian, guardian_email as "guardianEmail", registration_date as "registrationDate" FROM "students"."students" WHERE courses = ${curso} ORDER BY id`;
    }
}
