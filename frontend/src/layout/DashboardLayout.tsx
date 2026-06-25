import React, { FC, ReactElement, useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import HomeView from '../pages/dashboard/home/index';
import ProfilePage from '../pages/profile/profile.page';
import MessagingPage from '../pages/messaging/index';
import ContactPage from '../pages/contact/index';
import GradesView from '../pages/grades/grades.view';
import ManageGradesView from '../pages/grades/manage-grades.view';
import NotificationsPage from '../pages/notifications/index';
import notificationsService from '../pages/notifications/notifications.service';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userData: { id?: number; nombre?: string; apellido?: string; email?: string } | null;
  role: 'estudiante' | 'profesor';
  onLogout: () => void;
  defaultSection?: string;
}

const wipSections: Record<string, { title: string; description: string }> = {
  messaging: {
    title: 'Mensajería',
    description: 'Bandeja de mensajes y conversaciones con profesores y alumnos.',
  },
  contact: {
    title: 'Contacto',
    description: 'Directorio de contactos y información institucional.',
  },
  profile: {
    title: 'Mi Perfil',
    description: 'Edita tu información personal y configura tu cuenta.',
  },
};

const subjectSections = ['courses', 'classes'];

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, userData, role, onLogout, defaultSection }): ReactElement => {
  const [selectedSection, setSelectedSection] = useState(defaultSection || 'home');
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    const usuarioId = userData?.id;
    if (!usuarioId) return;
    try {
      const result = await notificationsService.getUnreadCount(usuarioId);
      setUnreadCount(result.count);
    } catch {
      // silent
    }
  }, [userData?.id]);

  useEffect(() => {
    fetchUnread();
  }, [fetchUnread]);

  useEffect(() => {
    if (selectedSection === 'notifications') {
      fetchUnread();
    }
  }, [selectedSection, fetchUnread]);

  const getInitials = (): string => {
    if (!userData) return '?';
    const first = userData.nombre?.charAt(0) || '';
    const last = userData.apellido?.charAt(0) || '';
    return `${first}${last}`;
  };

  const userName = userData ? `${userData.nombre} ${userData.apellido}`.trim() : 'Usuario';

  const roleLabel = role === 'estudiante' ? 'Estudiante' : 'Profesor';

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        selectedSection={selectedSection}
        onSectionChange={setSelectedSection}
        onLogout={onLogout}
        userName={userName}
        userInitials={getInitials()}
        role={role}
        unreadCount={unreadCount}
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto py-8 px-6">
          {selectedSection === 'home' ? (
            <HomeView role={role} userData={userData} onGoToSubjects={() => setSelectedSection(role === 'estudiante' ? 'classes' : 'courses')} />
          ) : selectedSection === 'profile' ? (
            <ProfilePage userData={userData} role={role} />
          ) : selectedSection === 'messaging' ? (
            <MessagingPage />
          ) : selectedSection === 'contact' ? (
            <ContactPage />
          ) : selectedSection === 'grades' && role === 'estudiante' ? (
            <GradesView />
          ) : selectedSection === 'manage-grades' && role === 'profesor' ? (
            <ManageGradesView />
          ) : selectedSection === 'notifications' ? (
            <NotificationsPage />
          ) : subjectSections.includes(selectedSection) ? (
            children
          ) : (
            <WorkInProgress
              title={wipSections[selectedSection]?.title || 'Sección'}
              description={wipSections[selectedSection]?.description || 'Esta sección está en desarrollo.'}
            />
          )}
        </div>
      </main>
    </div>
  );
};

const WorkInProgress: FC<{ title: string; description: string }> = ({ title, description }): ReactElement => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center mb-6">
      <span className="text-4xl">🚧</span>
    </div>
    <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
    <p className="text-slate-500 text-center max-w-md">{description}</p>
    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium">
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      Work in progress
    </div>
  </div>
);

export default DashboardLayout;
