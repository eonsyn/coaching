'use client';

import { useState } from 'react';
import RenderMathx from '@/components/RenderMathx';
import { playSound } from '@/lib/playSound';
import { toast } from 'react-toastify';
import { FaRegLightbulb } from "react-icons/fa";
import { CiTextAlignLeft } from "react-icons/ci";

export default function QuestionCard({ question }) {
  const [selected, setSelected] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [solution, setSolution] = useState(null);
  const [hint, setHint] = useState(null);
  const [loading, setloading] = useState(false)

  const handleSingleSelect = (index) => {
    if (!isChecked) setSelected([index]);
  };

  const handleMultiSelect = (index) => {
    if (isChecked) return;
    if (selected.includes(index)) {
      setSelected(selected.filter((i) => i !== index));
    } else {
      setSelected([...selected, index]);
    }
  };

  const handleCheckAnswer = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      setloading(true);
      const res = await fetch(`/api/subject/chapter/question/${question._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selected,
          userInput,
          type: question.type,
          userId: user?.userId,
        })
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      setIsCorrect(result.correct);
      setIsChecked(true);
      setSolution(result.solution);
       
      if (result.correct) {
        toast.success('Correct Answer!');
        playSound('/sounds/correct.mp3');
      } else {
        toast.error('Wrong Answer!');
        playSound('/sounds/wrong.mp3');
      }

    } catch (err) {
      console.error(err);
      toast.error('Error checking answer');
    }finally{
      setloading(false)
    }
  };

  return (
    <div className="p-6 border rounded-xl shadow-md w-full bg-darkblue   transition-all">
      {/* Question */}
      <div className="mb-4 font-medium text-lg text-foreground">
        <RenderMathx text={question.question.text} />
      </div>

      {/* MCQ Options */}
      {(question.type === 'singleCorrect' || question.type === 'multiCorrect') && (
        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <div
              key={i}
              className={`p-3 rounded-md border cursor-pointer transition font-medium ${
                selected.includes(i)
                  ? isChecked
                    ? 'bg-blue-100 border-blue-500 text-blue-900'
                    : 'bg-blue-100 border-blue-500'
                  : 'bg-darkblue border-gray-300 hover:bg-darkblue/80'
              } ${isChecked ? 'cursor-not-allowed' : ''}`}
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
          disabled={isChecked}
          placeholder="Enter your answer"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="mt-3 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300 disabled:opacity-60"
        />
      )}

      {/* Descriptive Input */}
      {question.type === 'descriptive' && (
        <textarea
          placeholder="Write your answer..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="mt-3 p-2 w-full border rounded focus:outline-none focus:ring disabled:opacity-60"
          rows={3}
          disabled={isChecked}
        />
      )}

      {/* Check Answer Button */}
      <button
        onClick={handleCheckAnswer}
        disabled={isChecked}
        className={`mt-5 px-4 py-2 rounded font-medium text-white transition-all ${
          isChecked ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
      {loading ? "Checking..." : "Check Answer"}

      </button>
 
      {/* Hint */}
      {question.hint && (
        <details className="mt-4 text-sm text-muted-foreground">
          <summary className="cursor-pointer font-medium flex">
            <span className="flex bg-yellow-300 rounded-t-md p-1 items-center gap-1">
              <FaRegLightbulb /> Hint
            </span>
          </summary>
          <div className="bg-yellow-300 p-1 rounded-tr-md rounded-b-md transition-all ease-in-out duration-300">
            <RenderMathx text={question.hint} />
          </div>
        </details>
      )}

      {/* Solution */}
      {isChecked && solution?.text && (
        <details className="mt-4 text-sm text-muted-foreground">
          <summary className="cursor-pointer font-medium flex">
            <span className="flex bg-green-300 rounded-t-md p-1 items-center gap-1">
              <CiTextAlignLeft /> View Solution
            </span>
          </summary>
          <div className="bg-green-300 p-1 rounded-tr-md rounded-b-md whitespace-pre-wrap">
            <RenderMathx text={solution.text} />
          </div>
        </details>
      )}
    </div>
  );
}
