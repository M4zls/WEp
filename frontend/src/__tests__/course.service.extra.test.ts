/**
 * Extra test suite for CourseService.
 * Covers the obtenerEstudiantesPorCurso method and encoding of course names with special characters.
 */
vi.mock('../api/apiClient', () => ({
  default: { get: vi.fn() },
}));

import courseService from '../pages/courses/courses.service';
import apiClient from '../api/apiClient';

describe('CourseService - obtenerEstudiantesPorCurso', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
  });

  /** Verifies that obtenerEstudiantesPorCurso calls GET /estudiantes/curso/:nombre and returns the student list */
  it('should fetch students by course name', async () => {
    const mockStudents = [{ rut: '1', nombre: 'Juan' }];
    vi.mocked(apiClient.get).mockResolvedValue(mockStudents);
    const result = await courseService.getStudentsByCourse('3A');
    expect(apiClient.get).toHaveBeenCalledWith('/students/course/3A');
    expect(result).toEqual(mockStudents);
  });

  /** Verifies that course names with special characters (e.g. "3° A") are properly URI-encoded */
  it('should encode course name with special characters', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([]);
    await courseService.getStudentsByCourse('3° A');
    expect(apiClient.get).toHaveBeenCalledWith('/students/course/3%C2%B0%20A');
  });
});
