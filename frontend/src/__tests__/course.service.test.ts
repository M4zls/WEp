vi.mock('../api/apiClient', () => ({
  default: {
    get: vi.fn(),
  },
}));

import courseService from '../pages/cursos/service';
import apiClient from '../api/apiClient';

describe('CourseService', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
  });

  it('should fetch all courses', async () => {
    const mockCursos = [{ id: 1, nombre: '1A', nivel: 'Primero', letra: 'A' }];
    vi.mocked(apiClient.get).mockResolvedValue(mockCursos);

    const result = await courseService.obtenerCursos();

    expect(apiClient.get).toHaveBeenCalledWith('/cursos');
    expect(result).toEqual(mockCursos);
  });

  it('should fetch a single course with materias', async () => {
    const mockCurso = {
      id: 1,
      nombre: '1A',
      materias: [{ id: 1, asignatura_nombre: 'Matemáticas' }],
    };
    vi.mocked(apiClient.get).mockResolvedValue(mockCurso);

    const result = await courseService.obtenerCurso(1);

    expect(apiClient.get).toHaveBeenCalledWith('/cursos/1');
    expect(result).toEqual(mockCurso);
  });

  it('should fetch materias by course id', async () => {
    const mockMaterias = [{ id: 1, asignatura_nombre: 'Matemáticas' }];
    vi.mocked(apiClient.get).mockResolvedValue(mockMaterias);

    const result = await courseService.obtenerMaterias(1);

    expect(apiClient.get).toHaveBeenCalledWith('/cursos/1/materias');
    expect(result).toEqual(mockMaterias);
  });

  it('should fetch all asignaturas', async () => {
    const mockAsignaturas = [{ id: 1, nombre: 'Matemáticas', codigo: 'MAT101' }];
    vi.mocked(apiClient.get).mockResolvedValue(mockAsignaturas);

    const result = await courseService.obtenerAsignaturas();

    expect(apiClient.get).toHaveBeenCalledWith('/cursos/asignaturas');
    expect(result).toEqual(mockAsignaturas);
  });
});
