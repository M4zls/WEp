vi.mock('../shared/api/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import claseService from '../shared/clases/clase.service';
import apiClient from '../shared/api/apiClient';

describe('ClaseService', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
    vi.mocked(apiClient.post).mockReset();
    vi.mocked(apiClient.put).mockReset();
    vi.mocked(apiClient.delete).mockReset();
  });

  it('should list clases without filter', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await claseService.listar();
    expect(apiClient.get).toHaveBeenCalledWith('/clases');
  });

  it('should list clases filtered by cursoAsignaturaId', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await claseService.listar(5);
    expect(apiClient.get).toHaveBeenCalledWith('/clases?curso_asignatura_id=5');
  });

  it('should fetch a single clase by id', async () => {
    const mockClase = { id: 1, titulo: 'Test', fecha: '2024-01-01', horaInicio: '10:00', horaTermino: '11:00', estado: 'pendiente', cursoAsignaturaId: 1 };
    vi.mocked(apiClient.get).mockResolvedValue(mockClase);

    const result = await claseService.obtener(1);
    expect(apiClient.get).toHaveBeenCalledWith('/clases/1');
    expect(result).toEqual(mockClase);
  });

  it('should create a clase', async () => {
    const dto = { cursoAsignaturaId: 1, titulo: 'New', fecha: '2024-01-01', horaInicio: '10:00', horaTermino: '11:00' };
    vi.mocked(apiClient.post).mockResolvedValue({ id: 1, ...dto });

    const result = await claseService.crear(dto);
    expect(apiClient.post).toHaveBeenCalledWith('/clases', dto);
    expect(result).toMatchObject({ id: 1 });
  });

  it('should update a clase', async () => {
    vi.mocked(apiClient.put).mockResolvedValue(undefined);
    await claseService.actualizar(1, { titulo: 'Updated' });
    expect(apiClient.put).toHaveBeenCalledWith('/clases/1', { titulo: 'Updated' });
  });

  it('should delete a clase', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue(undefined);
    await claseService.eliminar(1);
    expect(apiClient.delete).toHaveBeenCalledWith('/clases/1');
  });
});
