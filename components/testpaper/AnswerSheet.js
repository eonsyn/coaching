import React from 'react'
import RenderMathx from '@/components/RenderMathx'

function AnswerSheet({questions}) {
    console.log(questions);
  return (
  <div id="answer-section" className="mt-8">
  <h2 className="text-xl font-bold mb-4">Answer Sheet</h2>

  {questions.map((q, idx) => (
    <div key={q._id || idx} className="mb-4 text-sm leading-relaxed">
      <div className="flex items-start space-x-2">
        <span className="font-semibold shrink-0">Q{idx + 1}.</span>

        {/* Answer based on question type */}
        {q.type === 'singleCorrect' || q.type === 'multiCorrect' ? (
          <div className="flex flex-col">
             
            <ul className="list-disc ml-5">
              {q.options
                ?.filter(opt => opt.isCorrect)
                .map((opt, i) => (
                  <li key={i}>
                    {String.fromCharCode(65 + i)}. <RenderMathx text={opt.text} />
                  </li>
                ))}
            </ul>
          </div>
        ) : q.type === 'numerical' ? (
          <span className="text-green-700">
            Answer: <RenderMathx text={q.correctValue} />
          </span>
        ) : q.type === 'descriptive' ? (
          <div>
            <p className="text-green-700 font-medium">Answer:</p>
            <RenderMathx text={q.solution?.text} />
            {q.solution?.image && (
              <img
                src={q.solution.image}
                alt="Descriptive Solution"
                className="mt-2 max-w-xs border border-gray-300 rounded"
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  ))}
</div>


  )
}

export default AnswerSheet
