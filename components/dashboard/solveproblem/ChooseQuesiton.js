import React from 'react'
import QuestionDisplay from '@/components/QuestionDisplay';
import Link from 'next/link';
import { IoChevronForwardSharp } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";

function ChooseQuesiton({ data, page, chapterId }) {
  const prevPage = page - 1;
  const nextPage = page + 1;
  const totalPages = data.totalPages;

  return (
    <>
      <h1 className="text-2xl font-bold mb-6 text-highlight">
        {data.chapterTitle}
      </h1>

      <ul className="space-y-4">
        {data.questions.map((q) => (
          <li
            key={q._id}
            className="bg-card border border-[--gray-200] dark:border-[--color-highlight]/10 rounded-lg p-4 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <Link href={`/dashboard/question/${q._id}`}>
              <div className="text-base text-foreground hover:text-highlight transition-colors">
                <QuestionDisplay question={q.question.text} />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between gap-4 text-sm max-w-md mx-auto">
        {/* Previous Link */}
        {page > 0 ? (
          <Link
            href={`/dashboard/solveproblem/testsub/${chapterId}?page=${prevPage}`}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-highlight text-white hover:brightness-110 transition"
          >
            <IoIosArrowBack className="text-lg" />
            <span>Previous</span>
          </Link>
        ) : (
          <span className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-300 text-gray-500 cursor-not-allowed">
            <IoIosArrowBack className="text-lg" />
            <span>Previous</span>
          </span>
        )}

        <span className="text-textprimary opacity-80">
          Page {page + 1} of {totalPages}
        </span>

        {/* Next Link */}
        {page + 1 < totalPages ? (
          <Link
            href={`/dashboard/solveproblem/testsub/${chapterId}?page=${nextPage}`}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-highlight text-white hover:brightness-110 transition"
          >
            <span>Next</span>
            <IoChevronForwardSharp className="text-lg" />
          </Link>
        ) : (
          <span className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-300 text-gray-500 cursor-not-allowed">
            <span>Next</span>
            <IoChevronForwardSharp className="text-lg" />
          </span>
        )}
      </div>
    </>
  );
}

export default ChooseQuesiton;
