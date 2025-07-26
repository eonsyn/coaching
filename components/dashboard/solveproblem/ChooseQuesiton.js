import React from 'react'
import QuestionDisplay from '@/components/QuestionDisplay';
import Link from 'next/link';
import { IoChevronForwardSharp } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";

function ChooseQuesiton({ data, page, chapterId }) {
  const prevPage = page - 1;
  const nextPage = page + 1;
  const totalPages = data.totalPages;
  console.log("data is :", data)
  const statusColorMap = {
    correct: 'bg-green-600',
    incorrect: 'bg-red-600',
    unattempted: 'bg-gray-400',
  };
  return (
    <>
      {/* Chapter Title */}
      <h1 className="text-2xl font-bold mb-6 text-[var(--primary)] font-heading">
        {data.chapterTitle}
      </h1>

      {/* Question List */}
      <ul className="space-y-4">
        {data.questions.map((q) => (
          <li
            key={q._id}
            className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-lg p-4 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="flex items-center gap-2">
              <div
                title={q.status}
                className={`h-2 w-2 rounded-full ${statusColorMap[q.status] || 'bg-gray-300'}`}
              ></div>
              <span className="text-sm capitalize">{q.status}</span>
            </div>

            <Link href={`${chapterId}/${q._id}`}>
              <div className="text-base text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">
                <QuestionDisplay question={q.question.text} />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="mt-8 flex items-center justify-between gap-4 text-sm max-w-md mx-auto">
        {/* Previous Link */}
        {page > 0 ? (
          <Link
            href={`/dashboard/solveproblem/testsub/${chapterId}?page=${prevPage}`}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:brightness-110 transition"
          >
            <IoIosArrowBack className="text-lg" />
            <span>Previous</span>
          </Link>
        ) : (
          <span className="flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--muted)]/20 text-[var(--muted)] cursor-not-allowed">
            <IoIosArrowBack className="text-lg" />
            <span>Previous</span>
          </span>
        )}

        {/* Page Info */}
        <span className="text-[var(--muted)]">
          Page {page + 1} of {totalPages}
        </span>

        {/* Next Link */}
        {page + 1 < totalPages ? (
          <Link
            href={`/dashboard/solveproblem/testsub/${chapterId}?page=${nextPage}`}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--primary)] text-white hover:brightness-110 transition"
          >
            <span>Next</span>
            <IoChevronForwardSharp className="text-lg" />
          </Link>
        ) : (
          <span className="flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--muted)]/20 text-[var(--muted)] cursor-not-allowed">
            <span>Next</span>
            <IoChevronForwardSharp className="text-lg" />
          </span>
        )}
      </div>
    </>

  );
}

export default ChooseQuesiton;
