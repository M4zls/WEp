import { ProfesoresRepository, type IProfesor } from "../repositories/ProfesoresRepository.js";

export class ProfesoresService {
    private repository: ProfesoresRepository;

    constructor() {
        this.repository = new ProfesoresRepository();
    }

    async obtenerTodos(): Promise<IProfesor[]> {
        return await this.repository.obtenerTodos();
    }
    async obtenerProfesor(rut: string): Promise<IProfesor | null> {
        if (!rut || rut.trim() === '') {
            throw new Error('El RUT es requerido');
        }
        const profesor = await this.repository.obtenerRut(rut);
        if (!profesor) {
            throw new Error('Profesor no encontrado');
        }
        return profesor;
    }
    // Login de profesor
    async login(email: string, password:string): Promise<IProfesor | null> {
        if (!email || email.trim() === ''){
            throw new Error('El email es obligatorio');
        }
        if (!password || password.trim() === '') {
            throw new Error('La contraseña es obligatoria');
        }
        // Buscar profesor por email
        const profesor = await this.repository.obtenerPorEmail(email);
        if (!profesor) {
            throw new Error('Profesor no encontrado');
        }
        // Validar contraseña 
        if (profesor.password !== password) {
            throw new Error('Contraseña incorrecta');
        }
        // Retornar datos del profesor sin la contraseña
        const { password: _, ...profesorSeguro } = profesor as any;
        return profesorSeguro as IProfesor;
    }
    // crear nuevo profesor con validacion
    async crearProfesor(datos: IProfesor): Promise<void> {
        if (!datos.rut || datos.rut.trim() === '') {
            throw new Error('El RUT es obligatorio');
        }
        //validar digito verificador
        if (!datos.dv || datos.dv.trim() === '') {
            throw new Error('El dígito verificador es obligatorio');
        }
        if (!datos.nombre || datos.nombre.trim() === '') {
            throw new Error('El nombre es obligatorio');
        }
        if (!datos.email || datos.email.trim() === '') {
            throw new Error('El email es obligatorio');
        }
        if (!datos.password || datos.password.trim() === '') {
            throw new Error('La contraseña es obligatoria');
        }
        await this.repository.crear(datos);
    }
    async actualizarProfesor(rut: string, datos: Partial<IProfesor>): Promise<void> {
        if (!rut || rut.trim() === '') {
            throw new Error('El RUT es requerido');
        }
        //actualiza
        await this.repository.actualizar(rut, datos);
    }
    async eliminarProfesor(rut: string): Promise<void> {
        if (!rut || rut.trim() === '') {
            throw new Error('El RUT es requerido');
        }
        await this.repository.eliminar(rut);
    }
    
}    
