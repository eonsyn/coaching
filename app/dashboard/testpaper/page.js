'use client';

import { useState, useEffect } from 'react'; 
import { toast } from 'react-toastify'; 
import AnswerSheet from '@/components/testpaper/AnswerSheet';
import TestPaper from '@/components/testpaper/TestPaper';

export default function QuestionGeneratorPage() {
  const [step, setStep] = useState(1); // 1: Subject, 2: Chapter, 3: Questions
  const [subject, setSubject] = useState('');
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [duration, setduration] = useState(60);
  const [showAnswers, setShowAnswers] = useState(true);
  const subjectOptions = ['Physics', 'Chemistry', 'Mathematics'];

  useEffect(() => {
    if (!subject) return;

    const fetchChapters = async () => {
      const res = await fetch('/api/subject/chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject }),
      });
      const data = await res.json();
      setChapters(data.chapters || []);
      setSelectedChapter('');
    };

    fetchChapters();
  }, [subject]);

  const generateQuestions = async () => {
    setLoading(true);
    const res = await fetch('/api/subject/chapter/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chapterId: selectedChapter,
        count: Math.min(questionCount, 15),
      }),
    });
    const data = await res.json();
    setQuestions(data.questions || []);
    setLoading(false);
    setStep(3);
  };

  const handleDownloadAnswers = async () => {
    toast.success("Downloading Answers...");
    const answerHTML = document.getElementById("answer-section")?.innerHTML;
    if (!answerHTML) return;

    const res = await fetch("https://pdf-704i.onrender.com/generate-pdf-from-html", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: answerHTML })
    });

    const blob = await res.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "answer-sheet.pdf";
    link.click();
  };

  const testDownloadPDF = async () => {
    toast.success("Downloading Questions...");
    const htmlContent = document.getElementById("question-section")?.innerHTML;
    const res = await fetch("https://pdf-704i.onrender.com/generate-pdf-from-html", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: htmlContent }),
    });

    const blob = await res.blob();
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "questions.pdf";
    a.click();
  };

  const breadcrumb = [
    { label: 'Select Subject', step: 1 },
    { label: 'Select Chapter', step: 2 },
    { label: 'Questions', step: 3 }
  ];

  return (
   <div className="p-6 max-w-4xl mx-auto space-y-6 bg-[var(--bg-primary)] text-[var(--text-primary)] transition-all duration-300 rounded-xl shadow-md">

  {/* Breadcrumb */}
  <div className="flex space-x-2 text-sm text-[var(--text-muted)]">
    {breadcrumb.map((b, idx) => (
      <span
        key={b.label}
        onClick={() => step > idx && setStep(idx+1)}
        className={`cursor-pointer transition hover:underline ${
          step >= b.step ? 'text-[var(--primary)] font-medium' : ''
        }`}
      >
        {idx > 0 && '>'} {b.label}
      </span>
    ))}
  </div>

 <div className="w-full max-w-4xl overflow-hidden relative" style={{ minHeight: '400px' }}>
  <div
    className="flex transition-transform duration-500 ease-in-out"
    style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
  >
    {/* Step 1 */}
    <div className="w-full flex-shrink-0 p-4">
      <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow border border-[var(--bg-accent)]">
        <label className="block mb-2 font-semibold">Select Subject:</label>
        <select
          className="w-full p-3 rounded-lg bg-[var(--bg-tertiary)]"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">-- Choose --</option>
          {subjectOptions.map((subj) => (
            <option key={subj} value={subj}>{subj}</option>
          ))}
        </select>
        <button
          disabled={!subject}
          onClick={() => setStep(2)}
          className="mt-4 w-full bg-[var(--primary)] text-white py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>

    {/* Step 2 */}
    <div className="w-full flex-shrink-0 p-4">
      <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow border border-[var(--bg-accent)]">
        <label className="block mb-2 font-semibold">Select Chapter:</label>
        <select
          className="w-full p-3 rounded-lg bg-[var(--bg-tertiary)]"
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
        >
          <option value="">-- Choose Chapter --</option>
          {chapters.map((ch) => (
            <option key={ch._id} value={ch._id}>{ch.title}</option>
          ))}
        </select>

        <label className="block mt-4 mb-2 font-semibold">Number of Questions:</label>
        <input
          type="number"
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
          className="w-full p-3 rounded-lg bg-[var(--bg-tertiary)]"
          min={1}
          max={15}
        />

        <label className="block mt-4 mb-2 font-semibold">Test Duration (minutes):</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setduration(e.target.value)}
          className="w-full p-3 rounded-lg bg-[var(--bg-tertiary)]"
        />

        <div className="flex justify-between items-center mt-6">
          <button onClick={() => setStep(1)} className="text-[var(--secondary)] hover:underline">
            Back
          </button>
          <button
            disabled={!selectedChapter}
            onClick={generateQuestions}
            className="bg-[var(--primary)] text-white px-5 py-2.5 rounded-lg"
          >
            Generate
          </button>
        </div>
      </div>
    </div>

    {/* Step 3 */}
    <div className="w-full flex-shrink-0 p-4">
      <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow border border-[var(--bg-accent)]">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setStep(2)} className="text-[var(--secondary)] hover:underline">
            Back
          </button>
          <div className="flex gap-3">
            <button onClick={testDownloadPDF} className="bg-[var(--accent)] px-4 py-2 rounded">
              Download Questions
            </button>
            <button onClick={handleDownloadAnswers} className="bg-[var(--success)] text-white px-4 py-2 rounded">
              Download Answers
            </button>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">Preview</h2>
        <div id="question-section" className="space-y-6">
          <TestPaper
            chapters={chapters.find((ch) => ch._id === selectedChapter)?.title}
            subject={subject}
            time={duration}
            questions={questions}
          />
        </div>

        <div className="mt-6">
          {!showAnswers ? (
            <button onClick={() => setShowAnswers(true)} className="text-[var(--primary)] underline">
              Show Answers
            </button>
          ) : (
            <div id="answer-section">
              <AnswerSheet questions={questions} />
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
</div>

</div>


  );
}
