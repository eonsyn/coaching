'use client';
import { useState } from 'react';
import TestGenerator from '@/components/dashboard/test/TestGenerator';
import RenderMathx from '@/components/RenderMathx';
import TestPaper from '@/components/dashboard/test/TestPaper';
export default function TestPage() {
  const [questions, setQuestions] = useState([]);

  return (
   <div className="max-w-4xl mx-auto p-6 sm:p-8 space-y-8 bg-card text-foreground rounded-2xl   border-lightblue/20 font-puritan">
  {/* Header */}
  <h1 className="text-2xl sm:text-3xl font-bold text-darkblue">
    Test Generator
  </h1>

  {/* Generator Form */}
  <TestGenerator setQuestions={setQuestions} />

  {/* Render Generated Questions */}
  {questions.length > 0 && (
    <div className="space-y-4 mt-8">
      <h2 className="text-xl font-semibold text-highlight">Generated Questions</h2>
      <TestPaper questions={questions} />
    </div>
  )}
</div>

  );
}
