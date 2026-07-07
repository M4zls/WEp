vi.mock('../api/apiClient', () => ({
  default: {
    get: vi.fn(),
  },
}));

import courseService from '../pages/courses/courses.service';
import apiClient from '../api/apiClient';

describe('CourseService', () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockReset();
  });

  it('should fetch all courses', async () => {
    const mockCursos = [{ id: 1, name: '1A', level: 'Primero', letter: 'A' }];
    vi.mocked(apiClient.get).mockResolvedValue(mockCursos);

    const result = await courseService.getCourses();

    expect(apiClient.get).toHaveBeenCalledWith('/courses');
    expect(result).toEqual(mockCursos);
  });

  it('should fetch a single course with subjects', async () => {
    const mockCurso = {
      id: 1,
      name: '1A',
      subjects: [{ id: 1, subjectName: 'Matemáticas' }],
    };
    vi.mocked(apiClient.get).mockResolvedValue(mockCurso);

    const result = await courseService.getCourse(1);

    expect(apiClient.get).toHaveBeenCalledWith('/courses/1');
    expect(result).toEqual(mockCurso);
  });

  it('should fetch subjects by course id', async () => {
    const mockMaterias = [{ id: 1, subjectName: 'Matemáticas' }];
    vi.mocked(apiClient.get).mockResolvedValue(mockMaterias);

    const result = await courseService.getSubjectsByCourse(1);

    expect(apiClient.get).toHaveBeenCalledWith('/courses/1/subjects');
    expect(result).toEqual(mockMaterias);
  });

  it('should fetch all subjects', async () => {
    const mockAsignaturas = [{ id: 1, name: 'Matemáticas', code: 'MAT101' }];
    vi.mocked(apiClient.get).mockResolvedValue(mockAsignaturas);

    const result = await courseService.getSubjects();

    expect(apiClient.get).toHaveBeenCalledWith('/courses/subjects');
    expect(result).toEqual(mockAsignaturas);
  });
});
