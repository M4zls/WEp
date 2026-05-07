import React, { FC, ReactElement,useState } from 'react';
import { useNavigate } from 'react-router-dom';




const RoleSelection: FC = (): ReactElement => {
  const navigate = useNavigate();
  const [hoveredRole, setHoverRole] = useState<'estudiante' | 'profesor' | null>(null);

  const handleRoleSelect = (role: 'estudiante' | 'profesor'): void => {
    sessionStorage.setItem('selectedRole', role);
    navigate('/login', { state: { role } });
  };

  return (
  <div className="relative min-h-screen overflow-hidden">
     
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-800 to-blue-950">
        {/* Background principal */}
      </div>
      <div className="absolute inset-0" aria-label="Logo">
        <img src={require('../../shared/assets/bernardo.jpg')} alt="logo" className="absolute top-0 left-0 size-28 object-cover opacity-50" />
      </div>

      

      {/* CONTENEDOR PRINCIPAL  */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* ENCABEZADO */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">
              Bienvenido al Colegio Bernando O'higgins
            </h1>
            <p className="text-xl text-purple-200">
              Selecciona tu usuario
            </p>
          </div>

          {/* GRID CON LAS DOS TARJETAS */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* TARJETA ESTUDIANTE */}
            <button
              onClick={() => handleRoleSelect('estudiante')}
              onMouseEnter={() => setHoverRole('estudiante')}
              onMouseLeave={() => setHoverRole(null)}
              className={`relative group h-80 rounded-3xl overflow-hidden transform transition-all duration-300 ${
                hoveredRole === 'estudiante' ? 'scale-105 shadow-2xl' : 'shadow-xl'
              }`}
            >
              {/* BACKGROUND DE LA TARJETA */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-900 opacity-90"></div>
              
              {/* OVERLAY INTERACTIVO */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* CONTENIDO DE LA TARJETA */}
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                {/* EMOJI/ICONO GRANDE */}
                <div className={`text-8xl mb-6 transition-transform duration-300 ${
                  hoveredRole === 'estudiante' ? 'scale-125' : 'group-hover:scale-110'
                }`}>
                  
                  <img src={require('../../shared/assets/perroasustao.jpg')} alt="Estudiante" className="w-24 h-24 rounded-full object-cover" />
                </div>

                {/* TÍTULO */}
                <h3 className="text-4xl font-bold text-white mb-3">
                  Estudiante
                </h3>

                {/* BOTÓN CALL TO ACTION */}
                <div className="inline-flex items-center gap-2 text-blue-200 font-semibold group-hover:text-white transition-colors">
                  Continuar
                  <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </button>

            {/* TARJETA PROFESOR */}
            <button
              onClick={() => handleRoleSelect('profesor')}
              onMouseEnter={() => setHoverRole('profesor')}
              onMouseLeave={() => setHoverRole(null)}
              className={`relative group h-80 rounded-3xl overflow-hidden transform transition-all duration-300 ${
                hoveredRole === 'profesor' ? 'scale-105 shadow-2xl' : 'shadow-xl'
              }`}
            >
              {/* BACKGROUND VERDE */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-900 opacity-90"></div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                <div className={`text-8xl mb-6 transition-transform duration-300 ${
                  hoveredRole === 'profesor' ? 'scale-125' : 'group-hover:scale-110'
                }`}>
                  <img src={require('../../shared/assets/perrown.jpeg')} alt="Profesor" className="w-24 h-24 rounded-full object-cover" />
                </div>

                <h3 className="text-4xl font-bold text-white mb-3">
                  Profesor
                </h3>

                

                <div className="inline-flex items-center gap-2 text-emerald-200 font-semibold group-hover:text-white transition-colors">
                  Continuar
                  <span className="transform group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RoleSelection;
