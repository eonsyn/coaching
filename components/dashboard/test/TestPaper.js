'use client';

import React from 'react';
import RenderMathx from '@/components/RenderMathx';

function TestPaper({ questions = [] }) {
  const handleDownload = async () => {
    try {
      const res = await fetch('/api/generatepdf');
      if (!res.ok) throw new Error('Failed to generate PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'test-paper.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed:', error);
      alert('PDF generation failed.');
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
        >
          Download PDF
        </button>
      </div>

      {questions.map((q, i) => (
        <div key={q._id || i} className="border p-4 rounded shadow-sm bg-white mb-4">
          <p className="font-medium">
            Q{i + 1}: {q.question?.text ? <RenderMathx text={q.question?.text} /> : 'No text'}
          </p>
          {Array.isArray(q.options) && q.options.length > 0 && (
            <ul className="list-disc pl-6 mt-2">
              {q.options.map((opt, idx) => (
                <li key={idx}>
                  <RenderMathx text={opt.text} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default TestPaper;
