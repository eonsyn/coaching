// app/dashboard/solveproblem/[subject]/[id]/page.js
'use client';
import React from 'react';
import useSWR from 'swr';
import QuestionDisplay from '@/components/QuestionDisplay';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { IoChevronForwardSharp } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import QuesitonLoading from '@/components/dashboard/question/QuestionLoading';
const fetcher = (url) => fetch(url).then((res) => res.json());

function Page() {
  const params = useParams();
  const chapterId = params?.id; // 'id' is actually chapterId here
  const subject = params?.subject;

  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '0', 10);
  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    chapterId ? `/api/subject/chapter?chapterId=${chapterId}&page=${page}` : null,
    fetcher
  );

  const goToPage = (p) => {
    router.push(`/dashboard/solveproblem/${subject}/${chapterId}?page=${p}`);
  };

  if (error) return <div>❌ Failed to load</div>;
  if (isLoading || !data) return <QuesitonLoading/>;

  return (
   <div className="p-6">
  <h1 className="text-2xl font-bold mb-6 text-primary">
    {data.chapterTitle}
  </h1>

  <ul className="space-y-4">
    {data.questions.map((q) => (
      <li
        key={q._id}
        className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all"
      >
        <Link href={`/dashboard/question/${q._id}?subject=${subject}`}>
          <div className="text-base text-foreground hover:text-primary transition-colors">
            <QuestionDisplay question={q.question.text} />
          </div>
        </Link>
      </li>
    ))}
  </ul>

  <div className="mt-8 flex items-center justify-between text-sm max-w-md mx-auto">
    <button
      onClick={() => goToPage(page - 1)}
      disabled={page === 0}
      className="px-4 bg-highlight cursor-pointer py-2 rounded-md bg-muted text-muted-foreground hover:bg-accent disabled:opacity-50 transition"
    >
      <IoIosArrowBack/>  
    </button>

    <span className="text-muted-foreground">
      Page {data.page + 1} of {data.totalPages}
    </span>

    <button
      onClick={() => goToPage(page + 1)}
      disabled={data.page + 1 >= data.totalPages}
      className="px-4 bg-highlight cursor-pointer py-2 rounded-md bg-muted text-muted-foreground hover:bg-accent disabled:opacity-50 transition"
    ><IoChevronForwardSharp/>
    
    </button>
  </div>
</div>

  );
}

export default Page;
