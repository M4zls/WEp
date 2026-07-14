vi.mock('../pages/classes/classes.service', () => ({
  default: { list: vi.fn() },
}));

vi.mock('../pages/courses/courses.service', () => ({
  default: { getCourses: vi.fn(), getSubjectsByCourse: vi.fn(), getStudentsByCourse: vi.fn() },
}));

import { render, screen, waitFor } from '@testing-library/react';
import HomeView from '../pages/dashboard/home/index';
import classesService from '../pages/classes/classes.service';
import courseService from '../pages/courses/courses.service';

describe('HomeView extra', () => {
  const mockUser = { firstName: 'Juan', lastName: 'Perez', rut: '123-4', courses: '3A' };
  const mockOnGoToSubjects = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('should show upcoming classes for student', async () => {
    sessionStorage.setItem('user', JSON.stringify(mockUser));
    vi.mocked(courseService.getCourses).mockResolvedValue([{ id: 1, name: '3A', level: 'Tercero', letter: 'A' }]);
    vi.mocked(courseService.getSubjectsByCourse).mockResolvedValue([{ id: 10, subjectName: 'Matemáticas', subjectCode: 'MAT', professorId: 1 }]);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 10);
    vi.mocked(classesService.list).mockResolvedValue([
      { id: 1, title: 'Clase 1', date: dateStr, startTime: '10:00', endTime: '11:00', status: 'pending', courseSubjectId: 10 },
    ]);

    render(<HomeView userData={mockUser} role="student" onGoToSubjects={mockOnGoToSubjects} />);

    await waitFor(() => {
      expect(screen.getByText('Clase 1')).toBeInTheDocument();
    });
  });

  it('should render stats for professor', async () => {
    sessionStorage.setItem('user', JSON.stringify({ id: 1, rut: 't1', firstName: 'María', lastName: 'López' }));
    vi.mocked(courseService.getCourses).mockResolvedValue([{ id: 1, name: '3A', level: 'Tercero', letter: 'A' }]);
    vi.mocked(courseService.getSubjectsByCourse).mockResolvedValue([{ id: 10, subjectName: 'Matemáticas', professorId: 1 }]);
    vi.mocked(classesService.list).mockResolvedValue([]);

    render(<HomeView userData={mockUser} role="professor" onGoToSubjects={mockOnGoToSubjects} />);

    await waitFor(() => {
      expect(screen.getByText('Asignaturas')).toBeInTheDocument();
    });
    expect(screen.getByText('Profesor')).toBeInTheDocument();
  });

  it('should show profesor greeting', () => {
    render(<HomeView userData={mockUser} role="professor" onGoToSubjects={mockOnGoToSubjects} />);
    expect(screen.getByText(/Buenos/)).toBeInTheDocument();
  });

  it('should show greeting text', () => {
    render(<HomeView userData={mockUser} role="student" onGoToSubjects={mockOnGoToSubjects} />);
    expect(screen.getByText(/Buenos/)).toBeInTheDocument();
  });
});
