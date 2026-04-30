import { useNavigate } from 'react-router-dom';

export default function RoleSelection() {
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    // Guardar el rol seleccionado en sessionStorage
    sessionStorage.setItem('selectedRole', role);
    // Navegar al login con el rol
    navigate('/login', { state: { role } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-sky-500 flex flex-col justify-center items-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Bienvenido</h1>
          <p className="text-xl text-gray-100">Selecciona tu rol para continuar</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card Estudiante */}
          <button
            onClick={() => handleRoleSelect('estudiante')}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747 0-6.002-4.5-10.747-10-10.747z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Estudiante</h2>
              <p className="text-gray-600 text-center mb-6">
                Accede como estudiante para ver tus cursos y calificaciones
              </p>
              <span className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold">
                Continuar
              </span>
            </div>
          </button>

          {/* Card Profesor */}
          <button
            onClick={() => handleRoleSelect('profesor')}
            className="bg-white rounded-lg shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Profesor</h2>
              <p className="text-gray-600 text-center mb-6">
                Accede como profesor para gestionar tus cursos
              </p>
              <span className="inline-block bg-green-500 text-white px-6 py-2 rounded-lg font-semibold">
                Continuar
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
