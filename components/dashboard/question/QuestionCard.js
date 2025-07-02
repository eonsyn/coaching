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
   <div className="p-6 rounded-2xl shadow-xl w-full bg-card transition-all border border-lightblue">
  {/* Question Text */}
  <div className="mb-4 font-semibold text-lg text-foreground">
    <RenderMathx text={question.question.text} />
  </div>

  {/* MCQ Options */}
  {(question.type === 'singleCorrect' || question.type === 'multiCorrect') && (
    <div className="space-y-3">
      {question.options.map((opt, i) => {
        const isSelected = selected.includes(i);
        const isCorrect = isChecked && isSelected;
        const baseStyles = `p-3 rounded-lg border text-sm sm:text-base font-medium transition-all cursor-pointer`;

        const stateStyles = isSelected
          ? isChecked
            ? 'bg-success/10 border-success text-success'
            : 'bg-highlight/10 border-highlight text-highlight'
          : 'bg-card border-gray-200 hover:bg-lightblue/10';

        return (
          <div
            key={i}
            className={`${baseStyles} ${stateStyles} ${isChecked ? 'cursor-not-allowed opacity-80' : ''}`}
            onClick={() =>
              !isChecked &&
              (question.type === 'singleCorrect'
                ? handleSingleSelect(i)
                : handleMultiSelect(i))
            }
          >
            <RenderMathx text={opt.text} />
          </div>
        );
      })}
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
      className="mt-4 p-3 w-full rounded-md border border-lightblue bg-white text-foreground placeholder:text-gray-400 focus:ring-2 focus:ring-highlight disabled:opacity-60"
    />
  )}

  {/* Descriptive Input */}
  {question.type === 'descriptive' && (
    <textarea
      placeholder="Write your answer..."
      value={userInput}
      onChange={(e) => setUserInput(e.target.value)}
      rows={3}
      disabled={isChecked}
      className="mt-4 p-3 w-full rounded-md border border-lightblue bg-white text-foreground placeholder:text-gray-400 focus:ring-2 focus:ring-highlight disabled:opacity-60"
    />
  )}

  {/* Check Answer Button */}
  <button
    onClick={handleCheckAnswer}
    disabled={isChecked}
    className={`mt-6 px-5 py-2.5 w-full sm:w-auto rounded-md font-semibold text-white transition-all
      ${isChecked ? 'bg-gray-400 cursor-not-allowed' : 'bg-highlight hover:bg-highlight/90'}`}
  >
    {loading ? 'Checking...' : 'Check Answer'}
  </button>

  {/* Hint Section */}
  {question.hint && (
    <details className="mt-6 text-sm">
      <summary className="cursor-pointer font-medium flex items-center gap-2 text-warning hover:underline">
        <FaRegLightbulb className="text-warning" />
        Hint
      </summary>
      <div className="mt-2 bg-warning/20 p-3 rounded-md text-foreground">
        <RenderMathx text={question.hint} />
      </div>
    </details>
  )}

  {/* Solution Section */}
  {isChecked && solution?.text && (
    <details className="mt-4 text-sm">
      <summary className="cursor-pointer font-medium flex items-center gap-2 text-success] hover:underline">
        <CiTextAlignLeft className="text-success" />
        View Solution
      </summary>
      <div className="mt-2 bg-success/10 p-3 rounded-md text-foreground whitespace-pre-wrap">
        <RenderMathx text={solution.text} />
      </div>
    </details>
  )}
</div>


  );
}
