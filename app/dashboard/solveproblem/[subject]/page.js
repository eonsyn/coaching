import React from 'react';
import Link from 'next/link';
import { IoIosBook } from "react-icons/io";

// Helper to trim text
const trimText = (text) => {
  const words = text.trim().split('');
  if (words.length <= 30) return text;
  return words.slice(0, 30).join('') + '...';
};

export async function generateStaticParams() {
  return [
    { subject: 'Mathematics' },
    { subject: 'Physics' },
    { subject: 'Chemistry' },
  ];
}

export const revalidate = 60; // ISR: Revalidate every 60 seconds

async function Page({ params }) {
  const subject = params.subject;

  const res = await fetch(`${process.env.BASE_URL}/api/subject/?subject=${subject}`, {
    next: { revalidate: 60 }, // ISR setup
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json();

  return (
    <div className="px-6 bg-background text-foreground font-puritan">
      
      <h2 className="text-xl  font-semibold text-textprimary">{data.subject} Chapters:</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {data.chapters.map((chapter, i) => (
          <Link href={`/dashboard/solveproblem/${data.subject}/${chapter._id}`} key={i}>
            <div
              className="group p-4 h-28 bg-card border border-[--gray-200] dark:border-[--color-highlight]/10 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              title={chapter.title}
            >
              <div className="flex items-start gap-4">
                <IoIosBook
                  className="text-darkblue group-hover:text-highlight transition-transform duration-200 mt-1"
                  size={26}
                />
                <div>
                  <p className="text-base font-bold text-foreground group-hover:text-highlight transition-colors">
                    {trimText(chapter.title)}
                  </p>
                  <p className="text-sm text-textprimary opacity-80 mt-1">
                    Total Questions: {chapter.questionsCount}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Page;
