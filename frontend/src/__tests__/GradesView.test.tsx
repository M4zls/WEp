/**
 * @file Tests for CalificacionesView component
 * @description Verifies loading, error, and data rendering states for the calificaciones view
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

  /**
   * Verifies the loading spinner is shown while the service call is pending
   */
  it('should show loading state initially', () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    vi.mocked(gradesService.getStudentGrades).mockReturnValue(new Promise(() => {}));
    render(<GradesView />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  /**
   * Verifies an error is displayed when no session exists in sessionStorage
   */
  it('should show error when no session', async () => {
    render(<GradesView />);
    await waitFor(() => {
      expect(screen.getByText('No hay sesión activa')).toBeInTheDocument();
    });
  });

  /**
   * Verifies an error is displayed when the session object lacks a RUT field
   */
  it('should show error when no rut', async () => {
    sessionStorage.setItem('user', JSON.stringify({}));
    render(<GradesView />);
    await waitFor(() => {
      expect(screen.getByText('RUT de estudiante no encontrado')).toBeInTheDocument();
    });
  });

  /**
   * Verifies calificaciones data renders correctly including asignatura, promedio, and notas
   */
  it('should render calificaciones data', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    const mockData = {
      rut: '123-4', nombre: 'Juan', apellido: 'Perez', curso: '3A',
      asignaturas: [
        {
          asignatura: 'Matemáticas', promedio: '6.5',
          notas: [
            { id: 1, estudianteRut: '123-4', asignatura: 'Mat', curso: '3A', nota: '6.5', tipoEvaluacion: 'prueba', fecha: '2024-06-01', profesorRut: 't1' },
            { id: 2, estudianteRut: '123-4', asignatura: 'Mat', curso: '3A', nota: '7.0', tipoEvaluacion: 'trabajo', fecha: '2024-06-15', profesorRut: 't1' },
          ],
        },
      ],
    };
    vi.mocked(gradesService.getStudentGrades).mockResolvedValue(mockData);

    render(<GradesView />);
    await waitFor(() => {
      expect(screen.getByText('Matemáticas')).toBeInTheDocument();
      expect(screen.getByText('prueba')).toBeInTheDocument();
      expect(screen.getByText('trabajo')).toBeInTheDocument();
      expect(screen.getByText('7.0')).toBeInTheDocument();
    });
  });

  /**
   * Verifies the error message is displayed when the service call rejects
   */
  it('should show error on fetch failure', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    vi.mocked(gradesService.getStudentGrades).mockRejectedValue(new Error('API Error'));
    render(<GradesView />);
    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument();
    });
  });

  /**
   * Verifies an empty state message is shown when the asignaturas array is empty
   */
  it('should show empty state when calificaciones is null', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4' }));
    vi.mocked(gradesService.getStudentGrades).mockResolvedValue(null as any);
    render(<GradesView />);
    await waitFor(() => {
      expect(screen.getByText('No tienes calificaciones registradas')).toBeInTheDocument();
    });
  });
});
