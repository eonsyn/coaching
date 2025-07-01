// app/dashboard/solveproblem/[subject]/[id]/page.js
'use client';
import React from 'react';
import useSWR from 'swr';
import QuestionDisplay from '@/components/QuestionDisplay';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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
  if (isLoading || !data) return <div>⏳ Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">{data.chapterTitle}</h1>

      <ul className="list-disc ml-5 space-y-1">
        {data.questions.map((q) => (
          <li key={q._id}>
            <Link href={`/dashboard/question/${q._id}?subject=${subject}`}>
              <QuestionDisplay question={q.question.text} />
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between max-w-md text-sm">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 0}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          ⬅ Prev
        </button>

        <span>Page {data.page + 1} of {data.totalPages}</span>

        <button
          onClick={() => goToPage(page + 1)}
          disabled={data.page + 1 >= data.totalPages}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>
    </div>
  );
}

export default Page;
