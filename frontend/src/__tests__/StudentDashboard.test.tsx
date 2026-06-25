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
    getSubjects: vi.fn(),
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
    sessionStorage.setItem('user', JSON.stringify({ cursos: '3A' }));
    vi.mocked(courseService.getCourses).mockReturnValue(new Promise(() => {}));

    render(<StudentDashboard />);

    expect(screen.getByText('Mis Asignaturas')).toBeInTheDocument();
    expect(screen.queryByText('No tienes asignaturas asignadas')).not.toBeInTheDocument();
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

  it('should show empty state when user has no cursos field', async () => {
    sessionStorage.setItem('user', JSON.stringify({ nombre: 'Juan', apellido: 'Pérez' }));

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No tienes asignaturas asignadas')).toBeInTheDocument();
    });
  });

  it('should show empty state when no curso matches user cursos', async () => {
    sessionStorage.setItem('user', JSON.stringify({ cursos: '3A' }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, nombre: '1A', nivel: 'Primero', letra: 'A' },
      { id: 2, nombre: '2B', nivel: 'Segundo', letra: 'B' },
    ]);

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No tienes asignaturas asignadas')).toBeInTheDocument();
    });
  });

  it('should show empty state when curso has no materias', async () => {
    sessionStorage.setItem('user', JSON.stringify({ cursos: '3A' }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, nombre: '3A', nivel: 'Tercero', letra: 'A' },
    ]);
    vi.mocked(courseService.getSubjects).mockResolvedValue([]);

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No tienes asignaturas asignadas')).toBeInTheDocument();
    });
  });

  it('should render subject cards with correct data', async () => {
    sessionStorage.setItem('user', JSON.stringify({ cursos: '3A' }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, nombre: '3A', nivel: 'Tercero', letra: 'A' },
    ]);
    vi.mocked(courseService.getSubjects).mockResolvedValue([
      { id: 1, cursoId: 1, asignaturaId: 10, profesorId: 5, profesorNombre: 'María', profesorApellido: 'López', asignaturaNombre: 'Matemáticas', asignaturaCodigo: 'MAT101' },
      { id: 2, cursoId: 1, asignaturaId: 11, profesorId: 6, profesorNombre: 'Carlos', asignaturaNombre: 'Lenguaje', asignaturaCodigo: 'LEN101' },
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

  it('should render subject with sin profesor when no profesor assigned', async () => {
    sessionStorage.setItem('user', JSON.stringify({ cursos: '3A' }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, nombre: '3A', nivel: 'Tercero', letra: 'A' },
    ]);
    vi.mocked(courseService.getSubjects).mockResolvedValue([
      { id: 1, cursoId: 1, asignaturaId: 10, profesorId: null, asignaturaNombre: 'Arte', asignaturaCodigo: 'ART101' },
    ]);

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Sin profesor')).toBeInTheDocument();
    });
  });

  it('should navigate to materia detail on card click', async () => {
    sessionStorage.setItem('user', JSON.stringify({ cursos: '3A' }));
    vi.mocked(courseService.getCourses).mockResolvedValue([
      { id: 1, nombre: '3A', nivel: 'Tercero', letra: 'A' },
    ]);
    vi.mocked(courseService.getSubjects).mockResolvedValue([
      { id: 1, cursoId: 1, asignaturaId: 10, profesorId: 5, profesorNombre: 'María', asignaturaNombre: 'Matemáticas', asignaturaCodigo: 'MAT101' },
    ]);

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Matemáticas')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Matemáticas'));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/dashboard/materia/1',
      expect.objectContaining({
        state: expect.objectContaining({ subjectName: 'Matemáticas', subjectCode: 'MAT101' }),
      }),
    );
  });

  it('should show empty state when API call fails', async () => {
    sessionStorage.setItem('user', JSON.stringify({ cursos: '3A' }));
    vi.mocked(courseService.getCourses).mockRejectedValue(new Error('Network error'));

    render(<StudentDashboard />);

    await waitFor(() => {
      expect(screen.getByText('No tienes asignaturas asignadas')).toBeInTheDocument();
    });
  });

  it('should render inside DashboardLayout', () => {
    sessionStorage.setItem('user', JSON.stringify({ cursos: '3A' }));
    vi.mocked(courseService.getCourses).mockReturnValue(new Promise(() => {}));

    render(<StudentDashboard />);

    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });
});
