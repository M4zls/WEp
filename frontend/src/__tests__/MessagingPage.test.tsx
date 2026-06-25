vi.mock('../pages/messaging/use-messaging', () => ({
  useMessaging: vi.fn(),
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { useMessaging } from '../pages/messaging/use-messaging';
import MessagingPage from '../pages/messaging/index';

const mockUseMessaging = vi.mocked(useMessaging);

function buildMockConversacion(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    otherParticipant: {
      usuarioId: '12.345.678-9',
      usuarioNombre: 'Juan',
      usuarioApellido: 'Pérez',
      usuarioRol: 'estudiante',
    },
    participantes: [],
    ultimoMensaje: {
      id: 10,
      conversacionId: 1,
      remitenteId: '12.345.678-9',
      remitenteNombre: 'Juan',
      remitenteApellido: 'Pérez',
      remitenteRol: 'estudiante',
      contenido: 'Hola',
      createdAt: new Date().toISOString(),
    },
    noLeidos: 0,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function buildMockContacto(overrides: Record<string, unknown> = {}) {
  return {
    id: '98.765.432-1',
    nombre: 'María',
    apellido: 'González',
    rol: 'profesor',
    contexto: 'Matemáticas - 3°A',
    ...overrides,
  };
}

function buildMockMensaje(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    conversacionId: 1,
    remitenteId: 'otro-id',
    remitenteNombre: 'Juan',
    remitenteApellido: 'Pérez',
    remitenteRol: 'estudiante',
    contenido: 'Mensaje de prueba',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function defaultMessagingState() {
  return {
    conversaciones: [],
    conversacionActiva: null,
    mensajes: [],
    loadingConvs: false,
    loadingMsgs: false,
    error: null,
    nuevoMensaje: '',
    enviando: false,
    vista: 'conversaciones' as const,
    contactos: [],
    loadingContactos: false,
    usuarioId: '12.345.678-9',
    setNuevoMensaje: vi.fn(),
    seleccionarConversacion: vi.fn(),
    handleEnviar: vi.fn(),
    iniciarConversacion: vi.fn(),
    abrirNuevo: vi.fn(),
    setVista: vi.fn(),
    setError: vi.fn(),
  };
}

describe('MessagingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading spinner when conversaciones are loading', () => {
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      loadingConvs: true,
    });
    render(<MessagingPage />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should show empty state when there are no conversaciones', () => {
    mockUseMessaging.mockReturnValue(defaultMessagingState());
    render(<MessagingPage />);
    expect(screen.getByText('Sin conversaciones')).toBeInTheDocument();
  });

  it('should render conversation list', () => {
    const convs = [
      buildMockConversacion({ id: 1, otherParticipant: { usuarioId: '1', usuarioNombre: 'Ana', usuarioApellido: 'López', usuarioRol: 'profesor' } }),
      buildMockConversacion({ id: 2, otherParticipant: { usuarioId: '2', usuarioNombre: 'Luis', usuarioApellido: 'Mora', usuarioRol: 'estudiante' } }),
    ];
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversaciones: convs,
    });
    render(<MessagingPage />);
    expect(screen.getByText('Ana López')).toBeInTheDocument();
    expect(screen.getByText('Luis Mora')).toBeInTheDocument();
  });

  it('should show unread badge when conversation has noLeidos > 0', () => {
    const conv = buildMockConversacion({ noLeidos: 3 });
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversaciones: [conv],
    });
    render(<MessagingPage />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should highlight active conversation with emerald background', () => {
    const conv = buildMockConversacion({ id: 1 });
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversaciones: [conv],
      conversacionActiva: conv,
    });
    render(<MessagingPage />);
    const buttons = screen.getAllByRole('button');
    const convButton = buttons.find((b) => b.classList.contains('bg-emerald-50'));
    expect(convButton).toBeTruthy();
  });

  it('should call seleccionarConversacion when clicking a conversation', () => {
    const seleccionarConversacion = vi.fn();
    const conv = buildMockConversacion({ id: 1 });
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversaciones: [conv],
      seleccionarConversacion,
    });
    render(<MessagingPage />);
    fireEvent.click(screen.getByText('Juan Pérez'));
    expect(seleccionarConversacion).toHaveBeenCalledWith(conv);
  });

  it('should show error state with retry button', () => {
    const setError = vi.fn();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      error: 'Error al cargar conversaciones',
      setError,
    });
    render(<MessagingPage />);
    expect(screen.getByText('Error al cargar conversaciones')).toBeInTheDocument();
    const retryBtn = screen.getByText('Reintentar');
    fireEvent.click(retryBtn);
    expect(setError).toHaveBeenCalledWith(null);
  });

  it('should display chat panel when conversacionActiva is set', () => {
    const conv = buildMockConversacion();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversacionActiva: conv,
    });
    render(<MessagingPage />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe un mensaje...')).toBeInTheDocument();
    expect(screen.getByText('Enviar')).toBeInTheDocument();
  });

  it('should show loading spinner for       messages while fetching them', () => {
    const conv = buildMockConversacion();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversacionActiva: conv,
      loadingMsgs: true,
    });
    render(<MessagingPage />);
    const spinners = document.querySelectorAll('.animate-spin');
    expect(spinners.length).toBeGreaterThanOrEqual(1);
  });

  it('should show empty       messages state when no       messages', () => {
    const conv = buildMockConversacion();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversacionActiva: conv,
            messages: [],
    });
    render(<MessagingPage />);
    expect(screen.getByText('No hay mensajes. Escribe algo para iniciar la conversación.')).toBeInTheDocument();
  });

  it('should render       messages in chat panel', () => {
    const conv = buildMockConversacion();
    const msg = buildMockMensaje({ id: 1, contenido: '¿Cómo estás?', remitenteId: 'otro-id' });
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversacionActiva: conv,
            messages: [msg],
    });
    render(<MessagingPage />);
    expect(screen.getByText('¿Cómo estás?')).toBeInTheDocument();
  });

  it('should render own       messages right-aligned', () => {
    const conv = buildMockConversacion();
    const msg = buildMockMensaje({ id: 2, contenido: 'Mío', remitenteId: '12.345.678-9' });
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversacionActiva: conv,
            messages: [msg],
    });
    render(<MessagingPage />);
    expect(screen.getByText('Mío')).toBeInTheDocument();
  });

  it('should call handleEnviar on form submit', () => {
    const handleEnviar = vi.fn();
    const conv = buildMockConversacion();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversacionActiva: conv,
      nuevoMensaje: 'Hola',
      handleEnviar,
    });
    render(<MessagingPage />);
    fireEvent.click(screen.getByText('Enviar'));
    expect(handleEnviar).toHaveBeenCalled();
  });

  it('should disable send button when input is empty', () => {
    const conv = buildMockConversacion();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversacionActiva: conv,
      nuevoMensaje: '',
    });
    render(<MessagingPage />);
    expect(screen.getByText('Enviar')).toBeDisabled();
  });

  it('should show "Enviando..." when enviando', () => {
    const conv = buildMockConversacion();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversacionActiva: conv,
      nuevoMensaje: 'Hola',
      enviando: true,
    });
    render(<MessagingPage />);
    expect(screen.getByText('Enviando...')).toBeInTheDocument();
  });

  it('should call setNuevoMensaje when typing in input', () => {
    const setNuevoMensaje = vi.fn();
    const conv = buildMockConversacion();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversacionActiva: conv,
      nuevoMensaje: '',
      setNuevoMensaje,
    });
    render(<MessagingPage />);
    const input = screen.getByPlaceholderText('Escribe un mensaje...');
    fireEvent.change(input, { target: { value: 'Nuevo texto' } });
    expect(setNuevoMensaje).toHaveBeenCalledWith('Nuevo texto');
  });

  it('should call abrirNuevo when clicking "+ Nuevo" button', () => {
    const abrirNuevo = vi.fn();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      abrirNuevo,
    });
    render(<MessagingPage />);
    fireEvent.click(screen.getByText('+ Nuevo'));
    expect(abrirNuevo).toHaveBeenCalled();
  });

  it('should show contact list in "nuevo" view', () => {
    const contactos = [
      buildMockContacto({ id: '1', nombre: 'Carlos', apellido: 'Díaz', rol: 'profesor' }),
      buildMockContacto({ id: '2', nombre: 'Sofía', apellido: 'Rivas', rol: 'estudiante' }),
    ];
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      vista: 'nuevo',
      contactos,
    });
    render(<MessagingPage />);
    expect(screen.getByText('Nueva Conversación')).toBeInTheDocument();
    expect(screen.getByText('Carlos Díaz')).toBeInTheDocument();
    expect(screen.getByText('Sofía Rivas')).toBeInTheDocument();
  });

  it('should show role badges in contact list', () => {
    const contactos = [
      buildMockContacto({ id: '1', nombre: 'Prof', apellido: 'Uno', rol: 'profesor' }),
      buildMockContacto({ id: '2', nombre: 'Est', apellido: 'Dos', rol: 'estudiante' }),
    ];
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      vista: 'nuevo',
      contactos,
    });
    render(<MessagingPage />);
    expect(screen.getByText('Prof')).toBeInTheDocument();
    expect(screen.getByText('Est')).toBeInTheDocument();
  });

  it('should call iniciarConversacion when clicking a contact', () => {
    const iniciarConversacion = vi.fn();
    const contacto = buildMockContacto();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      vista: 'nuevo',
      contactos: [contacto],
      iniciarConversacion,
    });
    render(<MessagingPage />);
    fireEvent.click(screen.getByText('María González'));
    expect(iniciarConversacion).toHaveBeenCalledWith(contacto);
  });

  it('should show loading spinner when contactos are loading', () => {
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      vista: 'nuevo',
      loadingContactos: true,
    });
    render(<MessagingPage />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should show empty contactos message', () => {
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      vista: 'nuevo',
      contactos: [],
    });
    render(<MessagingPage />);
    expect(screen.getByText('No hay contactos disponibles')).toBeInTheDocument();
  });

  it('should show "Volver" button in nuevo view', () => {
    const setVista = vi.fn();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      vista: 'nuevo',
      setVista,
    });
    render(<MessagingPage />);
    const volver = screen.getByText('Volver');
    fireEvent.click(volver);
    expect(setVista).toHaveBeenCalledWith('conversaciones');
  });

  it('should show selection hint when no active conversation', () => {
    mockUseMessaging.mockReturnValue(defaultMessagingState());
    render(<MessagingPage />);
    expect(screen.getByText('Selecciona una conversación')).toBeInTheDocument();
  });

  it('should show selection hint in nuevo view', () => {
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      vista: 'nuevo',
    });
    render(<MessagingPage />);
    expect(screen.getByText('Selecciona un contacto')).toBeInTheDocument();
  });

  it('should render last message preview text', () => {
    const conv = buildMockConversacion({
      ultimoMensaje: { id: 10, conversacionId: 1, remitenteId: '1', remitenteNombre: 'A', remitenteApellido: 'B', remitenteRol: 'estudiante', contenido: 'Último mensaje', createdAt: new Date().toISOString() },
    });
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversaciones: [conv],
    });
    render(<MessagingPage />);
    expect(screen.getByText('Último mensaje')).toBeInTheDocument();
  });
});
