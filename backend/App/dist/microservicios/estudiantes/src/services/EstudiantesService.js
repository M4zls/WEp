import { EstudiantesRepository } from '../repositories/EstudiantesRepository.js';
export class EstudiantesService {
    repository;
    constructor() {
        this.repository = new EstudiantesRepository();
    }
    //obtener todos
    async obtenerTodos() {
        return await this.repository.obtenerTodos();
    }
    //obtener por rut
    async obtenerEstudiante(rut) {
        if (!rut || rut.trim() === '') {
            throw new Error('El RUT es requerido');
        }
        const estudiante = await this.repository.obtenerRut(rut);
        if (!estudiante) {
            throw new Error('Estudiante no encontrado');
        }
        return estudiante;
    }
    // Login de estudiante
    async login(email, password) {
        if (!email || email.trim() === '') {
            throw new Error('El email es obligatorio');
        }
        if (!password || password.trim() === '') {
            throw new Error('La contraseña es obligatoria');
        }
        // Buscar estudiante por email
        const estudiante = await this.repository.obtenerPorEmail(email);
        if (!estudiante) {
            throw new Error('Estudiante no encontrado');
        }
        // Validar contraseña (en producción usar bcrypt)
        if (estudiante.password !== password) {
            throw new Error('Contraseña incorrecta');
        }
        // Retornar datos del estudiante sin la contraseña
        const { password: _, ...estudianteSeguro } = estudiante;
        return estudianteSeguro;
    }
    // crear nueva Con validacion 
    async crearEstudiante(datos) {
        if (!datos.rut || datos.rut.trim() === '') {
            throw new Error('El RUT es obligatorio');
        }
        //validar digito verificador
        if (!datos.dv || datos.dv.trim() === '') {
            throw new Error('El dígito verificador es obligatorio');
        }
        //validar curso
        if (!datos.cursos || datos.cursos.trim() === '') {
            throw new Error('El curso es obligatorio');
        }
        //validar email
        if (!datos.email || datos.email.trim() === '') {
            throw new Error('El email es obligatorio');
        }
        //validar password
        if (!datos.password || datos.password.trim() === '') {
            throw new Error('La contraseña es obligatoria');
        }
        //verificar que no exista un estudiante con el mismo RUT
        const existente = await this.repository.obtenerRut(datos.rut);
        if (existente) {
            throw new Error('Ya existe un estudiante con ese RUT');
        }
        // crear el estudiante
        await this.repository.crear(datos);
    }
    //retornar el estudiante
    async actualizarEstudiante(rut, datos) {
        const estudiante = await this.repository.obtenerRut(rut);
        if (!estudiante) {
            throw new Error('estudiante no encontrado');
        }
        //actualizar
        await this.repository.actualizar(rut, datos);
    }
    //eliminar estudiante
    async eliminarEstudiante(rut) {
        const estudiante = await this.repository.obtenerRut(rut);
        if (!estudiante) {
            throw new Error('estudiante no encontrado');
        }
        await this.repository.eliminar(rut);
    }
    //obtener estudiantes por curso
    async obtenerEstudiantesPorCurso(curso) {
        if (!curso || curso.trim() === '') {
            throw new Error('El curso es obligatorio');
        }
        return await this.repository.obtenerCurso(curso);
    }
}
//# sourceMappingURL=EstudiantesService.js.map