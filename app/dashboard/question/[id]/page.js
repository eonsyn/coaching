// app/dashboard/question/[id]/page.js 
import React from 'react';
import QuestionCard from '@/components/dashboard/question/QuestionCard';

import RenderMathx from '@/components/RenderMathx';
export async function generateStaticParams() {
  return [
    {
      id: '68614d894486bcd1ca73ce8c', // ✅ ID should be a string
    },
  ];
}


export const revalidate = 60; // Enable ISR (regenerates after 60 seconds)

export default async function QuestionPage({ params }) {
  const id = params.id;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/subject/chapter/question/${id}`, {
    next: { revalidate: 60 }, // required for ISR or SSR caching
  });

  if (!res.ok) {
    return <div> Failed to load question</div>;
  }

  const data = await res.json();
  const question = data.question;
  const nextId = data.nextQuestionId;
  const preId = data.previousQuestionId;
  if (!question) return <div> Question not found</div>;

  return (
   <div className="px-6 pb-4 max-w-4xl mx-auto bg-[var(--background)] text-[var(--foreground)] font-sans">
  {/* Question Card */}
  <div className="p-6 rounded-2xl shadow-xl w-full bg-[var(--card-bg)] transition-all border border-[var(--border-color)]">
    
    {/* Question Text */}
    <div className="mb-4 font-semibold text-lg text-[var(--foreground)] space-y-2">
      <RenderMathx text={question.question.text} />

      {/* Previous Year Papers */}
      {question.previousYearPapers?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {question.previousYearPapers.map((p) => (
            <span
              key={p.title}
              className="text-sm px-3 py-1 border border-[var(--border-color)] bg-[var(--muted-bg)] text-[var(--muted)] rounded-full"
            >
              {p.title}
            </span>
          ))}
        </div>
      )}
    </div>

    {/* Options / Input / Answer UI */}
    <QuestionCard preId={preId} nextId={nextId} question={question} />
  </div>
</div>

  );
}
