import React, { FC, ReactElement } from 'react';

interface ContactItem {
  nombre: string;
  cargo: string;
  telefono: string;
  email?: string;
}

const emergencias: ContactItem[] = [
  { nombre: 'Carabineros', cargo: 'Emergencias', telefono: '133' },
  { nombre: 'Ambulancia', cargo: 'Emergencias', telefono: '131' },
  { nombre: 'Bomberos', cargo: 'Emergencias', telefono: '132' },
  { nombre: 'PDI', cargo: 'Emergencias', telefono: '134' },
];

const colegio: { label: string; value: string }[] = [
  { label: 'Teléfono', value: '+56 2 2345 6789' },
  { label: 'Dirección', value: "Av. Libertador Bernardo O'Higgins 1234, Santiago" },
  { label: 'Horario', value: 'Lunes a Viernes, 08:00 - 17:00 hrs' },
];

const inspectores: ContactItem[] = [
  { nombre: 'Roberto Muñoz', cargo: 'Inspector General', telefono: '+56 9 8765 4321', email: 'roberto.munoz@colegiobo.cl' },
  { nombre: 'Carolina Rivas', cargo: 'Inspectora de Piso', telefono: '+56 9 7654 3210', email: 'carolina.rivas@colegiobo.cl' },
  { nombre: 'Felipe Soto', cargo: 'Inspector de Patio', telefono: '+56 9 6543 2109', email: 'felipe.soto@colegiobo.cl' },
];

const secretarios: ContactItem[] = [
  { nombre: 'María José Torres', cargo: 'Secretaria Académica', telefono: '+56 9 5432 1098', email: 'maria.torres@colegiobo.cl' },
  { nombre: 'Patricia Vega', cargo: 'Secretaria de Dirección', telefono: '+56 9 4321 0987', email: 'patricia.vega@colegiobo.cl' },
];

const ContactCard: FC<{ item: ContactItem; color: string }> = ({ item, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
        {(item.nombre.charAt(0) || '') + (item.nombre.split(' ').pop()?.charAt(0) || '')}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-slate-800">{item.nombre}</p>
        <p className="text-xs text-slate-500 mb-1">{item.cargo}</p>
        <a href={`tel:${item.telefono}`} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium block truncate">
          {item.telefono}
        </a>
        {item.email && (
          <a href={`mailto:${item.email}`} className="text-xs text-blue-500 hover:text-blue-600 truncate block">
            {item.email}
          </a>
        )}
      </div>
    </div>
  </div>
);

const ContactPage: FC = (): ReactElement => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Contactos</h1>
        <p className="text-slate-500 text-sm mt-1">Contactos de emergencia e información institucional</p>
      </div>

      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white">
        <h2 className="text-lg font-bold mb-3">Colegio Bernando O'Higgins</h2>
        <div className="space-y-1.5 text-emerald-50 text-sm">
          {colegio.map((info) => (
            <p key={info.label}><span className="font-medium text-white">{info.label}:</span> {info.value}</p>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">Emergencias</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {emergencias.map((item) => (
            <a
              key={item.nombre}
              href={`tel:${item.telefono}`}
              className="bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl p-4 text-center transition-colors"
            >
              <p className="text-2xl font-bold text-red-600">{item.telefono}</p>
              <p className="text-sm font-medium text-red-700 mt-1">{item.nombre}</p>
              <p className="text-xs text-red-500">{item.cargo}</p>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">Inspectores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {inspectores.map((item) => (
            <ContactCard key={item.nombre} item={item} color="bg-amber-500" />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">Secretarios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {secretarios.map((item) => (
            <ContactCard key={item.nombre} item={item} color="bg-purple-500" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
