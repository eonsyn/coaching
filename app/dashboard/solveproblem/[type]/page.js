import Link from 'next/link';
import { FaCalculator, FaAtom, FaFlask } from 'react-icons/fa';

export default function ChooseSubjectPage({ params }) {
  const { type } = params;

  const subjects = [
    { name: 'Mathematics', icon: <FaCalculator size={40} /> },
    { name: 'Physics', icon: <FaAtom size={40} /> },
    { name: 'Chemistry', icon: <FaFlask size={40} /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold mb-6 text-[var(--primary)]">
        {type.charAt(0).toUpperCase() + type.slice(1)} - Choose a Subject
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {subjects.map((subject) => (
          <Link
            key={subject.name}
            href={`${type}/${subject.name}`}
            className="flex flex-col items-center justify-center bg-[var(--card-bg)] p-6 rounded-2xl shadow-sm border border-[var(--border-color)] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
          >
            <div className="text-4xl text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors duration-200">
              {subject.icon}
            </div>
            <p className="mt-4 text-lg font-semibold font-sans group-hover:text-[var(--accent)]">
              {subject.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
