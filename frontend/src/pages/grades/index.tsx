import React, { FC, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/store';
import DashboardLayout from '../../layout/DashboardLayout';
import GradesView from './grades.view';
import ManageGradesView from './manage-grades.view';

const GradesPage: FC = (): ReactElement => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const storeRole = useAuthStore((s) => s.role);
  const sessionRole = sessionStorage.getItem('role');
  const sessionUser = sessionStorage.getItem('user');
  const role = sessionUser ? sessionRole : storeRole;

  const handleLogout = (): void => {
    logout();
    navigate('/');
  };

  if (role === 'profesor') {
    return (
      <DashboardLayout userData={user} role="profesor" onLogout={handleLogout}>
        <ManageGradesView />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userData={user} role="estudiante" onLogout={handleLogout}>
      <GradesView />
    </DashboardLayout>
  );
};

export default GradesPage;
