import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../../api/apiClient';
import coursesService from '../courses/courses.service';
import type { Conversation, Message, Contact } from './messaging.types';

type Vista = 'conversaciones' | 'nuevo';

export function useMessaging() {
  const [conversaciones, setConversationes] = useState<Conversation[]>([]);
  const [conversacionActiva, setConversationActiva] = useState<Conversation | null>(null);
  const [mensajes, setMessages] = useState<Message[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [vista, setVista] = useState<Vista>('conversaciones');
  const [contactos, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stored = sessionStorage.getItem('user');
  const user = stored ? JSON.parse(stored) : null;
  const usuarioId: string = user?.rut || '';
  const usuarioNombre: string = user?.nombre || '';
  const usuarioApellido: string = user?.apellido || '';
  const usuarioRol: string = sessionStorage.getItem('role') || '';

  const listarConversationes = useCallback(async () => {
    if (!usuarioId) return;
    try {
      const data = await apiClient.get(`/messaging/conversaciones/${usuarioId}`);
      setConversationes(data || []);
    } catch (err) {
      console.error('Error al cargar conversaciones:', err);
      setError('Error al cargar conversaciones');
    } finally {
      setLoadingConvs(false);
    }
  }, [usuarioId]);

  const cargarMessages = useCallback(async (conversacionId: number) => {
    setLoadingMsgs(true);
    try {
      const data = await apiClient.get(`/messaging/mensajes/${conversacionId}`);
      setMessages(data || []);
      await apiClient.put(`/messaging/mensajes/leer/${conversacionId}/${usuarioId}`);
    } catch (err) {
      console.error('Error al cargar mensajes:', err);
      setError('Error al cargar mensajes');
    } finally {
      setLoadingMsgs(false);
    }
  }, [usuarioId]);

  const seleccionarConversation = useCallback(async (conv: Conversation) => {
    setConversationActiva(conv);
    setVista('conversaciones');
    await cargarMessages(conv.id);
    setConversationes((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, noLeidos: 0 } : c))
    );
  }, [cargarMessages]);

  const handleEnviar = useCallback(async () => {
    if (!nuevoMensaje.trim() || !conversacionActiva || !usuarioId) return;
    setEnviando(true);
    try {
      const msg = await apiClient.post('/messaging/mensajes', {
        conversacionId: conversacionActiva.id,
        remitenteId: usuarioId,
        remitenteNombre: usuarioNombre,
        remitenteApellido: usuarioApellido,
        remitenteRol: usuarioRol,
        contenido: nuevoMensaje.trim(),
      });
      setMessages((prev) => [...prev, msg]);
      setNuevoMensaje('');
      listarConversationes();
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setError('Error al enviar mensaje');
    } finally {
      setEnviando(false);
    }
  }, [nuevoMensaje, conversacionActiva, usuarioId, usuarioNombre, usuarioApellido, usuarioRol, listarConversationes]);

  const iniciarConversation = useCallback(async (contacto: Contact) => {
    try {
      const conv = await apiClient.post('/messaging/conversaciones', {
        participanteIds: [usuarioId, contacto.id],
        participanteNombres: [usuarioNombre, contacto.nombre],
        participanteApellidos: [usuarioApellido, contacto.apellido],
        participanteRoles: [usuarioRol, contacto.rol],
      });

      await listarConversationes();

      const convData: Conversation = {
        id: conv.id,
        otherParticipant: {
          usuarioId: contacto.id,
          usuarioNombre: contacto.nombre,
          usuarioApellido: contacto.apellido,
          usuarioRol: contacto.rol,
        },
        participantes: [],
        ultimoMensaje: null,
        noLeidos: 0,
        createdAt: conv.createdAt,
      };

      setConversationActiva(convData);
      setVista('conversaciones');
      setMessages([]);
    } catch (err) {
      console.error('Error al crear conversación:', err);
      setError('Error al crear conversación');
    }
  }, [usuarioId, usuarioNombre, usuarioApellido, usuarioRol, listarConversationes]);

  const cargarContacts = useCallback(async () => {
    setLoadingContacts(true);
    try {
      const lista: Contact[] = [];

      if (usuarioRol === 'estudiante') {
        const cursos = await coursesService.getCourses();
        const cursoNombre = user?.cursos || '';
        const miCurso = cursos.find((c: any) => c.nombre === cursoNombre);
        if (miCurso) {
          const materias = await coursesService.getSubjectsByCourse(miCurso.id);
          for (const m of materias) {
            if (m.profesorRut && m.profesorNombre) {
              lista.push({
                id: m.profesorRut,
                nombre: m.profesorNombre,
                apellido: m.profesorApellido || '',
                rol: 'profesor',
                contexto: `${m.asignaturaNombre} - ${miCurso.nombre}`,
              });
            }
          }
          const companeros = await coursesService.getStudentsByCourse(cursoNombre);
          for (const c of companeros) {
            if (c.rut !== usuarioId) {
              lista.push({
                id: c.rut,
                nombre: c.nombre,
                apellido: c.apellido,
                rol: 'estudiante',
                contexto: miCurso.nombre,
              });
            }
          }
        }
      } else if (usuarioRol === 'profesor') {
        const profesorRut = user?.rut;
        const cursos = await coursesService.getCourses();
        for (const c of cursos) {
          const materias = await coursesService.getSubjectsByCourse(c.id);
          const misMaterias = materias.filter((m: any) => m.profesorRut === profesorRut);
          if (misMaterias.length === 0) continue;

          const estudiantes = await coursesService.getStudentsByCourse(c.nombre);
          for (const est of estudiantes) {
            lista.push({
              id: est.rut,
              nombre: est.nombre,
              apellido: est.apellido,
              rol: 'estudiante',
              contexto: `${c.nombre} - ${misMaterias.map((m: any) => m.asignaturaNombre).join(', ')}`,
            });
          }
        }
      }

      setContacts(lista);
    } catch (err) {
      console.error('Error al cargar contactos:', err);
      setError('Error al cargar contactos');
    } finally {
      setLoadingContacts(false);
    }
  }, [usuarioRol, user]);

  const abrirNuevo = useCallback(async () => {
    setVista('nuevo');
    setConversationActiva(null);
    await cargarContacts();
  }, [cargarContacts]);

  useEffect(() => {
    listarConversationes();
  }, [listarConversationes]);

  useEffect(() => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    if (conversacionActiva) {
      pollingRef.current = setInterval(() => {
        cargarMessages(conversacionActiva.id);
        listarConversationes();
      }, 5000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [conversacionActiva, cargarMessages, listarConversationes]);

  return {
    conversaciones,
    conversacionActiva,
    mensajes,
    loadingConvs,
    loadingMsgs,
    error,
    nuevoMensaje,
    enviando,
    vista,
    contactos,
    loadingContactos: loadingContacts,
    usuarioId,
    setNuevoMensaje,
    seleccionarConversacion: seleccionarConversation,
    handleEnviar,
    iniciarConversacion: iniciarConversation,
    abrirNuevo,
    setVista,
    setError,
  };
}
