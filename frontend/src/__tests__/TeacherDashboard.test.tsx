vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}));

vi.mock('../pages/auth/store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../pages/courses/courses.service', () => ({
  default: {
    getCourses: vi.fn(),
    getSubjectsByCourse: vi.fn(),
    getStudentsByCourse: vi.fn(),
  },
}));

vi.mock('../layout/DashboardLayout', () => ({
  default: ({ children }: any) => <div data-testid="dashboard-layout">{children}</div>,
}));

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TeacherDashboard from '../pages/teacher/dashboard/teacher-dashboard.page';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../pages/auth/store';
import courseService from '../pages/courses/courses.service';

describe('TeacherDashboard', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useLocation as any).mockReturnValue({ state: null });
    (useAuthStore as any).mockImplementation((selector?: any) => {
      const state = { logout: vi.fn() };
      return selector ? selector(state) : state;
    });
  });

  it('should show loading skeletons initially', () => {
    vi.mocked(courseService.getCourses).mockReturnValue(new Promise(() => {}));

    render(<TeacherDashboard />);

    expect(screen.getByText('Mis Asignaturas')).toBeInTheDocument();
    expect(document.querySelectorAll('.animate-pulse').length).toBe(3);
  });

  it('should show empty state when no subjects assigned', async () => {
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(courseService.getSubjectsByCourse).mockResolvedValue([]);

    render(<TeacherDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No tienes asignaturas asignadas')).toBeInTheDocument();
    });
    expect(screen.getByText('Espera a que te asignen cursos')).toBeInTheDocument();
  });

  it('should render subject cards when subjects assigned', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 5, rut: '12.345.678-9', firstName: 'María', lastName: 'López' }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(courseService.getSubjectsByCourse).mockResolvedValue([
      { id: 10, subjectName: 'Matemáticas', subjectCode: 'MAT101', professorId: 5 },
      { id: 11, subjectName: 'Lenguaje', subjectCode: 'LEN101', professorId: 5 },
    ]);
    vi.mocked(courseService.getStudentsByCourse).mockResolvedValue([
      { rut: '1-1', firstName: 'A', lastName: 'B' },
    ]);

    render(<TeacherDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Matemáticas')).toBeInTheDocument();
      expect(screen.getByText('Lenguaje')).toBeInTheDocument();
      expect(screen.getByText('MAT101')).toBeInTheDocument();
      expect(screen.getByText('LEN101')).toBeInTheDocument();
    });
    expect(screen.getAllByText(/1 estudiante/).length).toBeGreaterThan(0);
  });

  it('should navigate to subject detail on card click', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 5 }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(courseService.getSubjectsByCourse).mockResolvedValue([
      { id: 10, subjectName: 'Matemáticas', subjectCode: 'MAT101', professorId: 5 },
    ]);
    vi.mocked(courseService.getStudentsByCourse).mockResolvedValue([]);

    render(<TeacherDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Matemáticas')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Matemáticas'));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/dashboard/subject/10',
      expect.objectContaining({
        state: expect.objectContaining({ subjectName: 'Matemáticas', subjectCode: 'MAT101' }),
      }),
    );
  });

  it('should show subject code badge', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 5 }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(courseService.getSubjectsByCourse).mockResolvedValue([
      { id: 10, subjectName: 'Historia', subjectCode: 'HIS101', professorId: 5 },
    ]);
    vi.mocked(courseService.getStudentsByCourse).mockResolvedValue([]);

    render(<TeacherDashboard />);

    await waitFor(() => {
      expect(screen.getByText('HIS101')).toBeInTheDocument();
    });
  });

  it('should render inside DashboardLayout', () => {
    vi.mocked(courseService.getCourses).mockReturnValue(new Promise(() => {}));

    render(<TeacherDashboard />);

    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('should handle getCourses rejection gracefully', async () => {
    vi.mocked(courseService.getCourses).mockRejectedValue(new Error('fail'));

    render(<TeacherDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No tienes asignaturas asignadas')).toBeInTheDocument();
    });
  });

  it('should handle getSubjectsByCourse rejection gracefully', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 5 }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(courseService.getSubjectsByCourse).mockRejectedValue(new Error('fail'));

    render(<TeacherDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No tienes asignaturas asignadas')).toBeInTheDocument();
    });
  });

  it('should handle getStudentsByCourse rejection gracefully', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 5 }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(courseService.getSubjectsByCourse).mockResolvedValue([
      { id: 10, subjectName: 'Matemáticas', subjectCode: 'MAT101', professorId: 5 },
    ]);
    vi.mocked(courseService.getStudentsByCourse).mockRejectedValue(new Error('fail'));

    render(<TeacherDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Matemáticas')).toBeInTheDocument();
    });
    expect(screen.getByText(/0 estudiante/)).toBeInTheDocument();
  });
});
