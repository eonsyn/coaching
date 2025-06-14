'use client';

import { renderMathText } from '@/utils/renderMath';
import { useState, useEffect } from 'react';
import OptionEditor from './OptionEditor';
import ImageUploader from './ImageUploader';
import Image from 'next/image';

export default function QuestionCard({ index, rawData, meta, onChange }) {
  const optionKeys = Object.keys(rawData.options || {});
   
  const [showQuestion, setshowQuestion] = useState(false)

  const [question, setQuestion] = useState({
    ...rawData,
    question: rawData.question || "",
    imageUrl: rawData.imageUrl || "",
    options: optionKeys.map(key => {
      const opt = rawData.options[key];
      return typeof opt === 'string' ? { text: opt, imageUrl: '' } : opt;
    }),
    correctOption: rawData.correctOption || "",
    answer: rawData.answer || "",
    explanation: rawData.explanation || "",
    publication: rawData.publication || "",
    optionKeys, // Store option key map
  });

  const [level, setLevel] = useState(rawData.level || "Medium");

  useEffect(() => {
    const updated = {
      ...question,
      level,
      subject: meta.subject,
      topic: meta.topic,
      unit: meta.unit,
      type: "MCQ",
    };
    onChange(updated);
  }, [question, level, meta]);

  return (
    <div className="p-6 border rounded-2xl shadow-md my-6 bg-white space-y-5">
      <h3 className="font-semibold text-xl text-blue-700">Question {index + 1}</h3>
      <p>{rawData.type}</p>
      {showQuestion && <div>
        <label className="block font-medium mb-1">Question Text:</label>
        <textarea
          className="w-full border border-gray-300 p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={3}
          placeholder="Enter question text"
          value={question.question.text}
          onChange={(e) =>
            setQuestion({ ...question, question: { ...question.question, text: e.target.value } })
          }
        />
      </div>}

      {
        !showQuestion && <div className="p-3 bg-gray-100 border rounded-md">
          {renderMathText(question.question.text)}
        </div>
      }

      <button onClick={() => setshowQuestion(!showQuestion)} className="">Edit Question </button>

      {question.question.imageUrl && (
        <Image
          src={question.question.imageUrl}
          alt="Question"
          width={150}
          height={150}
          className="rounded-md mt-2"
        />
      )}

      <ImageUploader
        label="Upload Question Image"
        onUpload={(url) => setQuestion({ ...question, question: { ...question.question, imageUrl: url } })}
      />

      <div className="grid gap-4 mt-4">
        {(question.options || []).map((opt, i) => (
          <div key={i} className="border border-gray-200 p-4 rounded-md bg-gray-50">
            <OptionEditor
              index={i}
              value={opt}
              onChange={(val) => {
                const newOpts = [...question.options];
                newOpts[i] = val;
                setQuestion({ ...question, options: newOpts });
              }}
            />
            <ImageUploader
              label={`Option ${String.fromCharCode(65 + i)} Image`}
              onUpload={(url) => {
                const newOpts = [...question.options];
                newOpts[i] = { ...newOpts[i], imageUrl: url };
                setQuestion({ ...question, options: newOpts });
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label className="block font-medium mb-1">Correct Option:</label>
        <div className="flex flex-wrap gap-4">
          {question.options.map((_, idx) => {
            const optionKey = question.optionKeys?.[idx] || `option${idx + 1}`;
            const label = String.fromCharCode(65 + idx);
            return (
              <label key={optionKey} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={`correctOption-${index}`}
                  value={optionKey}
                  checked={question.correctOption === optionKey}
                  onChange={() =>
                    setQuestion({ ...question, correctOption: optionKey })
                  }
                  className="accent-blue-600"
                />
                {label}
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1">Answer:</label>
        <input
          className="w-full border border-gray-300 p-2 rounded-md"
          placeholder="Answer (optional)"
          value={question.answer}
          onChange={(e) => setQuestion({ ...question, answer: e.target.value })}
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Explanation:</label>
        <textarea
          className="w-full border border-gray-300 p-2 rounded-md resize-none"
          placeholder="Explanation (optional)"
          rows={2}
          value={question.explanation}
          onChange={(e) =>
            setQuestion({ ...question, explanation: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Publication:</label>
        <input
          className="w-full border border-gray-300 p-2 rounded-md"
          placeholder="Publication (optional)"
          value={question.publication}
          onChange={(e) =>
            setQuestion({ ...question, publication: e.target.value })
          }
        />
      </div>

      <div className="pt-2">
        <label className="block font-medium mb-1">Level:</label>
        <select
          className="border border-gray-300 p-2 rounded-md"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
    </div>

  );
}
