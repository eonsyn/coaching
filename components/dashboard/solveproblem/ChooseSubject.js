import React from 'react';
import { FaCalculator, FaAtom, FaFlask } from 'react-icons/fa';
import Link from 'next/link';
const subjects = [
  { name: 'Mathematics', icon: <FaCalculator size={32} /> },
  { name: 'Physics', icon: <FaAtom size={32} /> },
  { name: 'Chemistry', icon: <FaFlask size={32} /> },
];

export default function ChooseSubject({ type,selected, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {subjects.map(({ name, icon }) => {
        const value = name.toLowerCase();
        return (
          <Link href={`solveproblem/${type}/${name}`}>
          <button
            key={name}
            onClick={() => onSelect(name)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-medium transition ${
              selected === value
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'text-[var(--primary)] border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
            }`}
          >
            {icon}
            {name}
          </button></Link>
        );
      })}
    </div>
  );
}
