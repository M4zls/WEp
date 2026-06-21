import { HorariosRepository } from '../repositories/HorariosRepository.js';
import type { Horario, CreateHorario, UpdateHorario } from '../types/HorarioTypes.js';
import { HORARIO_ERRORS } from '../common/Consts.js';

export class HorariosService {
  private repo = new HorariosRepository();

  async listarHorarios(cursoAsignaturaId?: number): Promise<Horario[]> {
    return await this.repo.findAll(cursoAsignaturaId);
  }

  async obtenerHorario(id: number): Promise<Horario> {
    const horario = await this.repo.findById(id);
    if (!horario) throw new Error(HORARIO_ERRORS.NOT_FOUND);
    return horario;
  }

  async listarPorCursoYDia(cursoAsignaturaId: number, diaSemana: number): Promise<Horario[]> {
    return await this.repo.findByCursoAsignaturaAndDia(cursoAsignaturaId, diaSemana);
  }

  async crearHorario(data: CreateHorario): Promise<Horario> {
    return await this.repo.create(data);
  }

  async actualizarHorario(id: number, data: UpdateHorario): Promise<void> {
    const horario = await this.repo.findById(id);
    if (!horario) throw new Error(HORARIO_ERRORS.NOT_FOUND);
    await this.repo.update(id, data);
  }

  async eliminarHorario(id: number): Promise<void> {
    const horario = await this.repo.findById(id);
    if (!horario) throw new Error(HORARIO_ERRORS.NOT_FOUND);
    await this.repo.delete(id);
  }
}
