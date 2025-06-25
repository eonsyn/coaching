'use client';

import { renderMathText } from '@/utils/renderMath';
import { useState, useEffect } from 'react';
import OptionEditor from './OptionEditor';
import EditableExplanation from './renderComponent/EditableExplanation';
import ImageUploader from './ImageUploader';
import Image from 'next/image';
import RenderExplanation from '../render/RenderExplanation';

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
    correctOption: Array.isArray(rawData.correctOption)
      ? rawData.correctOption
      : rawData.correctOption
        ? [rawData.correctOption]
        : [],
    answer: rawData.answer || "",
    explanation: rawData.explanation || [],
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

      <button onClick={() => setshowQuestion(!showQuestion)} className="bg-red-400 text-white p-2 rounded-md">Edit Question </button>

      {question.question.imageUrl && (
        <Image
          src={question.question.imageUrl}
          alt="Question"
          width={150}
          height={150}
          className="rounded-md mt-2"
        />
      )}

      {
        showQuestion && <ImageUploader
          label="Upload Question Image"
          onUpload={(url) => setQuestion({ ...question, question: { ...question.question, imageUrl: url } })}
        />
      }
      <div className="mt-4">
        <label className="block font-medium mb-1">Correct Option:</label>
        <div className="flex flex-wrap gap-4">
          {question.options.map((_, idx) => {
            const optionKey = question.optionKeys?.[idx] || `option${idx + 1}`;
            const label = String.fromCharCode(65 + idx);
            const isMSQ = question.type === "MSQ";
            const isSelected = question.correctOption.includes(optionKey);

            return (
              <label key={optionKey} className="flex items-center gap-2 text-sm">
                <input
                  type={isMSQ ? "checkbox" : "radio"}
                  name={`correctOption-${index}`}
                  value={optionKey}
                  checked={isSelected}
                  onChange={() => {
                    let updatedCorrectOption;

                    if (isMSQ) {
                      if (isSelected) {
                        // Remove this option
                        updatedCorrectOption = question.correctOption.filter(opt => opt !== optionKey);
                      } else {
                        // Add this option
                        updatedCorrectOption = [...question.correctOption, optionKey];
                      }
                    } else {
                      // For MCQ: only one option allowed
                      updatedCorrectOption = [optionKey];
                    }

                    setQuestion({ ...question, correctOption: updatedCorrectOption });
                  }}
                  className="accent-blue-600"
                />
                {label}
              </label>
            );
          })}


        </div>
      </div>
      <div className="grid gap-4 mt-4">
        {showQuestion && (question.options || []).map((opt, i) => {
          const optionKey = question.optionKeys?.[i] || `option${i + 1}`;
          return (<div key={i} className="border border-gray-200 p-4 rounded-md bg-gray-50">
            {
              showQuestion && <>
                <OptionEditor
                  index={i}
                  value={opt}
                  onChange={(val) => {
                    const newOpts = [...question.options];
                    newOpts[i] = val;
                    setQuestion({ ...question, options: newOpts });
                  }}
                /> <ImageUploader
                  label={`Option ${String.fromCharCode(65 + i)} Image`}
                  onUpload={(url) => {
                    const newOpts = [...question.options];
                    newOpts[i] = { ...newOpts[i], imageUrl: url };
                    setQuestion({ ...question, options: newOpts });
                  }}
                />
              </>
            }

            {/* {
              !showQuestion && (
                <div
                  className={`p-4 mb-2 rounded-lg text-white font-medium shadow-md transition-all duration-300 ${question.correctOption === optionKey ? 'bg-green-500' : 'bg-slate-500'
                    }`}
                >
                  {renderMathText(opt.text)}
                </div>
              )
            } */}


          </div>)
        })}
      </div>



      <div>
        <label className="  font-medium mb-1">Answer:</label>
        {showQuestion ? (<input
          className="w-full border border-gray-300 p-2 rounded-md"
          placeholder="Answer (optional)"
          value={question.answer}
          onChange={(e) => setQuestion({ ...question, answer: e.target.value })}
        />) : (<span>{question.answer}</span>)}


      </div>

      
      <div>
        
        {
          showQuestion? <EditableExplanation
       showQuestion={showQuestion}
        data={question.explanation}
        onChange={(updated) =>
          setQuestion((prev) => ({ ...prev, explanation: updated }))
        }
      />:<RenderExplanation data={question.explanation}/> 
        }
       
      </div>
      {
        showQuestion && <> <div>
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
        </>
      }

    </div>

  );
}
