// app/dashboard/question/[id]/page.js 
import QuestionCard from '@/components/dashboard/question/QuestionCard';

export async function generateStaticParams() {
  return []; // optional for ISR; useful for pre-rendering known questions
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

  if (!question) return <div> Question not found</div>;

  return (
    <div className="px-6 pb-4 max-w-4xl mx-auto bg-background text-foreground font-puritan">
      {/* Question Card */}
      <QuestionCard nextId={nextId} question={question} />

      
    </div>
  );
}
