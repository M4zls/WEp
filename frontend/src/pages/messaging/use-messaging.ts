import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../../api/apiClient';
import coursesService from '../courses/courses.service';
import type { Conversation, Message, Contact } from './messaging.types';

type View = 'conversations' | 'new';

export function useMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [view, setView] = useState<View>('conversations');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stored = sessionStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;
  const userId: string = user?.rut || '';
  const userFirstName: string = user?.firstName || '';
  const userLastName: string = user?.lastName || '';
  const userRole: string = sessionStorage.getItem('role') || '';

  const listConversations = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await apiClient.get(`/messaging/conversations/${userId}`);
      setConversations(data || []);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Error al cargar conversaciones');
    } finally {
      setLoadingConvs(false);
    }
  }, [userId]);

  const loadMessages = useCallback(async (conversationId: number) => {
    setLoadingMsgs(true);
    try {
      const data = await apiClient.get(`/messaging/messages/${conversationId}`);
      setMessages(data || []);
      await apiClient.put(`/messaging/messages/read/${conversationId}/${userId}`, {});
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Error al cargar mensajes');
    } finally {
      setLoadingMsgs(false);
    }
  }, [userId]);

  const selectConversation = useCallback(async (conv: Conversation) => {
    setActiveConversation(conv);
    setView('conversations');
    await loadMessages(conv.id);
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
    );
  }, [loadMessages]);

  const handleSend = useCallback(async () => {
    if (!newMessage.trim() || !activeConversation || !userId) return;
    setSending(true);
    try {
      const msg = await apiClient.post('/messaging/messages', {
        conversationId: activeConversation.id,
        senderId: userId,
        senderFirstName: userFirstName,
        senderLastName: userLastName,
        senderRole: userRole,
        content: newMessage.trim(),
      });
      setMessages((prev) => [...prev, msg]);
      setNewMessage('');
      listConversations();
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error al enviar mensaje');
    } finally {
      setSending(false);
    }
  }, [newMessage, activeConversation, userId, userFirstName, userLastName, userRole, listConversations]);

  const startConversation = useCallback(async (contact: Contact) => {
    try {
      const conv = await apiClient.post('/messaging/conversations', {
        participantIds: [userId, contact.id],
        participantFirstNames: [userFirstName, contact.firstName],
        participantLastNames: [userLastName, contact.lastName],
        participantRoles: [userRole, contact.role],
      });

      await listConversations();

      const convData: Conversation = {
        id: conv.id,
        otherParticipant: {
          userId: contact.id,
          userFirstName: contact.firstName,
          userLastName: contact.lastName,
          userRole: contact.role,
        },
        participants: [],
        lastMessage: null,
        unreadCount: 0,
        createdAt: conv.createdAt,
      };

      setActiveConversation(convData);
      setView('conversations');
      setMessages([]);
    } catch (err) {
      console.error('Error creating conversation:', err);
      setError('Error al crear conversación');
    }
  }, [userId, userFirstName, userLastName, userRole, listConversations]);

  const loadContacts = useCallback(async () => {
    setLoadingContacts(true);
    try {
      const list: Contact[] = [];

      if (userRole === 'student') {
        const cursos = await coursesService.getCourses();
        const courseName = user?.courses || '';
        const myCourse = cursos.find((c: any) => c.name === courseName);
        if (myCourse) {
          const subjects = await coursesService.getSubjectsByCourse(myCourse.id);
          for (const m of subjects) {
            if (m.professorRut && m.professorFirstName) {
              list.push({
                id: m.professorRut,
                firstName: m.professorFirstName,
                lastName: m.professorLastName || '',
                role: 'professor',
                context: `${m.subjectName} - ${myCourse.name}`,
              });
            }
          }
          const classmates = await coursesService.getStudentsByCourse(courseName);
          for (const c of classmates) {
            if (c.rut !== userId) {
              list.push({
                id: c.rut,
                firstName: c.firstName,
                lastName: c.lastName,
                role: 'student',
                context: myCourse.name,
              });
            }
          }
        }
      } else if (userRole === 'professor') {
        const professorRut = user?.rut;
        const cursos = await coursesService.getCourses();
        for (const c of cursos) {
          const subjects = await coursesService.getSubjectsByCourse(c.id);
          const mySubjects = subjects.filter((m: any) => m.professorRut === professorRut);
          if (mySubjects.length === 0) continue;

          const students = await coursesService.getStudentsByCourse(c.name);
          for (const est of students) {
            list.push({
              id: est.rut,
              firstName: est.firstName,
              lastName: est.lastName,
              role: 'student',
              context: `${c.name} - ${mySubjects.map((m: any) => m.subjectName).join(', ')}`,
            });
          }
        }
      }

      setContacts(list);
    } catch (err) {
      console.error('Error loading contacts:', err);
      setError('Error al cargar contactos');
    } finally {
      setLoadingContacts(false);
    }
  }, [userRole, user]);

  const openNew = useCallback(async () => {
    setView('new');
    setActiveConversation(null);
    await loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    listConversations();
  }, [listConversations]);

  useEffect(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (activeConversation) {
      pollingRef.current = setInterval(() => {
        loadMessages(activeConversation.id);
        listConversations();
      }, 5000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [activeConversation, loadMessages, listConversations]);

  return {
    conversations,
    activeConversation,
    messages,
    loadingConvs,
    loadingMsgs,
    error,
    newMessage,
    sending,
    view,
    contacts,
    loadingContacts,
    userId,
    setNewMessage,
    selectConversation,
    handleSend,
    startConversation,
    openNew,
    setView,
    setError,
  };
}
