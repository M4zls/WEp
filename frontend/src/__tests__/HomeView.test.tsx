/**
 * @file Tests for HomeView component
 * @description Covers greeting, loading stats, data rendering, empty state, and navigation callback
 */

vi.mock('../pages/classes/classes.service', () => ({
  default: { list: vi.fn() },
}));

vi.mock('../pages/courses/courses.service', () => ({
  default: { getCourses: vi.fn(), getSubjectsByCourse: vi.fn(), getStudentsByCourse: vi.fn() },
}));

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import HomeView from '../pages/dashboard/home/index';
import classesService from '../pages/classes/classes.service';
import courseService from '../pages/courses/courses.service';

describe('HomeView', () => {
  const mockUser = { firstName: 'Juan', lastName: 'Perez', rut: '123-4', courses: '3A' };
  const mockOnGoToSubjects = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  /**
   * Verifies the greeting includes the user's full name and role badge
   */
  it('should render greeting for student', async () => {
    render(<HomeView userData={mockUser} role="student" onGoToSubjects={mockOnGoToSubjects} />);
    await waitFor(() => {
      expect(screen.getByText(/Juan Perez/)).toBeInTheDocument();
    });
    expect(screen.getByText('Estudiante')).toBeInTheDocument();
  });

  /**
   * Verifies stat values show loading placeholder when services are pending
   */
  it('should show loading state', () => {
    sessionStorage.setItem('user', JSON.stringify(mockUser));
    vi.mocked(courseService.getCourses).mockReturnValue(new Promise(() => {}));
    render(<HomeView userData={mockUser} role="student" onGoToSubjects={mockOnGoToSubjects} />);
    const statValues = screen.getAllByText('—');
    expect(statValues.length).toBeGreaterThanOrEqual(2);
  });

  /**
   * Verifies stats render numeric values after services resolve
   */
  it('should render stats for student', async () => {
    sessionStorage.setItem('user', JSON.stringify(mockUser));
    vi.mocked(courseService.getCourses).mockResolvedValue([{ id: 1, name: '3A', level: 'Tercero', letter: 'A' }]);
    vi.mocked(courseService.getSubjectsByCourse).mockResolvedValue([{ id: 10, subjectName: 'Matemáticas', subjectCode: 'MAT', professorId: 1 }]);
    vi.mocked(classesService.list).mockResolvedValue([]);

    render(<HomeView userData={mockUser} role="student" onGoToSubjects={mockOnGoToSubjects} />);
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  /**
   * Verifies the empty classes message when no upcoming classes exist
   */
  it('should show no upcoming classes', async () => {
    sessionStorage.setItem('user', JSON.stringify(mockUser));
    vi.mocked(courseService.getCourses).mockResolvedValue([{ id: 1, name: '3A', level: 'Tercero', letter: 'A' }]);
    vi.mocked(courseService.getSubjectsByCourse).mockResolvedValue([]);
    vi.mocked(classesService.list).mockResolvedValue([]);

    render(<HomeView userData={mockUser} role="student" onGoToSubjects={mockOnGoToSubjects} />);
    await waitFor(() => {
      expect(screen.getByText('No hay clases programadas para los próximos días')).toBeInTheDocument();
    });
  });

  /**
   * Verifies clicking the subjects button triggers the onGoToSubjects callback
   */
  it('should call onGoToSubjects when button clicked', async () => {
    render(<HomeView userData={mockUser} role="student" onGoToSubjects={mockOnGoToSubjects} />);
    const buttons = screen.getAllByText(/Ir a Mis Asignaturas/);
    fireEvent.click(buttons[0]);
    expect(mockOnGoToSubjects).toHaveBeenCalled();
  });
});
