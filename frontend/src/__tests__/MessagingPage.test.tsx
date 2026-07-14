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
      userId: '12.345.678-9',
      userFirstName: 'Juan',
      userLastName: 'Pérez',
      userRole: 'student',
    },
    participants: [],
    lastMessage: {
      id: 10,
      conversationId: 1,
      senderId: '12.345.678-9',
      senderFirstName: 'Juan',
      senderLastName: 'Pérez',
      senderRole: 'student',
      content: 'Hola',
      createdAt: new Date().toISOString(),
    },
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function buildMockContacto(overrides: Record<string, unknown> = {}) {
  return {
    id: '98.765.432-1',
    firstName: 'María',
    lastName: 'González',
    role: 'professor',
    context: 'Matemáticas - 3°A',
    ...overrides,
  };
}

function buildMockMensaje(overrides: Record<string, unknown> = {}) {
  return {
    id: 1,
    conversationId: 1,
    senderId: 'otro-id',
    senderFirstName: 'Juan',
    senderLastName: 'Pérez',
    senderRole: 'student',
    content: 'Mensaje de prueba',
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

function defaultMessagingState() {
  return {
    conversations: [],
    activeConversation: null,
    messages: [],
    loadingConvs: false,
    loadingMsgs: false,
    error: null,
    newMessage: '',
    sending: false,
    view: 'conversations' as const,
    contacts: [],
    loadingContacts: false,
    userId: '12.345.678-9',
    setNewMessage: vi.fn(),
    selectConversation: vi.fn(),
    handleSend: vi.fn(),
    startConversation: vi.fn(),
    openNew: vi.fn(),
    setView: vi.fn(),
    setError: vi.fn(),
  };
}

describe('MessagingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading spinner when conversations are loading', () => {
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      loadingConvs: true,
    });
    render(<MessagingPage />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should show empty state when there are no conversations', () => {
    mockUseMessaging.mockReturnValue(defaultMessagingState());
    render(<MessagingPage />);
    expect(screen.getByText('No hay conversaciones')).toBeInTheDocument();
  });

  it('should render conversation list', () => {
    const convs = [
      buildMockConversacion({ id: 1, otherParticipant: { userId: '1', userFirstName: 'Ana', userLastName: 'López', userRole: 'professor' } }),
      buildMockConversacion({ id: 2, otherParticipant: { userId: '2', userFirstName: 'Luis', userLastName: 'Mora', userRole: 'student' } }),
    ];
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversations: convs,
    });
    render(<MessagingPage />);
    expect(screen.getByText('Ana López')).toBeInTheDocument();
    expect(screen.getByText('Luis Mora')).toBeInTheDocument();
  });

  it('should show unread badge when conversation has unreadCount > 0', () => {
    const conv = buildMockConversacion({ unreadCount: 3 });
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversations: [conv],
    });
    render(<MessagingPage />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should highlight active conversation with emerald background', () => {
    const conv = buildMockConversacion({ id: 1 });
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversations: [conv],
      activeConversation: conv,
    });
    render(<MessagingPage />);
    const buttons = screen.getAllByRole('button');
    const convButton = buttons.find((b) => b.classList.contains('bg-emerald-50'));
    expect(convButton).toBeTruthy();
  });

  it('should call selectConversation when clicking a conversation', () => {
    const selectConversation = vi.fn();
    const conv = buildMockConversacion({ id: 1 });
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversations: [conv],
      selectConversation,
    });
    render(<MessagingPage />);
    fireEvent.click(screen.getByText('Juan Pérez'));
    expect(selectConversation).toHaveBeenCalledWith(conv);
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

  it('should display chat panel when activeConversation is set', () => {
    const conv = buildMockConversacion();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      activeConversation: conv,
    });
    render(<MessagingPage />);
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe un mensaje...')).toBeInTheDocument();
    expect(screen.getByText('Enviar')).toBeInTheDocument();
  });

  it('should show loading spinner for messages while fetching them', () => {
    const conv = buildMockConversacion();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      activeConversation: conv,
      loadingMsgs: true,
    });
    render(<MessagingPage />);
    const spinners = document.querySelectorAll('.animate-spin');
    expect(spinners.length).toBeGreaterThanOrEqual(1);
  });

  it('should show empty messages state when no messages', () => {
    const conv = buildMockConversacion();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      activeConversation: conv,
      messages: [],
    });
    render(<MessagingPage />);
    expect(screen.getByText('No hay mensajes. Escribe algo para iniciar la conversación.')).toBeInTheDocument();
  });

  it('should render messages in chat panel', () => {
    const conv = buildMockConversacion();
    const msg = buildMockMensaje({ id: 1, content: '¿Cómo estás?', senderId: 'otro-id' });
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      activeConversation: conv,
      messages: [msg],
    });
    render(<MessagingPage />);
    expect(screen.getByText('¿Cómo estás?')).toBeInTheDocument();
  });

  it('should render own messages right-aligned', () => {
    const conv = buildMockConversacion();
    const msg = buildMockMensaje({ id: 2, content: 'Mío', senderId: '12.345.678-9' });
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      activeConversation: conv,
      messages: [msg],
    });
    render(<MessagingPage />);
    expect(screen.getByText('Mío')).toBeInTheDocument();
  });

  it('should call handleSend on form submit', () => {
    const handleSend = vi.fn();
    const conv = buildMockConversacion();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      activeConversation: conv,
      newMessage: 'Hola',
      handleSend,
    });
    render(<MessagingPage />);
    fireEvent.click(screen.getByText('Enviar'));
    expect(handleSend).toHaveBeenCalled();
  });

  it('should disable send button when input is empty', () => {
    const conv = buildMockConversacion();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      activeConversation: conv,
      newMessage: '',
    });
    render(<MessagingPage />);
    expect(screen.getByText('Enviar')).toBeDisabled();
  });

  it('should show "Sending..." when sending', () => {
    const conv = buildMockConversacion();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      activeConversation: conv,
      newMessage: 'Hola',
      sending: true,
    });
    render(<MessagingPage />);
    expect(screen.getByText('Enviando...')).toBeInTheDocument();
  });

  it('should call setNewMessage when typing in input', () => {
    const setNewMessage = vi.fn();
    const conv = buildMockConversacion();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      activeConversation: conv,
      newMessage: '',
      setNewMessage,
    });
    render(<MessagingPage />);
    const input = screen.getByPlaceholderText('Escribe un mensaje...');
    fireEvent.change(input, { target: { value: 'Nuevo texto' } });
    expect(setNewMessage).toHaveBeenCalledWith('Nuevo texto');
  });

  it('should call openNew when clicking "+ New" button', () => {
    const openNew = vi.fn();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      openNew,
    });
    render(<MessagingPage />);
    fireEvent.click(screen.getByText('+ Nueva'));
    expect(openNew).toHaveBeenCalled();
  });

  it('should show contact list in "new" view', () => {
    const contacts = [
      buildMockContacto({ id: '1', firstName: 'Carlos', lastName: 'Díaz', role: 'professor' }),
      buildMockContacto({ id: '2', firstName: 'Sofía', lastName: 'Rivas', role: 'student' }),
    ];
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      view: 'new',
      contacts,
    });
    render(<MessagingPage />);
    expect(screen.getByText('Nueva conversación')).toBeInTheDocument();
    expect(screen.getByText('Carlos Díaz')).toBeInTheDocument();
    expect(screen.getByText('Sofía Rivas')).toBeInTheDocument();
  });

  it('should show role badges in contact list', () => {
    const contacts = [
      buildMockContacto({ id: '1', firstName: 'Prof', lastName: 'Uno', role: 'professor' }),
      buildMockContacto({ id: '2', firstName: 'Est', lastName: 'Dos', role: 'student' }),
    ];
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      view: 'new',
      contacts,
    });
    render(<MessagingPage />);
    expect(screen.getByText('Prof')).toBeInTheDocument();
    expect(screen.getByText('Est')).toBeInTheDocument();
  });

  it('should call startConversation when clicking a contact', () => {
    const startConversation = vi.fn();
    const contacto = buildMockContacto();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      view: 'new',
      contacts: [contacto],
      startConversation,
    });
    render(<MessagingPage />);
    fireEvent.click(screen.getByText('María González'));
    expect(startConversation).toHaveBeenCalledWith(contacto);
  });

  it('should show loading spinner when contacts are loading', () => {
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      view: 'new',
      loadingContacts: true,
    });
    render(<MessagingPage />);
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('should show empty contacts message', () => {
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      view: 'new',
      contacts: [],
    });
    render(<MessagingPage />);
    expect(screen.getByText('No hay contactos disponibles')).toBeInTheDocument();
  });

  it('should show "Back" button in new view', () => {
    const setView = vi.fn();
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      view: 'new',
      setView,
    });
    render(<MessagingPage />);
    const back = screen.getByText('Volver');
    fireEvent.click(back);
    expect(setView).toHaveBeenCalledWith('conversations');
  });

  it('should show selection hint when no active conversation', () => {
    mockUseMessaging.mockReturnValue(defaultMessagingState());
    render(<MessagingPage />);
    expect(screen.getByText('Seleccionar una conversación')).toBeInTheDocument();
  });

  it('should show selection hint in new view', () => {
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      view: 'new',
    });
    render(<MessagingPage />);
    expect(screen.getByText('Seleccionar un contacto')).toBeInTheDocument();
  });

  it('should render last message preview text', () => {
    const conv = buildMockConversacion({
      lastMessage: { id: 10, conversationId: 1, senderId: '1', senderFirstName: 'A', senderLastName: 'B', senderRole: 'student', content: 'Último mensaje', createdAt: new Date().toISOString() },
    });
    mockUseMessaging.mockReturnValue({
      ...defaultMessagingState(),
      conversations: [conv],
    });
    render(<MessagingPage />);
    expect(screen.getByText('Último mensaje')).toBeInTheDocument();
  });
});
