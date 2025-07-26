'use client';

import { useState } from 'react';
import RenderMathx from '@/components/RenderMathx';
import { playSound } from '@/lib/playSound';
import { toast } from 'react-toastify';
import { FaRegLightbulb } from "react-icons/fa";
import { CiTextAlignLeft } from "react-icons/ci";
import Link from 'next/link';
import { FiArrowRightCircle, FiArrowLeftCircle } from 'react-icons/fi';

export default function QuestionCard({preId,url, question, nextId }) {
  const [selected, setSelected] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [solution, setSolution] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSingleSelect = (index) => {
    if (!isChecked) setSelected([index]);
  };

  const handleMultiSelect = (index) => {
    if (isChecked) return;
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

const handleCheckAnswer = async () => {
  try {
    setLoading(true);

    const res = await fetch(`/api/subject/chapter/question/${question._id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        selected,
        userInput,
        type: question.type,
        
      }),
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Something went wrong');

    setIsCorrect(result.correct);
    setIsChecked(true);
    setSolution(result.solution);
    setCorrectAnswers(result.correctAnswers || []);

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
  } finally {
    setLoading(false);
  }
};

  return (
   <>
  {/* Options */}
  {(question.type === 'singleCorrect' || question.type === 'multiCorrect') && (
    <div className="space-y-3">
      {question.options.map((opt, i) => {
        const isSelected = selected.includes(i);
        const isRight = correctAnswers.includes(i);
        const isWrongSelected = isChecked && isSelected && !isRight;

        const baseStyles = `p-3 rounded-lg border text-sm sm:text-base font-medium transition-all cursor-pointer`;
        let stateStyles = 'bg-[var(--card-bg)] border-[var(--border-color)] hover:bg-[var(--primary)]/5';

        if (isChecked) {
          if (isRight) {
            stateStyles = 'bg-[var(--success)]/10 border-[var(--success)] text-[var(--success)]';
          } else if (isWrongSelected) {
            stateStyles = 'bg-[var(--danger)]/10 border-[var(--danger)] text-[var(--danger)]';
          } else if (isSelected) {
            stateStyles = 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]';
          }
        } else if (isSelected) {
          stateStyles = 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)]';
        }

        return (
          <div
            key={i}
            className={`${baseStyles} ${stateStyles} ${isChecked ? 'cursor-not-allowed opacity-90' : ''}`}
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
      className="mt-4 p-3 w-full rounded-md border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
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
      className="mt-4 p-3 w-full rounded-md border border-[var(--border-color)] bg-[var(--input-bg)] text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-60"
    />
  )}

  {/* Hint */}
  {question.hint && (
    <details className="mt-6 text-sm">
      <summary className="cursor-pointer font-medium flex items-center gap-2 text-[var(--warning)] hover:underline">
        <FaRegLightbulb className="text-[var(--warning)]" />
        Hint
      </summary>
      <div className="mt-2 bg-[var(--warning)]/10 p-3 rounded-md text-[var(--foreground)]">
        <RenderMathx text={question.hint} />
      </div>
    </details>
  )}
{/* Solution */}
  {isChecked && solution?.text && (
    <details className="mt-4 text-sm">
      <summary className="cursor-pointer font-medium flex items-center gap-2 text-[var(--success)] hover:underline">
        <CiTextAlignLeft className="text-[var(--success)]" />
        View Solution
      </summary>
      <div className="mt-2 bg-[var(--success)]/10 p-3 rounded-md text-[var(--foreground)] whitespace-pre-wrap">
        <RenderMathx text={solution.text} />
      </div>
    </details>
  )}
  {/* Navigation + Check Answer */}
  <div className="mt-8 pb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
    {/* Previous Button */}
    {preId ? (
      <Link href={`${url}/${preId}`} passHref>
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--primary)] text-white hover:brightness-110 shadow transition-all duration-200 cursor-pointer">
          <FiArrowLeftCircle className="text-xl" />
          Previous
        </div>
      </Link>
    ) : (
      <div className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--muted)] text-white opacity-50 cursor-not-allowed">
        <FiArrowLeftCircle className="text-xl" />
        Previous
      </div>
    )}

    {/* Check Answer Button */}
    {(selected.length !== 0 || userInput) && (
      <button
        onClick={handleCheckAnswer}
        disabled={isChecked || loading}
        className={`px-8 cursor-pointer py-2.5 w-full sm:w-auto rounded-md font-semibold text-white transition-all ${
          isChecked
            ? 'bg-[var(--danger)] cursor-not-allowed'
            : 'bg-[var(--danger)] hover:bg-[var(--danger)]/90'
        }`}
      >
        {loading ? 'Checking...' : 'Check Answer'}
      </button>
    )}

    {/* Next Button */}
    {nextId ? (
      <Link href={`${url}/${nextId}`} passHref>
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--primary)] text-white hover:brightness-110 shadow transition-all duration-200 cursor-pointer">
          Next
          <FiArrowRightCircle className="text-xl" />
        </div>
      </Link>
    ) : (
      <div className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-[var(--muted)] text-white opacity-50 cursor-not-allowed">
        Next
        <FiArrowRightCircle className="text-xl" />
      </div>
    )}
  </div>

  
</>

  );
}
