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
    
<div className="p-6">
  <h1 className="text-2xl font-bold text-primary">Subject: {data.subject}</h1>
  <h2 className="text-xl mt-4 font-semibold text-muted-foreground">Select Chapters:</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
    {data.chapters.map((chapter, i) => (
      <Link href={`/dashboard/solveproblem/${data.subject}/${chapter._id}`} key={i}>
        <div
          className="group p-4 h-24 bg-white dark:bg-card border border-border rounded-xl shadow-sm hover:shadow-lg hover:border-primary transition duration-200 ease-in-out cursor-pointer"
          title={chapter.title}
        >
          <div className="flex items-start gap-3">
            <IoIosBook className="text-primary mt-1 group-hover:scale-110 transition" size={24} />
            <div>
              <p className="text-base font-bold text-foreground">
                {trimText(chapter.title)}
              </p>
              <p className="text-sm text-muted-foreground">Total Questions: {chapter.questionsCount}</p>
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
