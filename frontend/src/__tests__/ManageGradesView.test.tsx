vi.mock('../pages/courses/courses.service', () => ({
  default: {
    getCourses: vi.fn(),
    getSubjectsByCourse: vi.fn(),
    getStudentsByCourse: vi.fn(),
  },
}));

vi.mock('../pages/grades/services/grades.service', () => ({
  default: {
    getCourseGrades: vi.fn(),
    createGradesBatch: vi.fn(),
    updateGrade: vi.fn(),
  },
}));

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ManageGradesView from '../pages/grades/manage-grades.view';
import coursesService from '../pages/courses/courses.service';
import gradesService from '../pages/grades/services/grades.service';

describe('ManageGradesView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('should show loading skeletons initially', () => {
    vi.mocked(coursesService.getCourses).mockReturnValue(new Promise(() => {}));

    render(<ManageGradesView />);

    expect(screen.getByText('Gestión de Notas')).toBeInTheDocument();
    expect(document.querySelectorAll('.animate-pulse').length).toBe(3);
  });

  it('should show empty state when no subjects', async () => {
    vi.mocked(coursesService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(coursesService.getSubjectsByCourse).mockResolvedValue([]);

    render(<ManageGradesView />);

    await waitFor(() => {
      expect(screen.getByText('You have no assigned subjects')).toBeInTheDocument();
    });
  });

  it('should render subject list', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 5, rut: 't1' }));
    vi.mocked(coursesService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(coursesService.getSubjectsByCourse).mockResolvedValue([
      { id: 10, subjectName: 'Matemáticas', subjectCode: 'MAT101', professorId: 5 },
    ]);
    vi.mocked(coursesService.getStudentsByCourse).mockResolvedValue([
      { rut: '1-1', firstName: 'Juan', lastName: 'Pérez' },
    ]);

    render(<ManageGradesView />);

    await waitFor(() => {
      expect(screen.getByText('Matemáticas')).toBeInTheDocument();
      expect(screen.getByText('MAT101')).toBeInTheDocument();
    });
  });

  it('should show error message when loading students fails', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 5, rut: 't1' }));
    vi.mocked(coursesService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(coursesService.getSubjectsByCourse).mockResolvedValue([
      { id: 10, subjectName: 'Matemáticas', subjectCode: 'MAT101', professorId: 5 },
    ]);
    vi.mocked(coursesService.getStudentsByCourse).mockRejectedValue(new Error('fail'));

    render(<ManageGradesView />);

    await waitFor(() => {
      expect(screen.getByText('Matemáticas')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Matemáticas'));

    await waitFor(() => {
      expect(screen.getByText('Error al cargar estudiantes')).toBeInTheDocument();
    });
  });

  it('should show no students found message when table has no students', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 5, rut: 't1' }));
    vi.mocked(coursesService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(coursesService.getSubjectsByCourse).mockResolvedValue([
      { id: 10, subjectName: 'Matemáticas', subjectCode: 'MAT101', professorId: 5 },
    ]);
    vi.mocked(coursesService.getStudentsByCourse).mockResolvedValue([]);
    vi.mocked(gradesService.getCourseGrades).mockResolvedValue([]);

    render(<ManageGradesView />);

    await waitFor(() => expect(screen.getByText('Matemáticas')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Matemáticas'));

    await waitFor(() => {
      expect(screen.getByText('No se encontraron estudiantes para este curso')).toBeInTheDocument();
    });
  });

  it('should handle getCourses rejection gracefully', async () => {
    vi.mocked(coursesService.getCourses).mockRejectedValue(new Error('fail'));

    render(<ManageGradesView />);

    await waitFor(() => {
      expect(screen.getByText('You have no assigned subjects')).toBeInTheDocument();
    });
  });
});
