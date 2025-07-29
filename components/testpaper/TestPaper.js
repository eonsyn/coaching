import React from 'react';
import RenderMathx from '@/components/RenderMathx';

function TestPaper({ questions, time, chapters, subject }) {

    return (
        <div className="p-6   text-black font-serif bg-white space-y-6">
            <div className="text-center space-y-1">
                <h1 className="text-2xl font-bold">Concept Learning Classes</h1>

                <div className='flex text-start justify-between '>
                    <div>
                        <p className=''><strong>Subject:</strong> {subject}</p>
                        <p><strong>Chapter:</strong> {chapters || 'N/A'}</p>
                    </div>

                    <p><strong>Duration:</strong> {time} minutes</p>
                </div>
            </div>
            <hr />
            <div className="space-y-6">
                {questions.map((q, idx) => (
                    <div key={idx} className="text-base leading-relaxed">
                        {/* Question line */}
                        {q.type === 'multiCorrect' && (
                            <span className="mr-2 px-2 py-1 text-white text-xs rounded bg-red-700 shrink-0">
                                MCQ Type
                            </span>
                        )}
                        <div className="flex mb-2">
                            <strong className="mr-2 shrink-0">Q{idx + 1}.</strong>
                            <RenderMathx text={q.question?.text} />
                        </div>

                        {/* Options with inline label and wrapped content */}
                        <div className="pl-6 space-y-1">
                            {q.options?.map((opt, i) => (
                                <div key={i} className="flex items-center">
                                    <span className="mr-2 shrink-0">{String.fromCharCode(65 + i)}.</span>
                                    <RenderMathx text={opt.text} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
}

export default TestPaper;
