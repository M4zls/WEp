import { describe, it, expect, mock, beforeEach } from 'bun:test';

const mockRepo = {
  findAll: mock(() => undefined),
  findById: mock(() => undefined),
  create: mock(() => undefined),
  update: mock(() => undefined),
  delete: mock(() => undefined),
};

mock.module('../models/data.js', () => ({ getDatabaseInstance: () => ({}) }));
mock.module('../repositories/HorariosRepository.js', () => ({
  HorariosRepository: function () { return mockRepo; },
}));

const { HorariosService } = await import('../services/HorariosService.js');

describe('HorariosService', () => {
  let service: HorariosService;

  beforeEach(() => {
    service = new HorariosService();
    for (const key of Object.keys(mockRepo) as (keyof typeof mockRepo)[]) mockRepo[key].mockClear();
  });

  it('listarHorarios', async () => {
    mockRepo.findAll.mockResolvedValue([{ id: 1 }]);
    expect(await service.listarHorarios()).toHaveLength(1);
  });

  it('listarHorarios filtra', async () => {
    await service.listarHorarios(5);
    expect(mockRepo.findAll).toHaveBeenCalledWith(5);
  });

  it('obtenerHorario', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    expect(await service.obtenerHorario(1)).toBeDefined();
  });

  it('obtenerHorario throws on not found', async () => {
    mockRepo.findById.mockResolvedValue(null);
    await expect(service.obtenerHorario(999)).rejects.toThrow('Horario no encontrado');
  });

  it('crearHorario', async () => {
    const d = { cursoAsignaturaId: 1, diaSemana: 1, horaInicio: '08:00', horaTermino: '09:00' };
    mockRepo.create.mockResolvedValue({ id: 1 });
    const r = await service.crearHorario(d);
    expect(r).toBeDefined();
  });

  it('actualizarHorario', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    await service.actualizarHorario(1, { diaSemana: 3 });
    expect(mockRepo.update).toHaveBeenCalled();
  });

  it('eliminarHorario', async () => {
    mockRepo.findById.mockResolvedValue({ id: 1 });
    await service.eliminarHorario(1);
    expect(mockRepo.delete).toHaveBeenCalled();
  });
});
