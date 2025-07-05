'use client';
import { useEffect, useState } from 'react';

export default function TestGenerator({ setQuestions }) {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [questionType, setQuestionType] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      const res = await fetch('/api/subject/all');
      const data = await res.json();
      if (data.subjects) setSubjects(data.subjects);
    };
    fetchSubjects();
  }, []);

  // Fetch chapters when subject changes
  useEffect(() => {
    if (!selectedSubject) return;
    const fetchChapters = async () => {
      const res = await fetch(`/api/subject?subject=${selectedSubject}`);
      const data = await res.json();
      if (data.chapters) {
        setChapters(data.chapters);
        setSelectedChapter('');
      }
    };
    fetchChapters();
  }, [selectedSubject]);

  const handleGenerate = async () => {
    if (!selectedSubject || !selectedChapter || !numberOfQuestions) {
      return alert('Please fill all fields');
    }

    setLoading(true);
    try {
      const chapterTitle = chapters.find(ch => ch._id === selectedChapter)?.title;
      const res = await fetch('/api/testgeneration', {
        method: 'POST',
        body: JSON.stringify({
          subject: selectedSubject,
          chapter: chapterTitle,
          numberOfQuestions,
          type: questionType,
        }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();
      if (data.questions) {
        setQuestions(data.questions);
      } else {
        alert(data.error || 'No questions found');
        setQuestions([]);
      }
    } catch (err) {
      console.error('Generation Error:', err);
      alert('Something went wrong');
    }
    setLoading(false);
  };

  return (
  <div className="bg-card text-foreground border border-lightblue/30 p-6 md:p-8 rounded-2xl shadow-lg max-w-xl mx-auto space-y-6 font-puritan">
  {/* Subject */}
  <div>
    <label className="block text-sm font-semibold mb-1 text-textprimary">Subject</label>
    <select
      value={selectedSubject || ''}
      onChange={(e) => setSelectedSubject(e.target.value)}
      className="w-full p-2.5 rounded-md bg-background border border-lightblue/30 focus:ring-2 focus:ring-highlight focus:outline-none transition-all"
    >
      <option value="">-- Select Subject --</option>
      {subjects?.map((s) => (
        <option key={s._id} value={s.subject}>
          {s.subject}
        </option>
      ))}
    </select>
  </div>

  {/* Chapter */}
  <div>
    <label className="block text-sm font-semibold mb-1 text-textprimary">Chapter</label>
    <select
      value={selectedChapter || ''}
      onChange={(e) => setSelectedChapter(e.target.value)}
      disabled={!chapters?.length}
      className="w-full p-2.5 rounded-md bg-background border border-lightblue/30 focus:ring-2 focus:ring-highlight focus:outline-none transition-all disabled:opacity-60"
    >
      <option value="">-- Select Chapter --</option>
      {chapters?.map((c) => (
        <option key={c._id} value={c._id}>
          {c.title} ({c.questionsCount} Qs)
        </option>
      ))}
    </select>
  </div>

  {/* Number of Questions */}
  <div>
    <label className="block text-sm font-semibold mb-1 text-textprimary">Number of Questions</label>
    <input
      type="number"
      min={1}
      value={numberOfQuestions || ''}
      onChange={(e) => setNumberOfQuestions(e.target.value)}
      className="w-full p-2.5 rounded-md bg-background border border-lightblue/30 focus:ring-2 focus:ring-highlight focus:outline-none transition-all"
    />
  </div>

  {/* Question Type */}
  <div>
    <label className="block text-sm font-semibold mb-1 text-textprimary">Question Type</label>
    <select
      value={questionType || ''}
      onChange={(e) => setQuestionType(e.target.value)}
      className="w-full p-2.5 rounded-md bg-background border border-lightblue/30 focus:ring-2 focus:ring-highlight focus:outline-none transition-all"
    >
      <option value="">Any</option>
      <option value="singleCorrect">Single Correct</option>
      <option value="multiCorrect">Multi Correct</option>
      <option value="numerical">Numerical</option>
      <option value="descriptive">Descriptive</option>
    </select>
  </div>

  {/* Submit Button */}
  <div className="pt-2">
    <button
      onClick={handleGenerate}
      disabled={loading}
      className="w-full py-3 text-white bg-highlight hover:bg-highlight/90 font-semibold rounded-md transition-all active:scale-[0.98] disabled:opacity-60"
    >
      {loading ? 'Generating...' : 'Generate Questions'}
    </button>
  </div>
</div>

  );
}
