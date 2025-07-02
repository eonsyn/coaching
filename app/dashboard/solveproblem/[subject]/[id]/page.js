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
   <div className="p-6 bg-background text-foreground font-puritan">
  <h1 className="text-2xl font-bold mb-6 text-highlight">
    {data.chapterTitle}
  </h1>

  <ul className="space-y-4">
    {data.questions.map((q) => (
      <li
        key={q._id}
        className="bg-card border border-[--gray-200] dark:border-[--color-highlight]/10 rounded-lg p-4 hover:shadow-md hover:-translate-y-1 transition-all"
      >
        <Link href={`/dashboard/question/${q._id}?subject=${subject}`}>
          <div className="text-base text-foreground hover:text-highlight transition-colors">
            <QuestionDisplay question={q.question.text} />
          </div>
        </Link>
      </li>
    ))}
  </ul>

  <div className="mt-8 flex items-center justify-between gap-4 text-sm max-w-md mx-auto">
    <button
      onClick={() => goToPage(page - 1)}
      disabled={page === 0}
      className="flex items-center gap-2 px-4 py-2 rounded-md bg-highlight text-white hover:brightness-110 disabled:opacity-50 transition"
    >
      <IoIosArrowBack className="text-lg" />
      <span>Previous</span>
    </button>

    <span className="text-textprimary opacity-80">
      Page {data.page + 1} of {data.totalPages}
    </span>

    <button
      onClick={() => goToPage(page + 1)}
      disabled={data.page + 1 >= data.totalPages}
      className="flex items-center gap-2 px-4 py-2 rounded-md bg-highlight text-white hover:brightness-110 disabled:opacity-50 transition"
    >
      <span>Next</span>
      <IoChevronForwardSharp className="text-lg" />
    </button>
  </div>
</div>


  );
}

export default Page;
