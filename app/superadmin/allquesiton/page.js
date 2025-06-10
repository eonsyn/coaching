'use client';

import { useEffect, useState } from 'react';

const PAGE_LIMIT = 20;

export default function AllQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async (pageNum = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/question?page=${pageNum}&limit=${PAGE_LIMIT}`);
      const data = await res.json();

      setQuestions(data.questions || []);
      setHasMore(data.questions.length === PAGE_LIMIT);
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions(page);
  }, [page]);

  const handlePrev = () => {
    if (page > 1) setPage(p => p - 1);
  };

  const handleNext = () => {
    if (hasMore) setPage(p => p + 1);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q._id} className="border rounded p-3 shadow-sm bg-white">
            <div className="font-semibold">{q.question.text}</div>
            {q.options?.option1?.text && (
              <ul className="list-disc pl-6 mt-1 text-sm">
                {Object.entries(q.options).map(([key, val]) => (
                  <li key={key}>{val.text}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm mt-2 text-gray-600">Page {page}</span>
        <button
          onClick={handleNext}
          disabled={!hasMore}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {loading && <div className="text-center mt-4 text-sm text-gray-500">Loading...</div>}
    </div>
  );
}
