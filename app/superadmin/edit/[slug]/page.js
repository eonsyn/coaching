'use client';

import React, { useState, useEffect } from 'react';
import useSWR, { mutate } from 'swr';

const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch question');
  return res.json();
};

export default function Page({ params }) {
  const { slug } = params;
  const { data, error, isLoading } = useSWR(`/api/question/superadmin/editquestion/${slug}`, fetcher);

  const [formData, setFormData] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [outer, inner] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [outer]: {
          ...prev[outer],
          [inner]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOptionChange = (key, field, value) => {
    setFormData((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        [key]: {
          ...prev.options[key],
          [field]: value,
        },
      },
    }));
  };

  const handleCorrectOptionChange = (key) => {
    const current = formData.correctOption || [];

    if (isMSQ) {
      const updated = current.includes(key)
        ? current.filter((opt) => opt !== key)
        : [...current, key];
      setFormData((prev) => ({
        ...prev,
        correctOption: updated,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        correctOption: [key],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/question/superadmin/editquestion/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage('  Question updated successfully!');
        mutate(`/api/question/superadmin/editquestion/${slug}`);
      } else {
        setMessage(`  Update failed: ${result.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('  Something went wrong.');
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching question</p>;
  if (!formData) return null;

  const { type } = formData;
  const isMCQ = type === 'MCQ';
  const isMSQ = type === 'MSQ';
  const isMCQorMSQ = isMCQ || isMSQ;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit {type} Question</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Question Text */}
        <div>
          <label className="block font-medium">Question Text</label>
          <textarea
            name="question.text"
            value={formData.question?.text || ''}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Options for MCQ/MSQ */}
        {isMCQorMSQ && (
          <>
            <h3 className="font-semibold">Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['option1', 'option2', 'option3', 'option4'].map((key, idx) => {
                const isSelected = formData.correctOption?.includes(key);

                return (
                  <div key={key} className="border p-3 rounded">
                    <label className="block font-semibold mb-1">Option {idx + 1}</label>
                    <textarea
                      value={formData.options?.[key]?.text || ''}
                      onChange={(e) => handleOptionChange(key, 'text', e.target.value)}
                      className="w-full border rounded p-2 mb-2"
                    />
                    <label className="flex items-center gap-2">
                      <input
                        type={isMSQ ? 'checkbox' : 'radio'}
                        name="correctOption"
                        checked={isSelected}
                        onChange={() => handleCorrectOptionChange(key)}
                      />
                      {isMSQ ? 'Correct (Multiple allowed)' : 'Correct'}
                    </label>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Answer */}
        <div>
          <label className="block font-medium">
            {type === 'Numerical' ? 'Answer (Number)' : 'Answer'}
          </label>
          <textarea
            name="answer"
            value={formData.answer || ''}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Explanation */}
        <div>
          <label className="block font-medium">Explanation</label>
          <textarea
            name="explanation"
            value={formData.explanation || ''}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Meta Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Subject</label>
            <input
              name="subject"
              value={formData.subject || ''}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Topic</label>
            <input
              name="topic"
              value={formData.topic || ''}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Unit</label>
            <input
              name="unit"
              value={formData.unit || ''}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Level</label>
            <input
              name="level"
              value={formData.level || ''}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* Asked In */}
        <h3 className="font-semibold">Asked In</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Exam</label>
            <input
              name="askedIn.exam"
              value={formData.askedIn?.exam || ''}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Year</label>
            <input
              name="askedIn.year"
              type="number"
              value={formData.askedIn?.year || ''}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Date</label>
            <input
              name="askedIn.date"
              value={formData.askedIn?.date || ''}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Marks</label>
            <input
              name="askedIn.marks"
              type="number"
              value={formData.askedIn?.marks || ''}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        >
          Update Question
        </button>
      </form>

      {/* Feedback Message */}
      {message && <p className="mt-4 text-green-700">{message}</p>}
    </div>
  );
}
