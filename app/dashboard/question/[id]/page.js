'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiArrowRightCircle } from 'react-icons/fi';
import { BsQuestionCircle } from 'react-icons/bs';
import QuestionCard from '@/components/dashboard/question/QuestionCard';
export default function QuestionPage() {
    const params = useParams();
      const id = params.id; // Optional lowercase
    
  const router = useRouter(); 
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
 const [rdata, setrdata] = useState(null)
  useEffect(() => {
    async function fetchQuestion() {
      const res = await fetch(`/api/subject/chapter/question/${id}`);
      const data = await res.json();
      setQuestion(data.question);
      setrdata(data)
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
      router.push(`/dashboard/question/${data?.nextQuestionId}`);
    } else {
      alert('No more questions in this subject.');
    }
  };     

  if (loading) return <div>Loading...</div>;
  if (!question) return <div>Question not found.</div>;

  return (
 <div className="px-6 py-4 max-w-4xl mx-auto bg-background text-foreground font-puritan">
  {/* Question Card */}
  <QuestionCard question={rdata.question} />

  {/* Navigation Button */}
  <div className="mt-8 flex justify-end">
    <Link href={`/dashboard/question/${rdata.nextQuestionId}`} passHref>
      <button
        className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-highlight text-white 
                   hover:brightness-110 shadow transition-all duration-200"
      >
        Next Question
        <FiArrowRightCircle className="text-xl" />
      </button>
    </Link>
  </div>
</div>


  );
}
