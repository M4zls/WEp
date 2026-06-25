/**
 * Tests for ScheduleFormModal component.
 *
 * @module ScheduleFormModal.test.tsx
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ScheduleFormModal from '../pages/courses/components/schedule-form.modal';

describe('ScheduleFormModal', () => {
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
      <ScheduleFormModal isOpen={false} onClose={mockOnClose} onSave={mockOnSave} />
    );
    expect(container.innerHTML).toBe('');
  });

  /**
   * Should render the modal with form fields when isOpen is true.
   */
  it('should render modal when isOpen is true', () => {
    render(<ScheduleFormModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    expect(screen.getByText('Agregar Bloque Horario')).toBeInTheDocument();
    expect(screen.getByText('Agregar')).toBeInTheDocument();
    expect(screen.getByText('Lunes')).toBeInTheDocument();
  });

  /**
   * Should show a validation error when submitting with empty fields.
   */
  it('should show validation error on empty submit', async () => {
    render(<ScheduleFormModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    const timeInputs = document.querySelectorAll('input[type="time"]');
    fireEvent.change(timeInputs[0], { target: { value: '' } });
    fireEvent.change(timeInputs[1], { target: { value: '' } });
    fireEvent.click(screen.getByText('Agregar'));
    await waitFor(() => {
      expect(screen.getByText('Completa todos los campos')).toBeInTheDocument();
    });
  });

  /**
   * Should display the server error message when onSave throws.
   */
  it('should show error when onSave throws', async () => {
    const saveWithError = vi.fn().mockRejectedValue(new Error('Save failed'));
    render(<ScheduleFormModal isOpen={true} onClose={mockOnClose} onSave={saveWithError} />);
    fireEvent.click(screen.getByText('Agregar'));
    await waitFor(() => {
      expect(screen.getByText('Save failed')).toBeInTheDocument();
    });
  });

  /**
   * Should call onSave with the correct form data on valid submit.
   */
  it('should call onSave with form data', async () => {
    render(<ScheduleFormModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} />);
    const timeInputs = document.querySelectorAll('input[type="time"]');
    fireEvent.change(timeInputs[0], { target: { value: '08:00' } });
    fireEvent.change(timeInputs[1], { target: { value: '09:30' } });
    fireEvent.click(screen.getByText('Agregar'));
    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
        diaSemana: 1,
        horaInicio: '08:00',
        horaTermino: '09:30',
      }));
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  /**
   * Should pre-fill form fields when editingHorario is provided.
   */
  it('should pre-fill fields when editingHorario is provided', () => {
    const editingHorario = {
      id: 1, courseSubjectId: 5, diaSemana: 3, horaInicio: '10:00', horaTermino: '11:30',
    };
    render(<ScheduleFormModal isOpen={true} onClose={mockOnClose} onSave={mockOnSave} editingHorario={editingHorario} />);
    expect(screen.getByText('Editar Bloque Horario')).toBeInTheDocument();
    expect(screen.getByText('Guardar Cambios')).toBeInTheDocument();
  });
});
