'use client';

import React, { useEffect, useState } from 'react';
import QuestionCard from '@/components/dashboard/question/QuestionCard';
import RenderMathx from '@/components/RenderMathx';
function Page({ params }) {
    const { subject,type, id: chapterId, questionId } = params;

    const [questionData, setQuestionData] = useState(null);
    const [loading, setLoading] = useState(true);
const url = `/dashboard/solveproblem/${type}/${subject}/${chapterId}`;
    useEffect(() => {
        async function fetchQuestion() {
            try {
                const res = await fetch(`/api/subject/chapter/question/${questionId}?type=${type}&chapterId=${chapterId}`);
                const data = await res.json();
                setQuestionData(data);
            } catch (err) {
                console.error("Failed to fetch question:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchQuestion();
    }, [type, chapterId, questionId]);

    if (loading) return <p>Loading...</p>;
    if (!questionData || questionData.error) return <p>Error: {questionData?.error || 'Unknown error'}</p>;

    const { question, chapterTitle, nextQuestionId, previousQuestionId } = questionData;

    return (
        <div className="px-6 pb-4 max-w-4xl mx-auto bg-[var(--background)] text-[var(--foreground)] font-sans">
  {/* Question Card */}
  <div className="p-6 rounded-2xl shadow-xl w-full bg-[var(--card-bg)] transition-all border border-[var(--border-color)]">
    
            <div className="mb-4 font-semibold text-lg text-[var(--foreground)] space-y-2">
                <RenderMathx text={question.question.text} />

                {/* Previous Year Papers */}
                {question.previousYearPapers?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {question.previousYearPapers.map((p) => (
                            <span
                                key={p.title}
                                className="text-sm px-3 py-1 border border-[var(--border-color)] bg-[var(--muted-bg)] text-[var(--muted)] rounded-full"
                            >
                                {p.title}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <QuestionCard url={url} preId={previousQuestionId} nextId={nextQuestionId} question={questionData.question} />
        </div></div>
    );
}

export default Page;
