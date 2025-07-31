import React from 'react';

export default function Choosetype({ selected, onSelect }) {
  const types = ['Mains', 'Advance'];

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {types.map((type) => {
        const value = type.toLowerCase();
        return (
          <button
            key={type}
            onClick={() => onSelect(value)}
            className={`px-6 py-3 rounded-full border-2 font-semibold transition-all duration-300 ${
              selected === value
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'text-[var(--primary)] border-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
            }`}
          >
            {type}
          </button>
        );
      })}
    </div>
  );
}
