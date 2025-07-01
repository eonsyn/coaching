'use client';
import { useState } from 'react'; 
import RenderMathx from '@/components/RenderMathx';
export default function QuestionCard({ question }) {
  const [selected, setSelected] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSingleSelect = (index) => {
    setSelected([index]);
  };

  const handleMultiSelect = (index) => {
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      setSelected([...selected, index]);
    }
  };

  const handleCheckAnswer = () => {
    let correct = false;
    if (question.type === 'singleCorrect') {
      const correctIndex = question.options.findIndex((o) => o.isCorrect);
      correct = selected[0] === correctIndex;
    } else if (question.type === 'multiCorrect') {
      const correctIndices = question.options
        .map((o, i) => (o.isCorrect ? i : null))
        .filter((i) => i !== null);
      correct = selected.sort().toString() === correctIndices.sort().toString();
    } else if (question.type === 'numerical') {
      correct = userInput.trim() === question.correctValue?.toString().trim();
    } else if (question.type === 'descriptive') {
      correct = true; // Always accept, subjective
    }
    setIsCorrect(correct);
    setIsChecked(true);
  };

  return (
    <div className="p-4 border rounded-xl shadow-md max-w-3xl mx-auto my-6">
      <div className="mb-4">
        
        <RenderMathx text={question.question.text} />
      </div>

      {/* Options for MCQ */}
      {(question.type === 'singleCorrect' || question.type === 'multiCorrect') && (
        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <div
              key={i}
              className={`p-2 rounded border cursor-pointer ${
                selected.includes(i)
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white border-gray-300'
              }`}
              onClick={() =>
                question.type === 'singleCorrect'
                  ? handleSingleSelect(i)
                  : handleMultiSelect(i)
              }
            >
              <RenderMathx text={opt.text} />
            </div>
          ))}
        </div>
      )}

      {/* Numerical Input */}
      {question.type === 'numerical' && (
        <input
          type="text"
          placeholder="Enter your answer"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="mt-2 p-2 w-full border rounded"
        />
      )}

      {/* Descriptive Input */}
      {question.type === 'descriptive' && (
        <textarea
          placeholder="Write your answer..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="mt-2 p-2 w-full border rounded"
        />
      )}

      <button
        onClick={handleCheckAnswer}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Check Answer
      </button>

      {/* Feedback */}
      {isChecked && (
        <div className={`mt-4 p-3 rounded ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isCorrect ? '✅ Correct Answer!' : '❌ Wrong Answer'}
        </div>
      )}

      {/* Optional Hint */}
      {question.hint && (
        <details className="mt-3 text-sm text-gray-700">
          <summary className="cursor-pointer">Hint</summary>
          <p className="mt-1">{question.hint}</p>
        </details>
      )}

      {/* Optional Solution */}
      {isChecked && question.solution?.text && (
        <details className="mt-3 text-sm text-gray-700">
          <summary className="cursor-pointer">View Solution</summary>
          <div className="mt-2 whitespace-pre-wrap">
            <RenderMathx textB={question.solution.text} />
          </div>
        </details>
      )}
    </div>
  );
}
