vi.mock('../shared/api/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import horarioService from '../shared/clases/horario.service';
import apiClient from '../shared/api/apiClient';

describe('HorarioService', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.post).mockReset();
    vi.mocked(apiClient.put).mockReset();
    vi.mocked(apiClient.delete).mockReset();
  });

  it('should list horarios without filter', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await horarioService.listar();
    expect(apiClient.get).toHaveBeenCalledWith('/horarios');
  });

  it('should list horarios filtered by cursoAsignaturaId', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await horarioService.listar(3);
    expect(apiClient.get).toHaveBeenCalledWith('/horarios?curso_asignatura_id=3');
  });

  it('should fetch a single horario by id', async () => {
    const mockHorario = { id: 1, cursoAsignaturaId: 1, diaSemana: 1, horaInicio: '08:00', horaTermino: '09:00' };
    vi.mocked(apiClient.get).mockResolvedValue(mockHorario);

    const result = await horarioService.obtener(1);
    expect(apiClient.get).toHaveBeenCalledWith('/horarios/1');
    expect(result).toEqual(mockHorario);
  });

  it('should create a horario', async () => {
    const dto = { cursoAsignaturaId: 1, diaSemana: 2, horaInicio: '09:00', horaTermino: '10:00' };
    vi.mocked(apiClient.post).mockResolvedValue({ id: 1, ...dto });

    const result = await horarioService.crear(dto);
    expect(apiClient.post).toHaveBeenCalledWith('/horarios', dto);
    expect(result).toMatchObject({ id: 1 });
  });

  it('should update a horario', async () => {
    vi.mocked(apiClient.put).mockResolvedValue(undefined);
    await horarioService.actualizar(1, { horaInicio: '10:00' });
    expect(apiClient.put).toHaveBeenCalledWith('/horarios/1', { horaInicio: '10:00' });
  });

  it('should delete a horario', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined);
    await horarioService.eliminar(1);
    expect(apiClient.delete).toHaveBeenCalledWith('/horarios/1');
  });
});
