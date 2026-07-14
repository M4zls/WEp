/**
 * @file Tests for GradesView component
 */

vi.mock('../pages/grades/services/grades.service', () => ({
  default: { getStudentGrades: vi.fn() },
}));

import { render, screen, waitFor } from '@testing-library/react';
import GradesView from '../pages/grades/grades.view';
import gradesService from '../pages/grades/services/grades.service';

describe('GradesView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('should show loading state initially', () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    vi.mocked(gradesService.getStudentGrades).mockReturnValue(new Promise(() => {}));
    render(<GradesView />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('should show error when no session', async () => {
    render(<GradesView />);
    await waitFor(() => {
      expect(screen.getByText('Sin sesión activa')).toBeInTheDocument();
    });
  });

  it('should show error when no rut', async () => {
    sessionStorage.setItem('user', JSON.stringify({}));
    render(<GradesView />);
    await waitFor(() => {
      expect(screen.getByText('RUT de estudiante no encontrado')).toBeInTheDocument();
    });
  });

  it('should render grades data', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    const mockData = {
      rut: '123-4', firstName: 'Juan', lastName: 'Perez', course: '3A',
      subjects: [
        {
          subject: 'Matemáticas', average: '6.5',
          grades: [
            { id: 1, studentRut: '123-4', subject: 'Mat', course: '3A', grade: '6.5', evaluationType: 'test', date: '2024-06-01', professorRut: 't1' },
            { id: 2, studentRut: '123-4', subject: 'Mat', course: '3A', grade: '7.0', evaluationType: 'assignment', date: '2024-06-15', professorRut: 't1' },
          ],
        },
      ],
    };
    vi.mocked(gradesService.getStudentGrades).mockResolvedValue(mockData);

    render(<GradesView />);
    await waitFor(() => {
      expect(screen.getByText('Matemáticas')).toBeInTheDocument();
      expect(screen.getByText('test')).toBeInTheDocument();
      expect(screen.getByText('assignment')).toBeInTheDocument();
      expect(screen.getByText('7.0')).toBeInTheDocument();
    });
  });

  it('should show error on fetch failure', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    vi.mocked(gradesService.getStudentGrades).mockRejectedValue(new Error('API Error'));
    render(<GradesView />);
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  it('should show empty state when grades is null', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    vi.mocked(gradesService.getStudentGrades).mockResolvedValue(null as any);
    render(<GradesView />);
    await waitFor(() => {
      expect(screen.getByText('No hay notas registradas')).toBeInTheDocument();
    });
  });
});
