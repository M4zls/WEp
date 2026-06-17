import React, { FC, ReactElement, useState } from 'react';
import Sidebar from './Sidebar';
import HomeView from '../pages/dashboard/home/index';
import PerfilPage from '../pages/perfil/index';
import MensajeriaPage from '../pages/mensajeria/index';
import CalificacionesView from '../pages/calificaciones/CalificacionesView';
import GestionNotasView from '../pages/calificaciones/GestionNotasView';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userData: { nombre?: string; apellido?: string; email?: string } | null;
  role: 'estudiante' | 'profesor';
  onLogout: () => void;
  defaultSection?: string;
}

const wipSections: Record<string, { title: string; description: string }> = {
  notificaciones: {
    title: 'Notificaciones',
    description: 'Aquí podrás ver tus notificaciones y alertas.',
  },
  mensajeria: {
    title: 'Mensajería',
    description: 'Bandeja de mensajes y conversaciones con profesores y alumnos.',
  },
  contacto: {
    title: 'Contacto',
    description: 'Directorio de contactos y información institucional.',
  },
  perfil: {
    title: 'Mi Perfil',
    description: 'Edita tu información personal y configura tu cuenta.',
  },
};

const subjectSections = ['cursos', 'clases'];

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, userData, role, onLogout, defaultSection }): ReactElement => {
  const [selectedSection, setSelectedSection] = useState(defaultSection || 'inicio');

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
      />

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto py-8 px-6">
          {selectedSection === 'inicio' ? (
            <HomeView role={role} userData={userData} onGoToSubjects={() => setSelectedSection(role === 'estudiante' ? 'clases' : 'cursos')} />
          ) : selectedSection === 'perfil' ? (
            <PerfilPage userData={userData} role={role} />
          ) : selectedSection === 'mensajeria' ? (
            <MensajeriaPage />
          ) : selectedSection === 'calificaciones' && role === 'estudiante' ? (
            <CalificacionesView />
          ) : selectedSection === 'gestion-notas' && role === 'profesor' ? (
            <GestionNotasView />
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
