import { AsistenciaRepository } from '../repositories/AsistenciaRepository.js';
import type { Asistencia, UpdateAsistencia, MarcarAsistenciaBatchDto } from '../types/AsistenciaTypes.js';

export class AsistenciaService {
  private repo = new AsistenciaRepository();

  async listarPorClase(claseId: number): Promise<Asistencia[]> {
    return await this.repo.findByClaseId(claseId);
  }

  async listarPorEstudiante(estudianteRut: string): Promise<Asistencia[]> {
    return await this.repo.findByEstudianteRut(estudianteRut);
  }

  async listarPorCursoAsignatura(cursoAsignaturaId: number): Promise<Asistencia[]> {
    return await this.repo.findByCursoAsignaturaId(cursoAsignaturaId);
  }

  async marcarBatch(data: MarcarAsistenciaBatchDto): Promise<Asistencia[]> {
    const results: Asistencia[] = [];
    for (const registro of data.registros) {
      const result = await this.repo.upsert({
        claseId: data.claseId,
        cursoAsignaturaId: data.cursoAsignaturaId,
        estudianteRut: registro.estudianteRut,
        estudianteNombre: registro.estudianteNombre,
        presente: registro.presente,
        justificacion: registro.justificacion,
      });
      results.push(result);
    }
    return results;
  }

  async actualizar(id: number, data: UpdateAsistencia): Promise<void> {
    await this.repo.update(id, data);
  }

  async eliminar(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
