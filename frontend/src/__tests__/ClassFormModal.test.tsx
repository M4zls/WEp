/**
 * Tests for ClassFormModal component.
 *
 * @module ClassFormModal.test.tsx
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClassFormModal from '../pages/courses/components/class-form.modal';
import { CLASS_STATUSES } from '../pages/classes/class.types';

describe('ClassFormModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Should not render anything when isOpen is false.
   */
  it('should not render when isOpen is false', () => {
    const { container } = render(
      <ClassFormModal isOpen={false} onClose={mockOnClose} onSave={mockOnSave} />
    );
    expect(container.innerHTML).toBe('');
  });

  /**
   * Should render the modal with form fields when isOpen is true.
   */
  it('should render modal when isOpen is true', () => {
    render(<ClassFormModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    expect(screen.getByText('New Class')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E.g. Class 1: Introduction')).toBeInTheDocument();
    expect(screen.getByText('Create Class')).toBeInTheDocument();
  });

  /**
   * Should show a validation error when submitting with empty fields.
   */
  it('should show validation error on empty submit', async () => {
    render(<ClassFormModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    fireEvent.click(screen.getByText('Create Class'));
    await waitFor(() => {
      expect(screen.getByText('Complete all required fields')).toBeInTheDocument();
    });
  });

  /**
   * Should display the server error message when onSave throws.
   */
  it('should show error when onSave throws', async () => {
    const saveWithError = vi.fn().mockRejectedValue(new Error('Server error'));
    render(<ClassFormModal isOpen={true} onClose={mockOnClose} onSave={saveWithError} />);
    const inputs = document.querySelectorAll('input');
    fireEvent.change(inputs[0], { target: { value: 'Test' } });
    fireEvent.change(inputs[1], { target: { value: '2024-06-15' } });
    fireEvent.change(inputs[2], { target: { value: '10:00' } });
    fireEvent.change(inputs[3], { target: { value: '11:00' } });
    fireEvent.click(screen.getByText('Create Class'));
    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeInTheDocument();
    });
  });

  /**
   * Should pre-fill form fields when editingClase is provided.
   */
  it('should pre-fill fields when editingClass is provided', () => {
    const editingClass = {
      id: 1,       title: 'Edit Title', description: 'Desc', fecha: '2024-06-10',
      startTime: '09:00', endTime: '10:00', estado: CLASS_STATUSES.PENDING, courseSubjectId: 5,
    };
    render(<ClassFormModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} editingClass={editingClass} />);
    expect(screen.getByText('Edit Class')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Edit Title')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  /**
   * Should display the estado select options when editing an existing clase.
   */
  it('should show estado select when editing', () => {
    const editingClass = {
      id: 1,       title: 'Test', fecha: '2024-06-10',
      startTime: '09:00', endTime: '10:00', estado: CLASS_STATUSES.PENDING, courseSubjectId: 5,
    };
    render(<ClassFormModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} editingClass={editingClass} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });
});
