'use client';
import React, { useState } from 'react';
import Timer from './Timer';
import { renderMathText } from '@/utils/renderMath';
import { IoIosArrowUp } from "react-icons/io";

function QuestionUi({ data, onNext, onPrev }) {
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [timetaken, settimetaken] = useState('');
  const [restarttime, setrestarttime] = useState(false)
  const [stopclock, setstopclock] = useState(true);

  if (!data) return <div>No question found</div>;

  const { question, options, correctOption = [], type, askedIn, answer = '' } = data;

  const handleSelect = (key) => {
    if (submitted) return;

    if (type === 'MSQ') {
      setSelected((prev) =>
        prev.includes(key) ? prev.filter((opt) => opt !== key) : [...prev, key]
      );
    } else {
      setSelected([key]);
    }
  };

  const handleInputChange = (e) => {
    if (!submitted) setSelected([e.target.value]);
  };

  const handleSubmit = () => {
    if (selected.length === 0 || (type === 'Numerical' && selected[0].trim() === '')) {
      alert('Please select or enter an answer.');
      return;
    }
    setSubmitted(true);
  };

  const isCorrect = () => {
    if (type === 'MSQ') {
      return (
        selected.length === correctOption.length &&
        selected.every((val) => correctOption.includes(val))
      );
    }
    if (type === 'Numerical') {
      return selected[0]?.trim() === answer?.trim();
    }
    return selected[0] === correctOption[0];
  };

  const getOptionStyle = (key) => {
    if (!submitted) {
      return selected.includes(key)
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-300 bg-white';
    }
    if (correctOption.includes(key)) return 'border-green-600 bg-green-100';
    if (selected.includes(key)) return 'border-red-600 bg-red-100';
    return 'border-gray-200 bg-gray-50';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 pb-24 space-y-6">
      <Timer stopclock=
      {stopclock} settimetaken={settimetaken} restarttime={restarttime} />
      {/* Question Block */}
      <div className="bg-card p-4 rounded-md shadow-sm">
        <h2 className="text-lg font-semibold text-indigo-600">Question:</h2>
        <div className="mt-2 text-gray-900">{renderMathText(question.text)}</div>
        {question.imageUrl && <img src={question.imageUrl} alt="Question" className="mt-2" />}
        <p className="text-end mt-1 text-sm">
          <span className="p-1 bg-slate-200 rounded-md">
            {askedIn?.exam} {askedIn?.year} ({askedIn?.marks} marks)
          </span>
        </p>
      </div>

      {/* Answer UI */}
      {type === 'Numerical' ? (
        <input
          type="text"
          placeholder="Enter your answer"
          value={selected[0] || ''}
          onChange={handleInputChange}
          className="w-full border rounded-md p-3 text-lg"
        />
      ) : (
        <div className="space-y-2">
          {Object.entries(options).map(([key, opt], i) => (
            <div
              key={key}
              onClick={() => handleSelect(key)}
              className={`p-3 rounded-md border cursor-pointer flex items-start gap-2 ${getOptionStyle(
                key
              )}`}
            >
              <span className="font-semibold">{String.fromCharCode(65 + i)}.</span>
              <div>{renderMathText(opt.text)}</div>
              {opt.imageUrl && <img src={opt.imageUrl} className="w-8 h-8 ml-2" />}
            </div>
          ))}
        </div>
      )}
{/* Result */}
      {submitted && (
        <div
          className={`mt-4 font-medium ${
            isCorrect() ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isCorrect() ? 'Correct Answer' : 'Wrong Answer'}
          <br />
          <p>answer is: {answer}</p>
        </div>
      )}
      {/* Sticky Footer */}
      <div className="     px-4 py-3 flex justify-between items-center  ">
        <button
          onClick={() => {
            onPrev();
            setSelected([]);
            setSubmitted(false);
             settimetaken('');
            setrestarttime(true);
            setTimeout(() => setrestarttime(false), 100);
          }}
          className="bg-highlight text-white px-4 py-2 rounded-full"
        >
          <IoIosArrowUp className="rotate-270" />
        </button>
        <button
          onClick={()=>{
        handleSubmit();
         setstopclock(true);             // trigger stop
    setTimeout(() => setstopclock(false), 100); // reset trigger (optional)
      }}
          disabled={submitted}
          className="bg-highlight text-white px-6 py-2 rounded"
        >
          {submitted ? 'Submitted' : 'Submit'}
        </button>
        <button
          onClick={() => {
            onNext();
            setSelected([]);
            setSubmitted(false);
            settimetaken('');
            setrestarttime(true);
            setTimeout(() => setrestarttime(false), 100);

          }}
          className="bg-highlight text-white px-4 py-2 rounded-full"
        >
          <IoIosArrowUp className="rotate-90" />
        </button>
      </div>

      
    </div>
  );
}

export default QuestionUi;
