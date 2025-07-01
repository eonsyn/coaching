'use client';

import React from 'react';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import Link from 'next/link';
const fetcher = (url) => fetch(url).then((res) => res.json());
function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function Page() {
  const params = useParams();
  const subject = params.subject; // Optional lowercase

  const { data, error } = useSWR(`/api/subject/?subject=${subject}`, fetcher);
  // const { data, error } = useSWR(`/api/subject/?subject=${subject.toUpperCase()}`, fetcher);

  if (error) return <div>❌ Failed to load</div>;
  if (!data) return <div>⏳ Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Subject: {data.subject}</h1>
      <h2 className="text-xl mt-4 font-semibold">Chapters:</h2>
      <div className="list-disc pl-6 grid grid-cols-3 mt-2">
        {data.chapters.map((chapter, i) => (
        <Link href={`/dashboard/solveproblem/${data.subject}/${chapter._id}`}  key={i}>
        <div className='text-xl bg-slate-800 p-1 mb-0.5 mr-0.5 rounded-md h-20' key={i}>{chapter.title}
          <p>Question:{chapter.questionsCount}</p>
          {}
          </div>
        </Link>
          
        ))}
      </div>
    </div>
  );
}

export default Page;
