vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
}));

vi.mock('../pages/auth/store', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../pages/classes/classes.service', () => ({
  default: { list: vi.fn(), remove: vi.fn(), create: vi.fn(), update: vi.fn() },
}));

vi.mock('../pages/schedule/schedule.service', () => ({
  default: { list: vi.fn(), remove: vi.fn(), create: vi.fn(), update: vi.fn() },
}));

vi.mock('../pages/attendance/attendance.service', () => ({
  default: { listByClass: vi.fn(), mark: vi.fn() },
}));

vi.mock('../pages/courses/courses.service', () => ({
  default: { getStudentsByCourse: vi.fn().mockResolvedValue([]) },
}));

vi.mock('../layout/DashboardLayout', () => ({
  default: ({ children }: any) => <div data-testid="dashboard-layout">{children}</div>,
}));

vi.mock('../pages/courses/components/class-form.modal', () => ({
  default: ({ isOpen }: any) => isOpen ? <div data-testid="class-form-modal">Class Form</div> : null,
}));

vi.mock('../pages/courses/components/schedule-form.modal', () => ({
  default: ({ isOpen }: any) => isOpen ? <div data-testid="schedule-form-modal">Schedule Form</div> : null,
}));

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import SubjectDetail from '../pages/courses/components/subject.detail';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../pages/auth/store';
import classesService from '../pages/classes/classes.service';
import scheduleService from '../pages/schedule/schedule.service';

describe('SubjectDetail extra', () => {
  const mockNavigate = vi.fn();
  const mockClass = {
    id: 1, title: 'Clase 1', date: '2024-06-15', startTime: '10:00', endTime: '11:00',
    status: 'pending', description: 'Una descripción', courseSubjectId: 5,
  };
  const mockSchedule = {
    id: 1, weekDay: 1, startTime: '10:00', endTime: '11:00', courseSubjectId: 5,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    (useParams as any).mockReturnValue({ courseSubjectId: '5' });
    (useLocation as any).mockReturnValue({
      state: { subjectName: 'Matemáticas', subjectCode: 'MAT101', courseName: '3A', colorIdx: 0 },
    });
    (useNavigate as any).mockReturnValue(mockNavigate);
    (useAuthStore as any).mockReturnValue({ user: null, role: 'student' });
    vi.mocked(classesService.list).mockResolvedValue([]);
    vi.mocked(scheduleService.list).mockResolvedValue([]);
  });

  it('should render classes with data', async () => {
    vi.mocked(classesService.list).mockResolvedValue([mockClass]);

    render(<SubjectDetail />);

    fireEvent.click(screen.getByText('Clases'));

    await waitFor(() => {
      expect(screen.getByText('Clase 1')).toBeInTheDocument();
      expect(screen.getByText('Pendiente')).toBeInTheDocument();
      expect(screen.getByText('10:00 - 11:00')).toBeInTheDocument();
      expect(screen.getByText('2024-06-15')).toBeInTheDocument();
    });
  });

  it('should render class description when present', async () => {
    vi.mocked(classesService.list).mockResolvedValue([mockClass]);

    render(<SubjectDetail />);

    fireEvent.click(screen.getByText('Clases'));

    await waitFor(() => {
      expect(screen.getByText('Una descripción')).toBeInTheDocument();
    });
  });

  it('should render completed class status correctly', async () => {
    vi.mocked(classesService.list).mockResolvedValue([{
      ...mockClass, status: 'completed',
    }]);

    render(<SubjectDetail />);

    fireEvent.click(screen.getByText('Clases'));

    await waitFor(() => {
      expect(screen.getByText('Completada')).toBeInTheDocument();
    });
  });

  it('should render cancelled class status correctly', async () => {
    vi.mocked(classesService.list).mockResolvedValue([{
      ...mockClass, status: 'cancelled',
    }]);

    render(<SubjectDetail />);

    fireEvent.click(screen.getByText('Clases'));

    await waitFor(() => {
      expect(screen.getByText('Cancelada')).toBeInTheDocument();
    });
  });

  it('should render schedule for professor with add button', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 1, rut: 't1' }));
    sessionStorage.setItem('role', 'professor');
    (useAuthStore as any).mockReturnValue({ user: { id: 1 }, role: 'professor' });
    vi.mocked(scheduleService.list).mockResolvedValue([mockSchedule]);

    render(<SubjectDetail />);

    await waitFor(() => {
      expect(screen.getByText('Agregar Bloque')).toBeInTheDocument();
      expect(screen.getByText('10:00 - 11:00')).toBeInTheDocument();
    });
  });

  it('should show schedules grouped by day', async () => {
    vi.mocked(scheduleService.list).mockResolvedValue([
      { id: 1, weekDay: 1, startTime: '10:00', endTime: '11:00', courseSubjectId: 5 },
      { id: 2, weekDay: 3, startTime: '14:00', endTime: '15:30', courseSubjectId: 5 },
    ]);

    render(<SubjectDetail />);

    await waitFor(() => {
      expect(screen.getByText('10:00 - 11:00')).toBeInTheDocument();
    });
  });

  it('should show "Sin bloques" for empty weekday slots', async () => {
    vi.mocked(scheduleService.list).mockResolvedValue([
      { id: 1, weekDay: 1, startTime: '10:00', endTime: '11:00', courseSubjectId: 5 },
    ]);

    render(<SubjectDetail />);

    await waitFor(() => {
      const sinBloques = screen.getAllByText('Sin bloques');
      expect(sinBloques.length).toBeGreaterThan(0);
    });
  });

  it('should open class form modal for professor', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 1, rut: 't1' }));
    sessionStorage.setItem('role', 'professor');
    (useAuthStore as any).mockReturnValue({ user: { id: 1 }, role: 'professor' });

    render(<SubjectDetail />);

    fireEvent.click(screen.getByText('Clases'));

    await waitFor(() => {
      expect(screen.getByText('Nueva Clase')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Nueva Clase'));

    await waitFor(() => {
      expect(screen.getByTestId('class-form-modal')).toBeInTheDocument();
    });
  });

  it('should open schedule form modal for professor', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 1, rut: 't1' }));
    sessionStorage.setItem('role', 'professor');
    (useAuthStore as any).mockReturnValue({ user: { id: 1 }, role: 'professor' });

    render(<SubjectDetail />);

    await waitFor(() => {
      expect(screen.getByText('Agregar Bloque')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Agregar Bloque'));

    await waitFor(() => {
      expect(screen.getByTestId('schedule-form-modal')).toBeInTheDocument();
    });
  });

  it('should handle classes loading failure gracefully', async () => {
    vi.mocked(classesService.list).mockRejectedValue(new Error('fail'));

    render(<SubjectDetail />);

    fireEvent.click(screen.getByText('Clases'));

    await waitFor(() => {
      expect(screen.getByText('No hay clases registradas')).toBeInTheDocument();
    });
  });

  it('should handle schedule loading failure gracefully', async () => {
    vi.mocked(scheduleService.list).mockRejectedValue(new Error('fail'));

    render(<SubjectDetail />);

    await waitFor(() => {
      expect(screen.getByText('Horario no definido')).toBeInTheDocument();
    });
  });

  it('should navigate back to dashboard', async () => {
    render(<SubjectDetail />);

    await waitFor(() => {
      expect(screen.getByText('Volver al inicio')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Volver al inicio'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', expect.objectContaining({ state: { section: 'classes' } }));
  });

  it('should navigate back to dashboard with courses section for professor', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 1, rut: 't1' }));
    sessionStorage.setItem('role', 'professor');
    (useAuthStore as any).mockReturnValue({ user: { id: 1 }, role: 'professor' });

    render(<SubjectDetail />);

    await waitFor(() => {
      expect(screen.getByText('Volver al inicio')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Volver al inicio'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', expect.objectContaining({ state: { section: 'courses' } }));
  });
});
