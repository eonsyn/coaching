'use client';

import { useState } from 'react';
import RenderMathx from '@/components/RenderMathx';
import { playSound } from '@/lib/playSound';
import { toast } from 'react-toastify';
import { FaRegLightbulb } from "react-icons/fa";
import { CiTextAlignLeft } from "react-icons/ci";
import Link from 'next/link';
import { FiArrowRightCircle, FiArrowLeftCircle } from 'react-icons/fi';

export default function QuestionCard({preId, question, nextId }) {
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

            let stateStyles = 'bg-card border-gray-200 hover:bg-lightblue/10';

            if (isChecked) {
              if (isRight) {
                stateStyles = 'bg-success/10 border-success text-success';
              } else if (isWrongSelected) {
                stateStyles = 'bg-red-100 border-red-500 text-red-600';
              } else if (isSelected) {
                stateStyles = 'bg-highlight/10 border-highlight text-highlight';
              }
            } else if (isSelected) {
              stateStyles = 'bg-highlight/10 border-highlight text-highlight';
            }

            return (
              <div
                key={i}
                className={`${baseStyles} ${stateStyles} ${isChecked ? 'cursor-not-allowed opacity-95' : ''}`}
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



      {/* Hint */}
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

     
<div className="mt-8 pb-4 flex flex-col sm:flex-row justify-between items-center gap-4">

  {/* Previous Question Button */}
  {preId ? (
    <Link href={`/dashboard/question/${preId}`} passHref>
      <div className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-highlight text-white hover:brightness-110 shadow transition-all duration-200 cursor-pointer">
        <FiArrowLeftCircle className="text-xl" />
        Previous
      </div>
    </Link>
  ) : (
    <div className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-gray-400 text-white opacity-60 cursor-not-allowed">
      <FiArrowLeftCircle className="text-xl" />
      Previous
    </div>
  )}

  {/* Check Answer Button */}
 {(selected.length != 0 || userInput) ? (
  <button
    onClick={handleCheckAnswer}
    disabled={isChecked}
    className={`px-8 py-2.5 w-full sm:w-auto rounded-md font-semibold text-white transition-all ${isChecked ? 'bg-softred cursor-not-allowed' : 'bg-softred hover:bg-softred/90'}`}
  >
    {loading ? 'Checking...' : 'Check Answer'}
  </button>
) : null}


  {/* Next Question Button */}
  {nextId ? (
    <Link href={`/dashboard/question/${nextId}`} passHref>
      <div className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-highlight text-white hover:brightness-110 shadow transition-all duration-200 cursor-pointer">
        Next
        <FiArrowRightCircle className="text-xl" />
      </div>
    </Link>
  ) : (
    <div className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-gray-400 text-white opacity-60 cursor-not-allowed">
      Next
      <FiArrowRightCircle className="text-xl" />
    </div>
  )}

</div>
      {/* Solution */}
      {isChecked && solution?.text && (
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer font-medium flex items-center gap-2 text-success hover:underline">
            <CiTextAlignLeft className="text-success" />
            View Solution
          </summary>
          <div className="mt-2 bg-success/10 p-3 rounded-md text-foreground whitespace-pre-wrap">
            <RenderMathx text={solution.text} />
          </div>
        </details>
      )}
    </>
  );
}
