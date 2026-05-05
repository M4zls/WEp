export default function CourseCard({ title, professor, info, extra }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{professor}</p>
      <p className="text-gray-500 mt-2">{info}</p>
      {extra && <div className="mt-2">{extra}</div>}
    </div>
  );
}
