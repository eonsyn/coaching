'use client';
import { useState } from 'react';
import RenderMathx from '@/components/RenderMathx';
import { playSound } from '@/lib/playSound';
export default function QuestionCard({ question }) {
  const [selected, setSelected] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [checkbutton,setCheckbutton]=useState(false)
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
      console.log(selected[0] === correctIndex)
      correct = selected.length === 1 && selected[0] === correctIndex;
    }

    else if (question.type === 'multiCorrect') {
      const correctIndices = question.options
        .map((opt, idx) => (opt.isCorrect ? idx : null))
        .filter((v) => v !== null)
        .sort((a, b) => a - b);
      const userSelected = [...selected].sort((a, b) => a - b);
      correct =
        correctIndices.length === userSelected.length &&
        correctIndices.every((val, i) => val === userSelected[i]);
    }

    else if (question.type === 'numerical') {
      const correctAnswer = (question.correctValue ?? '').toString().trim();
correct = userInput.trim() === correctAnswer;


    }

    else if (question.type === 'descriptive') {
      correct = true; // always allow as correct
    }
if(correct){
   playSound('/sounds/correct.mp3');
}else{
  playSound('/sounds/wrong.mp3');
}
    setIsCorrect(correct);
    setIsChecked(true);
  };

  return (
    <div className="p-4 border rounded-xl shadow-md max-w-3xl mx-auto my-6 bg-white">
      {/* Question */}
      <div className="mb-4 font-medium text-lg">
        <RenderMathx text={question.question.text} />
      </div>

      {/* MCQ Options */}
      {(question.type === 'singleCorrect' || question.type === 'multiCorrect') && (
        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <div
              key={i}
              className={`p-2 rounded border cursor-pointer transition ${
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
          rows={3}
        />
      )}

      {/* Check Answer */}
      <button
      disable={checkbutton}
        onClick={handleCheckAnswer}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Check Answer
      </button>

      {/* Feedback */}
      {isChecked && (
        <div
          className={`mt-4 p-3 rounded font-semibold ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
          }`}
        >
          {isCorrect ? '✅ Correct Answer!' : '❌ Wrong Answer'}
        </div>
      )}

      {/* Hint */}
      {question.hint && (
        <details className="mt-4 text-sm text-gray-700">
          <summary className="cursor-pointer font-medium">💡 Hint</summary>
          <div className="mt-1">
            <RenderMathx text={question.hint} />
          </div>
        </details>
      )}

      {/* Solution */}
      {isChecked && question.solution?.text && (
        <details className="mt-4 text-sm text-gray-700">
          <summary className="cursor-pointer font-medium">📝 View Solution</summary>
          <div className="mt-2 whitespace-pre-wrap">
            <RenderMathx text={question.solution.text} />
          </div>
        </details>
      )}
    </div>
  );
}
