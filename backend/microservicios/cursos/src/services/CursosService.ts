import { CursosRepository } from '../repositories/CursosRepository.js';
import type { Curso, Asignatura, CursoAsignatura } from '../types/index.js';

export class CursosService {
  private repo = new CursosRepository();

  async listarCursos() {
    return await this.repo.findAllCursos();
  }

  async obtenerCurso(id: number) {
    const curso = await this.repo.findCursoById(id);
    if (!curso) throw new Error('Curso no encontrado');
    const materias = await this.repo.findAsignaturasByCurso(id);
    return { ...curso, materias };
  }

  async crearCurso(data: Curso) {
    const existentes = await this.repo.findAllCursos();
    const duplicado = existentes.find(c => c.nombre === data.nombre);
    if (duplicado) throw new Error('Ya existe un curso con ese nombre');
    return await this.repo.createCurso(data);
  }

  async actualizarCurso(id: number, data: Partial<Curso>) {
    const curso = await this.repo.findCursoById(id);
    if (!curso) throw new Error('Curso no encontrado');
    await this.repo.updateCurso(id, data);
  }

  async eliminarCurso(id: number) {
    const curso = await this.repo.findCursoById(id);
    if (!curso) throw new Error('Curso no encontrado');
    await this.repo.deleteCurso(id);
  }

  async listarAsignaturas() {
    return await this.repo.findAllAsignaturas();
  }

  async crearAsignatura(data: Asignatura) {
    return await this.repo.createAsignatura(data);
  }

  async actualizarAsignatura(id: number, data: Partial<Asignatura>) {
    const asignatura = await this.repo.findAsignaturaById(id);
    if (!asignatura) throw new Error('Asignatura no encontrada');
    await this.repo.updateAsignatura(id, data);
  }

  async eliminarAsignatura(id: number) {
    const asignatura = await this.repo.findAsignaturaById(id);
    if (!asignatura) throw new Error('Asignatura no encontrada');
    await this.repo.deleteAsignatura(id);
  }

  async obtenerMateriasDelCurso(cursoId: number) {
    return await this.repo.findAsignaturasByCurso(cursoId);
  }

  async asignarMateriaACurso(data: CursoAsignatura) {
    return await this.repo.assignAsignatura(data);
  }

  async actualizarAsignacion(id: number, data: Partial<CursoAsignatura>) {
    await this.repo.updateCursoAsignatura(id, data);
  }

  async eliminarAsignacion(id: number) {
    await this.repo.removeAsignatura(id);
  }
}
