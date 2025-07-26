// /app/[type]/[subject]/page.js

import React from 'react';
import Link from 'next/link';
import { IoIosBook } from 'react-icons/io';

const trimText = (text) => {
  const words = text.trim().split('');
  if (words.length <= 30) return text;
  return words.slice(0, 30).join('') + '...';
};

// Generate all static paths for ISR: [type]/[subject]
export async function generateStaticParams() {
  const subjects = ['Mathematics', 'Physics', 'Chemistry'];
  const types = ['mains', 'advance'];

  return subjects.flatMap(subject =>
    types.map(type => ({
      type,
      subject,
    }))
  );
}

export const revalidate = 60; // Revalidate every 60 seconds

async function Page({ params }) {
  const { type, subject } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/subject/?subject=${subject}&type=${type}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    return (
      <div className="p-6">
        <h1 className="text-red-500 text-lg">Something went wrong. Please try again.</h1>
      </div>
    );
  }

  const data = await res.json();

  return (
    <div className="px-6 bg-[var(--background)] text-[var(--foreground)] font-sans">
      {/* Heading */}
      <h2 className="text-xl font-semibold text-[var(--primary)] mb-4 font-heading">
        {data.subject} Chapters:
      </h2>

      {/* Chapter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
        {data.chapters.map((chapter, i) => (
          <Link href={`${subject}/${chapter._id}`} key={i}>
             
            <div
              className="group p-4 h-28 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
              title={chapter.title}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <IoIosBook
                  className="text-[var(--primary)] group-hover:text-[var(--accent)] transition-colors duration-200 mt-1"
                  size={26}
                />

                {/* Chapter Info */}
                <div>
                  <p className="text-base font-semibold group-hover:text-[var(--accent)] transition-colors">
                    {trimText(chapter.title)}
                  </p>
                  <p className="text-sm text-[var(--muted)] mt-1">
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
