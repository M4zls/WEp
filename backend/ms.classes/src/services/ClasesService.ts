import { ClasesRepository } from '../repositories/ClasesRepository.js';
import type { Clase, CreateClase, UpdateClase } from '../types/ClaseTypes.js';
import { CLASE_ERRORS } from '../common/Consts.js';

export class ClasesService {
  private repo = new ClasesRepository();

  async listarClases(cursoAsignaturaId?: number): Promise<Clase[]> {
    return await this.repo.findAll(cursoAsignaturaId);
  }

  async obtenerClase(id: number): Promise<Clase> {
    const clase = await this.repo.findById(id);
    if (!clase) throw new Error(CLASE_ERRORS.NOT_FOUND);
    return clase;
  }

  async crearClase(data: CreateClase): Promise<Clase> {
    return await this.repo.create(data);
  }

  async actualizarClase(id: number, data: UpdateClase): Promise<void> {
    const clase = await this.repo.findById(id);
    if (!clase) throw new Error(CLASE_ERRORS.NOT_FOUND);
    await this.repo.update(id, data);
  }

  async eliminarClase(id: number): Promise<void> {
    const clase = await this.repo.findById(id);
    if (!clase) throw new Error(CLASE_ERRORS.NOT_FOUND);
    await this.repo.delete(id);
  }
}
