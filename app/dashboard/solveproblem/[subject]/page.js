'use client';

import React from 'react';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { IoIosBook } from "react-icons/io";
const fetcher = (url) => fetch(url).then((res) => res.json());
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function Page() {
  const params = useParams();
  const subject = params.subject; // Optional lowercase

  const { data, error } = useSWR(`/api/subject/?subject=${subject}`, fetcher);
  // const { data, error } = useSWR(`/api/subject/?subject=${subject.toUpperCase()}`, fetcher);
const trimText = (text) => {
  const words = text.trim().split(''); // Split by whitespace
  if (words.length <= 30) return text;     // Return full text if 5 words or less
  
  return words.slice(0, 30).join('') + '...';
};

  if (error) return <div>❌ Failed to load</div>;
  if (!data) return <div>⏳ Loading...</div>;

  return (
   <div className="p-6 bg-background text-foreground font-puritan">
  <h1 className="text-2xl font-bold text-highlight">Subject: {data.subject}</h1>
  <h2 className="text-xl mt-4 font-semibold text-textprimary">Select Chapters:</h2>

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
