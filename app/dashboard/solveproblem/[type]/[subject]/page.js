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
   <div className="px-6 py-8 bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans min-h-screen">
  {/* Heading */}
  <h2 className="text-2xl font-heading font-bold text-[var(--primary)] mb-6">
    {data.subject} Chapters:
  </h2>

  {/* Chapter Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {data.chapters.map((chapter, i) => (
      <Link href={`${subject}/${chapter._id}`} key={i}>
        <div
          className="group p-5 h-32 bg-[var(--bg-secondary)] border border-[var(--bg-accent)] rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer backdrop-blur-sm"
          title={chapter.title}
        >
          <div className="flex items-start gap-4">
            {/* Icon */}
            <IoIosBook
              className="text-[var(--primary)] group-hover:text-[var(--secondary)] transition-colors duration-200 mt-1"
              size={28}
            />

            {/* Chapter Info */}
            <div className="flex flex-col justify-between">
              <p className="text-lg font-semibold group-hover:text-[var(--secondary)] transition-colors line-clamp-1">
                {trimText(chapter.title)}
              </p>
              <p className="text-sm text-[var(--text-muted)] mt-1">
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
