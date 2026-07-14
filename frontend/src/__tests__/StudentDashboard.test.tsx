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
  },
}));

vi.mock('../layout/DashboardLayout', () => ({
  default: ({ children }: any) => <div data-testid="dashboard-layout">{children}</div>,
}));

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import StudentDashboard from '../pages/student/dashboard/student-dashboard.page';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../pages/auth/store';
import courseService from '../pages/courses/courses.service';

describe('StudentDashboard', () => {
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
    sessionStorage.setItem('user', JSON.stringify({ courses: '3A' }));
    vi.mocked(courseService.getCourses).mockReturnValue(new Promise(() => {}));

    render(<StudentDashboard />);

    expect(screen.getByText('Mis Asignaturas')).toBeInTheDocument();
    expect(screen.queryByText('You have no assigned subjects')).not.toBeInTheDocument();
    expect(document.querySelectorAll('.animate-pulse').length).toBe(3);
  });

  it('should show empty state when no user in sessionStorage', async () => {
    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No tienes asignaturas asignadas')).toBeInTheDocument();
    });
    expect(screen.getByText('Espera a que te asignen un curso')).toBeInTheDocument();
    expect(screen.getByText('Curso no asignado')).toBeInTheDocument();
  });

  it('should show empty state when user has no courses field', async () => {
    sessionStorage.setItem('user', JSON.stringify({ firstName: 'Juan', lastName: 'Pérez' }));

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No tienes asignaturas asignadas')).toBeInTheDocument();
    });
  });

  it('should show empty state when no course matches user courses', async () => {
    sessionStorage.setItem('user', JSON.stringify({ courses: '3A' }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, name: '1A', level: 'Primero', letter: 'A' },
      { id: 2, name: '2B', level: 'Segundo', letter: 'B' },
    ]);

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No tienes asignaturas asignadas')).toBeInTheDocument();
    });
  });

  it('should show empty state when course has no subjects', async () => {
    sessionStorage.setItem('user', JSON.stringify({ courses: '3A' }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(courseService.getSubjectsByCourse).mockResolvedValue([]);

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No tienes asignaturas asignadas')).toBeInTheDocument();
    });
  });

  it('should render subject cards with correct data', async () => {
    sessionStorage.setItem('user', JSON.stringify({ courses: '3A' }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(courseService.getSubjectsByCourse).mockResolvedValue([
      { id: 1, courseId: 1, subjectId: 10, professorId: 5, professorFirstName: 'María', professorLastName: 'López', subjectName: 'Matemáticas', subjectCode: 'MAT101' },
      { id: 2, courseId: 1, subjectId: 11, professorId: 6, professorFirstName: 'Carlos', subjectName: 'Lenguaje', subjectCode: 'LEN101' },
    ]);

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Matemáticas')).toBeInTheDocument();
      expect(screen.getByText('MAT101')).toBeInTheDocument();
      expect(screen.getByText('María López')).toBeInTheDocument();
      expect(screen.getByText('Lenguaje')).toBeInTheDocument();
      expect(screen.getByText('LEN101')).toBeInTheDocument();
      expect(screen.getByText(/Carlos/)).toBeInTheDocument();
    });
    expect(screen.getByText('Curso: 3A')).toBeInTheDocument();
  });

  it('should render subject with no teacher when no teacher assigned', async () => {
    sessionStorage.setItem('user', JSON.stringify({ courses: '3A' }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(courseService.getSubjectsByCourse).mockResolvedValue([
      { id: 1, courseId: 1, subjectId: 10, professorId: null, subjectName: 'Arte', subjectCode: 'ART101' },
    ]);

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Sin profesor')).toBeInTheDocument();
    });
  });

  it('should navigate to subject detail on card click', async () => {
    sessionStorage.setItem('user', JSON.stringify({ courses: '3A' }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(courseService.getSubjectsByCourse).mockResolvedValue([
      { id: 1, courseId: 1, subjectId: 10, professorId: 5, professorFirstName: 'María', subjectName: 'Matemáticas', subjectCode: 'MAT101' },
    ]);

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Matemáticas')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Matemáticas'));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/dashboard/subject/1',
      expect.objectContaining({
        state: expect.objectContaining({ subjectName: 'Matemáticas', subjectCode: 'MAT101' }),
      }),
    );
  });

  it('should show empty state when API call fails', async () => {
    sessionStorage.setItem('user', JSON.stringify({ courses: '3A' }));
    vi.mocked(courseService.getCourses).mockRejectedValue(new Error('Network error'));

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No tienes asignaturas asignadas')).toBeInTheDocument();
    });
  });

  it('should render inside DashboardLayout', () => {
    sessionStorage.setItem('user', JSON.stringify({ courses: '3A' }));
    vi.mocked(courseService.getCourses).mockReturnValue(new Promise(() => {}));

    render(<StudentDashboard />);

    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });
});
