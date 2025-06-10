'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import useSWR from 'swr'; // Import useSWR

// Define a fetcher function
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }
  return res.json();
};

function Page() {
  const [page, setPage] = useState(1);

  // Use useSWR to fetch questions
  // The key for SWR is the API endpoint, which changes with the page number
  const { data, error, isLoading } = useSWR(`/api/question?page=${page}`, fetcher);

  // Access the questions array from the fetched data
  const questions = data?.questions || [];

  if (error) return <div className="p-4 text-red-600">Failed to load questions: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">All Questions</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        questions.map((q, i) => (
          <Link key={q._id} href={`/superadmin/edit/${q._id}`}
> <div
            
            className="cursor-pointer p-4 border rounded-md mb-2 hover:bg-gray-100"
          >
            {i + 1}. {q.question.text}
          </div>
          </Link>
         
        ))
      )}

      {/* Pagination Controls */}
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={page === 1 || isLoading} // Disable during loading as well
        >
          Previous
        </button>
        <span className="font-medium text-gray-700">Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-blue-500 text-white rounded"
          disabled={isLoading} // Disable during loading
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Page;