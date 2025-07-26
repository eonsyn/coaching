import Link from 'next/link';

export default function ChooseTypePage() {
  const types = ['Mains', 'Advance'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold mb-8 text-[var(--primary)]">Choose Paper Type</h1>

      <div className="flex flex-wrap gap-6">
        {types.map((type) => (
          <Link
            key={type}
            href={`solveproblem/${type.toLowerCase()}`}
            className="px-6 py-3 border-2 rounded-full text-lg font-semibold hover:bg-[var(--primary)] hover:text-white transition-all duration-200"
          >
            {type}
          </Link>
        ))}
      </div>
    </div>
  );
}
