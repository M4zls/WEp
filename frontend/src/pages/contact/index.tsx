import React, { FC, ReactElement } from 'react';

interface ContactItem {
  name: string;
  position: string;
  phone: string;
  email?: string;
}

const emergencias: ContactItem[] = [
  { name: 'Carabineros', position: 'Emergencias', phone: '133' },
  { name: 'Ambulancia', position: 'Emergencias', phone: '131' },
  { name: 'Bomberos', position: 'Emergencias', phone: '132' },
  { name: 'PDI', position: 'Emergencias', phone: '134' },
];

const colegio: { label: string; value: string }[] = [
  { label: 'Teléfono', value: '+56 2 2345 6789' },
  { label: 'Dirección', value: "Av. Libertador Bernardo O'Higgins 1234, Santiago" },
  { label: 'Horario', value: 'Lunes a Viernes, 08:00 - 17:00 hrs' },
];

const inspectores: ContactItem[] = [
  { name: 'Roberto Muñoz', position: 'Inspector General', phone: '+56 9 8765 4321', email: 'roberto.munoz@colegiobo.cl' },
  { name: 'Carolina Rivas', position: 'Inspectora de Piso', phone: '+56 9 7654 3210', email: 'carolina.rivas@colegiobo.cl' },
  { name: 'Felipe Soto', position: 'Inspector de Patio', phone: '+56 9 6543 2109', email: 'felipe.soto@colegiobo.cl' },
];

const secretarios: ContactItem[] = [
  { name: 'María José Torres', position: 'Secretaria Académica', phone: '+56 9 5432 1098', email: 'maria.torres@colegiobo.cl' },
  { name: 'Patricia Vega', position: 'Secretaria de Dirección', phone: '+56 9 4321 0987', email: 'patricia.vega@colegiobo.cl' },
];

const ContactCard: FC<{ item: ContactItem; color: string }> = ({ item, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow">
    <div className="flex items-start gap-3">
      <div className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
        {(item.name.charAt(0) || '') + (item.name.split(' ').pop()?.charAt(0) || '')}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-sm text-slate-800">{item.name}</p>
        <p className="text-xs text-slate-500 mb-1">{item.position}</p>
        <a href={`tel:${item.phone}`} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium block truncate">
          {item.phone}
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
              key={item.name}
              href={`tel:${item.phone}`}
              className="bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl p-4 text-center transition-colors"
            >
              <p className="text-2xl font-bold text-red-600">{item.phone}</p>
              <p className="text-sm font-medium text-red-700 mt-1">{item.name}</p>
              <p className="text-xs text-red-500">{item.position}</p>
            </a>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">Inspectores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {inspectores.map((item) => (
            <ContactCard key={item.name} item={item} color="bg-amber-500" />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">Secretarios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {secretarios.map((item) => (
            <ContactCard key={item.name} item={item} color="bg-purple-500" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
