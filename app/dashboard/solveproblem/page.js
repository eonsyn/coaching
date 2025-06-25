"use client";
import React, { useState } from 'react';
import SelectQuestion from '@/components/dashboard/solveproblem/SelectQuestion';
import QuestionUi from '@/components/dashboard/solveproblem/QuestionUi';

export default function Page() {
  const [form, setForm] = useState({
    class: 'Class 11',
    subject: 'Mathematics',
    type: 'MCQ',
    count: 1,
    level: 'Medium',
  });

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showQuestion, setShowQuestion] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.subject || !form.level) {
      setError('Please select Subject and Level');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/question/problems?subject=${form.subject}&type=MCQ`);
      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();

      // Only one question at a time
      if (!Array.isArray(data) || !data.length) {
        setError('No question found');
        return;
      }

      setQuestions((prev) => [...prev, ...data]); // append new
      setCurrentIndex(questions.length); // point to new question
      setShowQuestion(true);
    } catch (err) {
      console.error(err);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    if (currentIndex === questions.length - 1) {
      handleSubmit(new Event('fetch')); // fetch new question
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  }

  return (
    <div className="w-full transition-all">
      {showQuestion ? (
        <QuestionUi
          data={questions[currentIndex]}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      ) : (
        <SelectQuestion
          form={form}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </div>
  );
}
