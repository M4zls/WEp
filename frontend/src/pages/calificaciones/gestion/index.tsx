import React, { FC, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store';
import DashboardLayout from '../../../layout/DashboardLayout';
import GestionNotasView from '../GestionNotasView';

const GestionNotasPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  return (
    <DashboardLayout userData={user} role="profesor" onLogout={handleLogout}>
      <GestionNotasView />
    </DashboardLayout>
  );
};

export default GestionNotasPage;
