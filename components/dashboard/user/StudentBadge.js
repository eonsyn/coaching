import React from 'react';

export default function StudentBadge() {
  const petals = Array.from({ length: 24 });

  return (
    <div className="relative flex flex-col items-center mt-10">
      {/* Ruffled petal border */}
      <div className="relative w-48 h-48">
        {petals.map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-8 bg-blue-600 rounded-b-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 15}deg) translate(0, -110%)`,
              transformOrigin: 'center',
            }}
          />
        ))}

        {/* Center circle */}
        <div className="absolute inset-4 bg-white rounded-full border-[6px] border-yellow-300 z-10 flex items-center justify-center text-center font-bold text-black p-4 text-sm leading-tight">
          STUDENT <br /> OF THE <br /> WEEK
        </div>
      </div>

      {/* Ribbons */}
      <div className="flex gap-2 mt-[-10px] z-0">
        <div className="w-6 h-28 bg-blue-600 clip-ribbon-left" />
        <div className="w-6 h-28 bg-blue-600 clip-ribbon-right" />
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .clip-ribbon-left {
          clip-path: polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%);
        }
        .clip-ribbon-right {
          clip-path: polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%);
        }
      `}</style>
    </div>
  );
}
