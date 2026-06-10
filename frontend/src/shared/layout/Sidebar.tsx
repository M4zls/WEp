import React, { FC, ReactElement } from 'react';

interface SidebarProps {
  selectedSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
  userName?: string;
  userInitials?: string;
  role?: 'estudiante' | 'profesor';
}

const baseNavItems = [
  { id: 'inicio', label: 'Inicio', icon: '🏠' },
  { id: 'notificaciones', label: 'Notificaciones', icon: '🔔' },
  { id: 'mensajeria', label: 'Mensajería', icon: '✉️' },
  { id: 'contacto', label: 'Contacto', icon: '📞' },
  { id: 'perfil', label: 'Perfil', icon: '👤' },
];

const getNavItems = (role?: string) => {
  const secondItem = role === 'estudiante'
    ? { id: 'clases', label: 'Clases', icon: '📚' }
    : { id: 'cursos', label: 'Cursos', icon: '📚' };
  return [baseNavItems[0], secondItem, ...baseNavItems.slice(1)];
};

const Sidebar: FC<SidebarProps> = ({ selectedSection, onSectionChange, onLogout, userName, userInitials, role }): ReactElement => {
  const navItems = getNavItems(role);
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {userInitials || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{userName || 'Usuario'}</p>
            <p className="text-xs text-slate-400">Portal Educativo</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const isActive = selectedSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all duration-200 border-l-4 ${
                isActive
                  ? 'bg-slate-800/50 text-emerald-400 border-emerald-400'
                  : 'text-slate-300 border-transparent hover:bg-slate-800/30 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-red-400 hover:bg-red-900/20 rounded-xl transition-all"
        >
          <span className="text-lg">🚪</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
