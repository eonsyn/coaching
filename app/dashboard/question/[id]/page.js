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
    <div className="px-6 pb-4 max-w-4xl mx-auto bg-background text-foreground font-puritan">
      {/* Question Card */}
      <div className="p-6 rounded-2xl shadow-xl w-full bg-card transition-all border border-lightblue">
        <div className="mb-4 font-semibold text-lg text-foreground">
          <RenderMathx text={question.question.text} />
        </div>
        <QuestionCard preId={preId}  nextId={nextId} question={question} />
      </div>

    </div>
  );
}
