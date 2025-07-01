'use client';
import React from 'react';
import { FaCalculator, FaAtom, FaFlask } from 'react-icons/fa';
import Link from 'next/link';
function ChooseSubject() {
  const subjects = [
    {
      name: 'Mathematics',
      icon: <FaCalculator size={40} className="text-blue-500" />,
      color: 'border-blue-500 hover:bg-blue-100',
    },
    {
      name: 'Physics',
      icon: <FaAtom size={40} className="text-purple-500" />,
      color: 'border-purple-500 hover:bg-purple-100',
    },
    {
      name: 'Chemistry',
      icon: <FaFlask size={40} className="text-green-500" />,
      color: 'border-green-500 hover:bg-green-100',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-6">
      <h2 className="text-3xl font-bold mb-8">Choose a Subject</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        {subjects.map((subject) => (
          <Link key={subject.name} href={`/dashboard/solveproblem/${subject.name}`}>
          <div
            key={subject.name}
            className={`flex flex-col items-center p-6  border-2 rounded-2xl shadow-md transition-all duration-200 cursor-pointer ${subject.color}`}
          >
            {subject.icon}
            <p className="mt-4 text-xl font-semibold">{subject.name}</p>
          </div></Link>
        ))}
      </div>
    </div>
  );
}

export default ChooseSubject;
