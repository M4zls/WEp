import type { ITeachersRepository } from "../repositories/teachers.repository.interface.js";
import { TeachersRepository } from "../repositories/teachers.repository.js";
import type { ITeacher } from "../types/teacher.js";
import type { ITeachersService } from "./teachers.service.interface.js";
import { PROFESSOR_ERRORS } from "../common/consts.js";
import { hashPassword, comparePassword } from "../common/utils.js";

export class TeachersService implements ITeachersService {
    private repo: ITeachersRepository;

    constructor(repo?: ITeachersRepository) {
        this.repo = repo ?? new TeachersRepository();
    }

    async getAllTeachers(): Promise<ITeacher[]> {
        return this.repo.getAllTeachers();
    }

    async getTeacherById(id: number): Promise<ITeacher> {
        const profesor = await this.repo.findTeacherById(id);
        if (!profesor) throw new Error(PROFESSOR_ERRORS.NOT_FOUND);
        return profesor;
    }

    async getTeacherByRut(rut: string): Promise<ITeacher | null> {
        const profesor = await this.repo.findTeacherByRut(rut);
        if (!profesor) {
            throw new Error(PROFESSOR_ERRORS.NOT_FOUND);
        }
        return profesor;
    }

    async authenticateTeacher(email: string, password: string): Promise<Omit<ITeacher, 'password'>> {
        const profesor = await this.repo.findTeacherByEmail(email);
        if (!profesor) {
            throw new Error(PROFESSOR_ERRORS.NOT_FOUND);
        }

        const match = await comparePassword(password, profesor.password);
        if (!match) {
            throw new Error('Invalid password');
        }

        const { password: _, ...profesorSeguro } = profesor;
        return profesorSeguro;
    }

    async createTeacher(datos: ITeacher): Promise<void> {
        await this.repo.createTeacher({ ...datos, password: await hashPassword(datos.password) });
    }

    async updateTeacher(rut: string, datos: Partial<ITeacher>): Promise<void> {
        if (datos.password) {
            datos.password = await hashPassword(datos.password);
        }
        await this.repo.updateTeacher(rut, datos);
    }

    async deleteTeacher(rut: string): Promise<void> {
        await this.repo.deleteTeacher(rut);
    }
    
}    
