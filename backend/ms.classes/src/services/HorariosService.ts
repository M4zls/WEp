import { HorariosRepository } from '../repositories/HorariosRepository.js';
import type { Horario, CreateHorario, UpdateHorario } from '../types/HorarioTypes.js';
import { CLASE_ERRORS } from '../common/Consts.js';

export class HorariosService {
  private repo = new HorariosRepository();

  async listarHorarios(cursoAsignaturaId?: number): Promise<Horario[]> {
    return await this.repo.findAll(cursoAsignaturaId);
  }

  async obtenerHorario(id: number): Promise<Horario> {
    const horario = await this.repo.findById(id);
    if (!horario) throw new Error('Horario no encontrado');
    return horario;
  }

  async crearHorario(data: CreateHorario): Promise<Horario> {
    return await this.repo.create(data);
  }

  async actualizarHorario(id: number, data: UpdateHorario): Promise<void> {
    const horario = await this.repo.findById(id);
    if (!horario) throw new Error('Horario no encontrado');
    await this.repo.update(id, data);
  }

  async eliminarHorario(id: number): Promise<void> {
    const horario = await this.repo.findById(id);
    if (!horario) throw new Error('Horario no encontrado');
    await this.repo.delete(id);
  }
}
