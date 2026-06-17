import React, { FC, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/store';
import DashboardLayout from '../../layout/DashboardLayout';
import CalificacionesView from './CalificacionesView';

const CalificacionesPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  return (
    <DashboardLayout userData={user} role="estudiante" onLogout={handleLogout}>
      <CalificacionesView />
    </DashboardLayout>
  );
};

export default CalificacionesPage;
