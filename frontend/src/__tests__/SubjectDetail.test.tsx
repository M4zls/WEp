/**
 * @file Tests for SubjectDetail component
 * @description Covers header rendering, tab visibility per role, empty states, and navigation
 */

vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('../pages/auth/store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../pages/classes/classes.service', () => ({
  default: { list: vi.fn(), remove: vi.fn() },
}));

vi.mock('../pages/schedule/schedule.service', () => ({
  default: { list: vi.fn(), remove: vi.fn() },
}));

vi.mock('../pages/attendance/attendance.service', () => ({
  default: { listByClass: vi.fn(), mark: vi.fn() },
}));

vi.mock('../pages/courses/courses.service', () => ({
  default: { getStudentsByCourse: vi.fn().mockResolvedValue([]) },
}));

vi.mock('../components/DashboardLayout', () => ({
  default: ({ children }: any) => <div data-testid="dashboard-layout">{children}</div>,
}));

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SubjectDetail from '../pages/courses/components/subject.detail';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../pages/auth/store';
import classesService from '../pages/classes/classes.service';
import scheduleService from '../pages/schedule/schedule.service';

describe('SubjectDetail', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    (useParams as any).mockReturnValue({ cursoAsignaturaId: '5' });
    (useLocation as any).mockReturnValue({
      state: { subjectName: 'Matemáticas', subjectCode: 'MAT101', courseName: '3A', colorIdx: 0 },
    });
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useAuthStore as any).mockReturnValue({ user: null, role: 'estudiante' });
    vi.mocked(classesService.list).mockResolvedValue([]);
    vi.mocked(scheduleService.list).mockResolvedValue([]);
  });

  /**
   * Verifies the header displays the subject name, code, and course name
   */
  it('should render header with subject name', async () => {
    render(<SubjectDetail />);
    await waitFor(() => {
      expect(screen.getByText('Matemáticas')).toBeInTheDocument();
    });
    expect(screen.getByText('MAT101')).toBeInTheDocument();
    expect(screen.getByText(/\b3A\b/)).toBeInTheDocument();
  });

  /**
   * Verifies the estudiante role sees Horario and Clases tabs but not Asistencia
   */
  it('should show tabs for estudiante role', async () => {
    render(<SubjectDetail />);
    await waitFor(() => {
      expect(screen.getByText('Horario')).toBeInTheDocument();
      expect(screen.getByText('Clases')).toBeInTheDocument();
    });
    expect(screen.queryByText('Asistencia')).not.toBeInTheDocument();
  });

  /**
   * Verifies the profesor role sees the Asistencia tab in addition to the other tabs
   */
  it('should show asistencia tab for profesor role', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 1, rut: 't1' }));
    sessionStorage.setItem('role', 'profesor');
    (useAuthStore as any).mockReturnValue({ user: { id: 1 }, role: 'profesor' });
    vi.mocked(classesService.list).mockResolvedValue([{ id: 1, title: 'Clase 1', fecha: '2024-06-15', startTime: '10:00', endTime: '11:00', estado: 'pending', courseSubjectId: 5 }]);
    vi.mocked(scheduleService.list).mockResolvedValue([]);

    render(<SubjectDetail />);
    await waitFor(() => {
      expect(screen.getByText('Asistencia')).toBeInTheDocument();
    });
  });

  /**
   * Verifies the empty horario state message is shown when no schedules exist
   */
  it('should show empty horario state', async () => {
    render(<SubjectDetail />);
    await waitFor(() => {
      expect(screen.getByText('Sin horario definido')).toBeInTheDocument();
    });
  });

  /**
   * Verifies the empty clases state message is shown when no classes exist
   */
  it('should show empty clases state', async () => {
    render(<SubjectDetail />);
    fireEvent.click(screen.getByText('Clases'));
    await waitFor(() => {
      expect(screen.getByText('No hay clases registradas')).toBeInTheDocument();
    });
  });

  /**
   * Verifies clicking the back button calls navigate
   */
  it('should navigate back', async () => {
    render(<SubjectDetail />);
    await waitFor(() => {
      expect(screen.getByText('Volver al panel')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Volver al panel'));
    expect(mockNavigate).toHaveBeenCalled();
  });
});
