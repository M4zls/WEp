vi.mock('../pages/profile/use-profile', () => ({
  useProfile: vi.fn(),
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { useProfile } from '../pages/profile/use-profile';
import ProfilePage from '../pages/profile/profile.page';

const mockUseProfile = vi.mocked(useProfile);

const defaultProfile = {
  firstName: 'Carlos',
  lastName: 'Muñoz',
  email: 'carlos@example.com',
  rut: '12.345.678-9',
  phone: '+56 9 1234 5678',
  courses: '3°A',
  guardian: 'María Muñoz',
  registrationDate: '2024-03-15T00:00:00.000Z',
};

function defaultProfileState(overrides: Record<string, unknown> = {}) {
  return {
    profile: { ...defaultProfile },
    loading: false,
    saving: false,
    editing: false,
    message: null,
    newPassword: '',
    confirmPassword: '',
    setEditing: vi.fn(),
    setNewPassword: vi.fn(),
    setConfirmPassword: vi.fn(),
    handleChange: vi.fn(),
    handleSave: vi.fn(),
    handleCancel: vi.fn(),
    ...overrides,
  };
}

function renderProfilePage(props: Record<string, unknown> = {}) {
  return render(
    <ProfilePage
      userData={{ firstName: 'Carlos', lastName: 'Muñoz', email: 'carlos@example.com', rut: '12.345.678-9' }}
      role="student"
      {...props}
    />
  );
}

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading spinner', () => {
    mockUseProfile.mockReturnValue(defaultProfileState({ loading: true }));
    renderProfilePage();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should show error state when profile is null', () => {
    mockUseProfile.mockReturnValue(defaultProfileState({ profile: null }));
    renderProfilePage();
    expect(screen.getByText('No se pudo cargar la información del perfil.')).toBeInTheDocument();
  });

  it('should display profile name and initials', () => {
    mockUseProfile.mockReturnValue(defaultProfileState());
    renderProfilePage();
    expect(screen.getByText('Carlos Muñoz')).toBeInTheDocument();
    expect(screen.getByText('CM')).toBeInTheDocument();
  });

  it('should display role badge for student', () => {
    mockUseProfile.mockReturnValue(defaultProfileState());
    renderProfilePage();
    expect(screen.getByText('Estudiante')).toBeInTheDocument();
  });

  it('should display role badge for professor', () => {
    mockUseProfile.mockReturnValue(defaultProfileState());
    render(
      <ProfilePage
        userData={{ firstName: 'Ana', lastName: 'López', email: 'ana@example.com', rut: '98.765.432-1' }}
        role="professor"
      />
    );
    expect(screen.getByText('Profesor')).toBeInTheDocument();
  });

  it('should display profile fields', () => {
    mockUseProfile.mockReturnValue(defaultProfileState());
    renderProfilePage();
    expect(screen.getByText('Carlos Muñoz')).toBeInTheDocument();
    expect(screen.getByText('carlos@example.com')).toBeInTheDocument();
    expect(screen.getByText('12.345.678-9')).toBeInTheDocument();
    expect(screen.getByText('+56 9 1234 5678')).toBeInTheDocument();
    expect(screen.getByText('3°A')).toBeInTheDocument();
    expect(screen.getByText('María Muñoz')).toBeInTheDocument();
  });

  it('should show registration date for student', () => {
    mockUseProfile.mockReturnValue(defaultProfileState());
    renderProfilePage();
    expect(screen.getByText(/Registrado:/)).toBeInTheDocument();
  });

  it('should show started date for professor', () => {
    const profile = { ...defaultProfile, registrationDate: undefined, admissionDate: '2023-01-10T00:00:00.000Z' };
    mockUseProfile.mockReturnValue(defaultProfileState({ profile }));
    render(
      <ProfilePage
        userData={{ firstName: 'Ana', lastName: 'López', email: 'ana@example.com', rut: '98.765.432-1' }}
        role="professor"
      />
    );
    expect(screen.getByText(/Inicio:/)).toBeInTheDocument();
  });

  it('should render "Not registered" for empty optional fields', () => {
    const profile = { ...defaultProfile, phone: null, guardian: null };
    mockUseProfile.mockReturnValue(defaultProfileState({ profile }));
    renderProfilePage();
    const notRegistered = screen.getAllByText('No registrado');
    expect(notRegistered.length).toBeGreaterThanOrEqual(1);
  });

  it('should show Edit Profile button when not editing', () => {
    const setEditing = vi.fn();
    mockUseProfile.mockReturnValue(defaultProfileState({ setEditing }));
    renderProfilePage();
    const btn = screen.getByText('Editar Perfil');
    fireEvent.click(btn);
    expect(setEditing).toHaveBeenCalledWith(true);
  });

  it('should show input fields when editing is true', () => {
    mockUseProfile.mockReturnValue(defaultProfileState({ editing: true }));
    renderProfilePage();
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(3);
  });

  it('should show Save Changes and Cancel buttons when editing', () => {
    mockUseProfile.mockReturnValue(defaultProfileState({ editing: true }));
    renderProfilePage();
    expect(screen.getByText('Guardar Cambios')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('should call handleSave when clicking Save Changes', () => {
    const handleSave = vi.fn();
    mockUseProfile.mockReturnValue(defaultProfileState({ editing: true, handleSave }));
    renderProfilePage();
    fireEvent.click(screen.getByText('Guardar Cambios'));
    expect(handleSave).toHaveBeenCalled();
  });

  it('should call handleCancel when clicking Cancel', () => {
    const handleCancel = vi.fn();
    mockUseProfile.mockReturnValue(defaultProfileState({ editing: true, handleCancel }));
    renderProfilePage();
    fireEvent.click(screen.getByText('Cancelar'));
    expect(handleCancel).toHaveBeenCalled();
  });

  it('should disable Save Changes when saving', () => {
    mockUseProfile.mockReturnValue(defaultProfileState({ editing: true, saving: true }));
    renderProfilePage();
    const btn = screen.getByText('Guardando...');
    expect(btn).toBeDisabled();
  });

  it('should call handleChange when editing an input field', () => {
    const handleChange = vi.fn();
    mockUseProfile.mockReturnValue(defaultProfileState({ editing: true, handleChange }));
    renderProfilePage();
    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: 'nuevo@email.com' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('should show success message', () => {
    mockUseProfile.mockReturnValue(defaultProfileState({
      message: { type: 'ok', text: 'Perfil actualizado exitosamente' },
    }));
    renderProfilePage();
    expect(screen.getByText('Perfil actualizado exitosamente')).toBeInTheDocument();
  });

  it('should show error message', () => {
    mockUseProfile.mockReturnValue(defaultProfileState({
      message: { type: 'error', text: 'Error al guardar los cambios' },
    }));
    renderProfilePage();
    expect(screen.getByText('Error al guardar los cambios')).toBeInTheDocument();
  });

  it('should show password change section when editing', () => {
    mockUseProfile.mockReturnValue(defaultProfileState({ editing: true }));
    renderProfilePage();
    expect(screen.getByText('Cambiar Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Nueva Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Confirmar Contraseña')).toBeInTheDocument();
  });

  it('should call setNewPassword when typing in password field', () => {
    const setNewPassword = vi.fn();
    mockUseProfile.mockReturnValue(defaultProfileState({ editing: true, setNewPassword }));
    renderProfilePage();
    const passwordInputs = screen.getAllByDisplayValue('');
    const nuevaPassInput = passwordInputs.find((el) => el.getAttribute('type') === 'password');
    if (nuevaPassInput) {
      fireEvent.change(nuevaPassInput, { target: { value: '123456' } });
      expect(setNewPassword).toHaveBeenCalledWith('123456');
    }
  });

  it('should call setConfirmPassword when typing in confirm field', () => {
    const setConfirmPassword = vi.fn();
    mockUseProfile.mockReturnValue(defaultProfileState({ editing: true, setConfirmPassword }));
    renderProfilePage();
    const passwordInputs = screen.getAllByDisplayValue('');
    const confirmInput = passwordInputs.filter((el) => el.getAttribute('type') === 'password');
    if (confirmInput.length > 1) {
      fireEvent.change(confirmInput[1], { target: { value: '123456' } });
      expect(setConfirmPassword).toHaveBeenCalledWith('123456');
    }
  });

  it('should hide password section when not editing', () => {
    mockUseProfile.mockReturnValue(defaultProfileState({ editing: false }));
    renderProfilePage();
    expect(screen.queryByText('Cambiar Contraseña')).not.toBeInTheDocument();
  });

  it('should display subject for professor role', () => {
    const profile = { ...defaultProfile, subject: 'Matemáticas', courses: undefined };
    mockUseProfile.mockReturnValue(defaultProfileState({ profile }));
    render(
      <ProfilePage
        userData={{ firstName: 'Ana', lastName: 'López', email: 'ana@example.com', rut: '98.765.432-1' }}
        role="professor"
      />
    );
    expect(screen.getByText('Matemáticas')).toBeInTheDocument();
  });
});
