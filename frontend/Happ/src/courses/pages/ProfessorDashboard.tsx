import React, { FC, ReactElement } from 'react';

const ProfessorDashboard: FC = (): ReactElement => {
  const role = sessionStorage.getItem('role');
  const userEmail = sessionStorage.getItem('userEmail');

  const handleLogout = (): void => {
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">
                {role === 'estudiante' ? '👨‍🎓' : '👨‍🏫'} {role}
              </span>
              <span className="text-gray-500">{userEmail}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Mis Cursos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Matemáticas 101</h3>
            <p className="text-gray-600">Estudiantes: 30</p>
            <p className="text-gray-500 mt-2">Próxima clase: Mañana 10:00</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Matemáticas 102</h3>
            <p className="text-gray-600">Estudiantes: 25</p>
            <p className="text-gray-500 mt-2">Próxima clase: Mañana 14:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorDashboard;
