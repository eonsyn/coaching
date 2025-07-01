'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import RenderMathx from '@/components/RenderMathx';
import QuestionCard from '@/components/dashboard/question/QuestionCard';
export default function QuestionPage() {
    const params = useParams();
      const id = params.id; // Optional lowercase
    
  const router = useRouter(); 
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuestion() {
      const res = await fetch(`/api/subject/chapter/question/${id}`);
      const data = await res.json();
      setQuestion(data);
      setLoading(false);
    }
    fetchQuestion();
  }, [id]);

  const handleNext = async () => {
    const res = await fetch('/api/subject/chapter/question/next', {
      method: 'POST',
      body: JSON.stringify({ currentQuestionId: id }),
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.nextQuestionId) {
      router.push(`/dashboard/question/${data.nextQuestionId}`);
    } else {
      alert('No more questions in this subject.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!question) return <div>Question not found.</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Question Viewer</h1>
      <QuestionCard question={question}/>
      
      {/* <pre>
        {JSON.stringify(question, null, 2)}
      </pre> */}
      <button
        onClick={handleNext}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Next Question →
      </button>
    </div>
  );
}
