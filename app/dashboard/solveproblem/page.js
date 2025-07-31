'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Choosetype from '@/components/dashboard/solveproblem/Choosetype';
import ChooseSubject from '@/components/dashboard/solveproblem/ChooseSubject';

export default function SolveProblemPage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setTimeout(() => setStep(2), 300); // add delay for animation
  };

  const handleSubjectSelect = (subject) => {
     
    setSelectedSubject(subject);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Hamburger-style breadcrumb */}
      <div className="absolute top-6 left-6 text-sm font-medium text-[var(--text-secondary)]">
        <span className={step >= 1 ? 'text-[var(--primary)]' : ''}>› Type</span>
        <span className={step >= 2 ? 'text-[var(--primary)]' : 'text-gray-400'}> › Subject</span>
      </div>

      <div className="w-full max-w-xl overflow-hidden relative" style={{ minHeight: '300px' }}>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
        >
          {/* Step 1: Type */}
          <div className="w-full flex-shrink-0 p-4">
            <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-lg border border-[var(--border-color)]">
              <h2 className="text-2xl font-bold mb-4 text-[var(--primary)]">Choose Paper Type</h2>
              <Choosetype selected={selectedType} onSelect={handleTypeSelect} />
            </div>
          </div>

          {/* Step 2: Subject */}
          <div className="w-full flex-shrink-0 p-4">
            <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl shadow-lg border border-[var(--border-color)]">
              <h2 className="text-2xl font-bold mb-4 text-[var(--primary)]">Choose Subject</h2>
              <ChooseSubject type={selectedType} selected={selectedSubject} onSelect={handleSubjectSelect} />
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
}
