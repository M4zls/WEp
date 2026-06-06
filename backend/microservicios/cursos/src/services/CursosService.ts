import { CursosRepository } from '../repositories/CursosRepository.js';
import type { Curso, Asignatura, CursoAsignatura } from '../types/CursoTypes.js';

export class CursosService {
  private repo = new CursosRepository();

  /**
   * Lista todos los cursos.
   * @returns {Promise<Curso[]>} Arreglo de cursos.
   */
  async listarCursos(): Promise<Curso[]> {
    return await this.repo.findAllCursos();
  }

  /**
   * Obtiene un curso por su ID junto con sus materias.
   * @param {number} id - ID del curso.
   * @returns {Promise<Curso & { materias: Asignatura[] }>} Curso con sus materias.
   */
  async obtenerCurso(id: number): Promise<Curso & { materias: Asignatura[] }> {
    const curso = await this.repo.findCursoById(id);
    if (!curso) throw new Error('Curso no encontrado');
    const materias = await this.repo.findAsignaturasByCurso(id);
    return { ...curso, materias };
  }

  /**
   * Crea un nuevo curso.
   * @param {Curso} data - Datos del curso a crear.
   * @returns {Promise<any>} Resultado de la creación.
   */
  async crearCurso(data: Curso): Promise<any> {
    const existentes = await this.repo.findAllCursos();
    const duplicado = existentes.find(c => c.nombre === data.nombre);
    if (duplicado) throw new Error('Ya existe un curso con ese nombre');
    return await this.repo.createCurso(data);
  }

  /**
   * Actualiza los datos de un curso.
   * @param {number} id - ID del curso a actualizar.
   * @param {Partial<Curso>} data - Campos a actualizar.
   * @returns {Promise<void>} Resuelve cuando la actualización finaliza.
   */
  async actualizarCurso(id: number, data: Partial<Curso>): Promise<void> {
    const curso = await this.repo.findCursoById(id);
    if (!curso) throw new Error('Curso no encontrado');
    await this.repo.updateCurso(id, data);
  }

  /**
   * Elimina un curso por su ID.
   * @param {number} id - ID del curso a eliminar.
   * @returns {Promise<void>} Resuelve cuando el curso es eliminado.
   */
  async eliminarCurso(id: number): Promise<void> {
    const curso = await this.repo.findCursoById(id);
    if (!curso) throw new Error('Curso no encontrado');
    await this.repo.deleteCurso(id);
  }

  /**
   * Lista todas las asignaturas.
   * @returns {Promise<Asignatura[]>} Arreglo de asignaturas.
   */
  async listarAsignaturas(): Promise<Asignatura[]> {
    return await this.repo.findAllAsignaturas();
  }

  /**
   * Crea una asignatura.
   * @param {Asignatura} data - Datos de la asignatura a crear.
   * @returns {Promise<any>} Resultado de la creación.
   */
  async crearAsignatura(data: Asignatura): Promise<any> {
    return await this.repo.createAsignatura(data);
  }

  /**
   * Actualiza una asignatura por ID.
   * @param {number} id - ID de la asignatura.
   * @param {Partial<Asignatura>} data - Campos a actualizar.
   * @returns {Promise<void>} Resuelve cuando la actualización finaliza.
   */
  async actualizarAsignatura(id: number, data: Partial<Asignatura>): Promise<void> {
    const asignatura = await this.repo.findAsignaturaById(id);
    if (!asignatura) throw new Error('Asignatura no encontrada');
    await this.repo.updateAsignatura(id, data);
  }

  /**
   * Elimina una asignatura por ID.
   * @param {number} id - ID de la asignatura.
   * @returns {Promise<void>} Resuelve cuando la asignatura es eliminada.
   */
  async eliminarAsignatura(id: number): Promise<void> {
    const asignatura = await this.repo.findAsignaturaById(id);
    if (!asignatura) throw new Error('Asignatura no encontrada');
    await this.repo.deleteAsignatura(id);
  }

  /**
   * Obtiene las materias de un curso.
   * @param {number} cursoId - ID del curso.
   * @returns {Promise<Asignatura[]>} Lista de asignaturas del curso.
   */
  async obtenerMateriasDelCurso(cursoId: number): Promise<Asignatura[]> {
    return await this.repo.findAsignaturasByCurso(cursoId);
  }

  /**
   * Asigna una materia a un curso.
   * @param {CursoAsignatura} data - Datos de la asignación.
   * @returns {Promise<any>} Resultado de la asignación.
   */
  async asignarMateriaACurso(data: CursoAsignatura): Promise<any> {
    return await this.repo.assignAsignatura(data);
  }

  /**
   * Actualiza una asignación de materia a curso.
   * @param {number} id - ID de la asignación.
   * @param {Partial<CursoAsignatura>} data - Campos a actualizar.
   * @returns {Promise<void>} Resuelve cuando la actualización finaliza.
   */
  async actualizarAsignacion(id: number, data: Partial<CursoAsignatura>): Promise<void> {
    await this.repo.updateCursoAsignatura(id, data);
  }

  /**
   * Elimina una asignación de materia a curso.
   * @param {number} id - ID de la asignación a eliminar.
   * @returns {Promise<void>} Resuelve cuando la asignación es eliminada.
   */
  async eliminarAsignacion(id: number): Promise<void> {
    await this.repo.removeAsignatura(id);
  }
}
