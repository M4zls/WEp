vi.mock('../api/apiClient', () => ({
  default: { get: vi.fn(), put: vi.fn(), post: vi.fn() },
}));
vi.mock('../pages/courses/courses.service', () => ({
  default: {
    getCourses: vi.fn(),
    getSubjectsByCourse: vi.fn(),
    getStudentsByCourse: vi.fn(),
  },
}));

import { renderHook, waitFor, act } from '@testing-library/react';
import { useMessaging } from '../pages/messaging/use-messaging';
import apiClient from '../api/apiClient';
import coursesService from '../pages/courses/courses.service';

describe('useMessaging extra', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  it('should load messages on selectConversation', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', firstName: 'Juan', lastName: 'Perez' }));
    sessionStorage.setItem('role', 'student');
    vi.mocked(apiClient.get).mockResolvedValue([]);
    vi.mocked(apiClient.put).mockResolvedValue({});

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));

    await act(async () => {
      await result.current.selectConversation({
        id: 1,
        otherParticipant: { userId: '2', userFirstName: 'Ana', userLastName: 'Lopez', userRole: 'professor' },
        participants: [],
        lastMessage: null,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
      });
    });

    expect(apiClient.get).toHaveBeenCalledWith('/messaging/messages/1');
    expect(apiClient.put).toHaveBeenCalledWith('/messaging/messages/read/1/123-4', {});
  });

  it('should send a message via handleSend', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', firstName: 'Juan', lastName: 'Perez' }));
    sessionStorage.setItem('role', 'student');
    vi.mocked(apiClient.get).mockResolvedValue([]);
    vi.mocked(apiClient.put).mockResolvedValue({});
    vi.mocked(apiClient.post).mockResolvedValue({ id: 10, content: 'Hola', senderId: '123-4' });

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));

    await act(async () => {
      await result.current.selectConversation({
        id: 1,
        otherParticipant: { userId: '2', userFirstName: 'Ana', userLastName: 'Lopez', userRole: 'professor' },
        participants: [],
        lastMessage: null,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
      });
    });

    act(() => { result.current.setNewMessage('Hola'); });
    expect(result.current.newMessage).toBe('Hola');

    await act(async () => {
      await result.current.handleSend();
    });

    expect(apiClient.post).toHaveBeenCalledWith('/messaging/messages', expect.objectContaining({
      conversationId: 1,
      senderId: '123-4',
      content: 'Hola',
    }));
    expect(result.current.newMessage).toBe('');
  });

  it('should not send empty message', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', firstName: 'Juan', lastName: 'Perez' }));
    sessionStorage.setItem('role', 'student');
    vi.mocked(apiClient.get).mockResolvedValue([]);

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));

    await act(async () => {
      await result.current.selectConversation({
        id: 1,
        otherParticipant: { userId: '2', userFirstName: 'Ana', userLastName: 'Lopez', userRole: 'professor' },
        participants: [],
        lastMessage: null,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
      });
    });

    await act(async () => {
      await result.current.handleSend();
    });

    expect(apiClient.post).not.toHaveBeenCalled();
  });

  it('should start a new conversation', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', firstName: 'Juan', lastName: 'Perez' }));
    sessionStorage.setItem('role', 'student');
    vi.mocked(apiClient.get).mockResolvedValue([]);
    vi.mocked(apiClient.post).mockResolvedValue({ id: 5, createdAt: new Date().toISOString() });

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));

    await act(async () => {
      await result.current.startConversation({
        id: '99-8',
        firstName: 'Carlos',
        lastName: 'Mora',
        role: 'professor',
        context: 'Matemáticas',
      });
    });

    expect(apiClient.post).toHaveBeenCalledWith('/messaging/conversations', {
      participantIds: ['123-4', '99-8'],
      participantFirstNames: ['Juan', 'Carlos'],
      participantLastNames: ['Perez', 'Mora'],
      participantRoles: ['student', 'professor'],
    });
    expect(result.current.activeConversation).not.toBeNull();
    expect(result.current.view).toBe('conversations');
  });

  it('should load contacts for student role', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', firstName: 'Juan', lastName: 'Perez', courses: '3A' }));
    sessionStorage.setItem('role', 'student');
    vi.mocked(apiClient.get).mockResolvedValue([]);
    vi.mocked(coursesService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(coursesService.getSubjectsByCourse).mockResolvedValue([
      { id: 10, subjectName: 'Matemáticas', professorRut: 't1', professorFirstName: 'María', professorLastName: 'López' },
    ]);
    vi.mocked(coursesService.getStudentsByCourse).mockResolvedValue([
      { rut: '2-2', firstName: 'Ana', lastName: 'García' },
    ]);

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));

    await act(async () => {
      await result.current.openNew();
    });

    await waitFor(() => {
      expect(result.current.contacts.length).toBe(2);
    });
    expect(result.current.contacts[0].firstName).toBe('María');
    expect(result.current.contacts[1].firstName).toBe('Ana');
  });

  it('should load contacts for professor role', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: 't1', firstName: 'María', lastName: 'López' }));
    sessionStorage.setItem('role', 'professor');
    vi.mocked(apiClient.get).mockResolvedValue([]);
    vi.mocked(coursesService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(coursesService.getSubjectsByCourse).mockResolvedValue([
      { id: 10, subjectName: 'Matemáticas', professorRut: 't1', professorFirstName: 'María', professorLastName: 'López' },
    ]);
    vi.mocked(coursesService.getStudentsByCourse).mockResolvedValue([
      { rut: '2-2', firstName: 'Ana', lastName: 'García' },
    ]);

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));

    await act(async () => {
      await result.current.openNew();
    });

    await waitFor(() => {
      expect(result.current.contacts.length).toBe(1);
    });
    expect(result.current.contacts[0].firstName).toBe('Ana');
  });

  it('should set view to new when openNew is called', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', firstName: 'Juan', lastName: 'Perez' }));
    sessionStorage.setItem('role', 'student');
    vi.mocked(apiClient.get).mockResolvedValue([]);
    vi.mocked(coursesService.getCourses).mockResolvedValue([]);

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));

    await act(async () => {
      await result.current.openNew();
    });

    expect(result.current.view).toBe('new');
    expect(result.current.activeConversation).toBeNull();
  });

  it('should set error on send failure', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', firstName: 'Juan', lastName: 'Perez' }));
    sessionStorage.setItem('role', 'student');
    vi.mocked(apiClient.get).mockResolvedValue([]);
    vi.mocked(apiClient.put).mockResolvedValue({});
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Send error'));

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));

    await act(async () => {
      await result.current.selectConversation({
        id: 1,
        otherParticipant: { userId: '2', userFirstName: 'Ana', userLastName: 'Lopez', userRole: 'professor' },
        participants: [],
        lastMessage: null,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
      });
    });

    act(() => { result.current.setNewMessage('Hola'); });

    await act(async () => {
      await result.current.handleSend();
    });

    expect(result.current.error).toBe('Error al enviar mensaje');
  });

  it('should set error on startConversation failure', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', firstName: 'Juan', lastName: 'Perez' }));
    sessionStorage.setItem('role', 'student');
    vi.mocked(apiClient.get).mockResolvedValue([]);
    vi.mocked(apiClient.post).mockRejectedValue(new Error('Create error'));

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));

    await act(async () => {
      await result.current.startConversation({
        id: '99-8',
        firstName: 'Carlos',
        lastName: 'Mora',
        role: 'professor',
        context: 'Matemáticas',
      });
    });

    expect(result.current.error).toBe('Error al crear conversación');
  });

  it('should set error on loadContacts failure', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', firstName: 'Juan', lastName: 'Perez', courses: '3A' }));
    sessionStorage.setItem('role', 'student');
    vi.mocked(apiClient.get).mockResolvedValue([]);
    vi.mocked(coursesService.getCourses).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));

    await act(async () => {
      await result.current.openNew();
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Error al cargar contactos');
    });
  });

  it('should re-send listConversations after send', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', firstName: 'Juan', lastName: 'Perez' }));
    sessionStorage.setItem('role', 'student');
    vi.mocked(apiClient.get).mockResolvedValue([]);
    vi.mocked(apiClient.put).mockResolvedValue({});
    vi.mocked(apiClient.post).mockResolvedValue({ id: 10, content: 'Hola', senderId: '123-4' });

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));

    await act(async () => {
      await result.current.selectConversation({
        id: 1,
        otherParticipant: { userId: '2', userFirstName: 'Ana', userLastName: 'Lopez', userRole: 'professor' },
        participants: [],
        lastMessage: null,
        unreadCount: 0,
        createdAt: new Date().toISOString(),
      });
    });

    vi.mocked(apiClient.get).mockClear();
    act(() => { result.current.setNewMessage('Hola'); });

    await act(async () => {
      await result.current.handleSend();
    });

    expect(apiClient.get).toHaveBeenCalledWith('/messaging/conversations/123-4');
  });

  it('should set unreadCount to 0 on selectConversation', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', firstName: 'Juan', lastName: 'Perez' }));
    sessionStorage.setItem('role', 'student');
    vi.mocked(apiClient.get).mockResolvedValue([
      { id: 1, otherParticipant: { userId: '2', userFirstName: 'Ana', userLastName: 'Lopez', userRole: 'professor' }, participants: [], lastMessage: null, unreadCount: 3 },
    ]);
    vi.mocked(apiClient.put).mockResolvedValue({});

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));

    vi.mocked(apiClient.get).mockResolvedValue([]);

    await act(async () => {
      await result.current.selectConversation({
        id: 1,
        otherParticipant: { userId: '2', userFirstName: 'Ana', userLastName: 'Lopez', userRole: 'professor' },
        participants: [],
        lastMessage: null,
        unreadCount: 3,
        createdAt: new Date().toISOString(),
      });
    });

    expect(result.current.conversations[0].unreadCount).toBe(0);
  });

  it('should load contacts silently even if getStudentsByCourse returns no classmates for student', async () => {
    sessionStorage.setItem('user', JSON.stringify({ rut: '123-4', firstName: 'Juan', lastName: 'Perez', courses: '3A' }));
    sessionStorage.setItem('role', 'student');
    vi.mocked(apiClient.get).mockResolvedValue([]);
    vi.mocked(coursesService.getCourses).mockResolvedValue([
      { id: 1, name: '3A', level: 'Tercero', letter: 'A' },
    ]);
    vi.mocked(coursesService.getSubjectsByCourse).mockResolvedValue([
      { id: 10, subjectName: 'Matemáticas', professorRut: 't1', professorFirstName: 'María', professorLastName: 'López' },
    ]);
    vi.mocked(coursesService.getStudentsByCourse).mockResolvedValue([
      { rut: '123-4', firstName: 'Juan', lastName: 'Perez' },
    ]);

    const { result } = renderHook(() => useMessaging());
    await waitFor(() => expect(result.current.loadingConvs).toBe(false));

    await act(async () => {
      await result.current.openNew();
    });

    await waitFor(() => {
      expect(result.current.contacts.length).toBe(1);
    });
    expect(result.current.contacts[0].firstName).toBe('María');
  });
});
