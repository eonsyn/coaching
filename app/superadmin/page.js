'use client';
import { useEffect, useState } from 'react';
import QuestionRenderer from '@/components/superadmin/QuestionRenderer';

export default function Page() {
 const [rawData, setRawData] = useState(``);


  const [questions, setQuestions] = useState([]);
  const [meta, setMeta] = useState({ subject: '', topic: '', unit: '' });
  const [isSaving, setIsSaving] = useState(false);
const normalizeOptions = (optionsArray) => {
  const optionKeys = ["option1", "option2", "option3", "option4"];
  const mapped = {};

  const stripLabel = (text) =>
    text.replace(/^\(?[A-Da-d]\)?\s*/, "").trim();

  optionKeys.forEach((key, index) => {
    const option = optionsArray[index] || "";

    if (typeof option === "string") {
      mapped[key] = { text: stripLabel(option) };
    } else {
      mapped[key] = {
        text: stripLabel(option.text || ""),
        imageUrl: option.imageUrl || "",
      };
    }
  });

  return mapped;
};
 
 
  const handleConvert = () => {
    try {
      const parsed = JSON.parse(rawData);
      if (!Array.isArray(parsed)) throw new Error('Input must be an array');
      setQuestions(parsed);
    } catch (err) {
      alert('Invalid JSON format. Please make sure it\'s a valid array.');
    }
  };

  const handleQuestionUpdate = (index, updatedQuestion) => {
    const updated = [...questions];
    updated[index] = updatedQuestion;
    setQuestions(updated);
  };

const handleSaveToDB = async () => {
  const enrichedQuestions = questions.map((q) => ({
    type: q.type || "MCQ",
    question: {
      text: typeof q.question === "string" ? q.question : q.question?.text || "",
      imageUrl: q.imageUrl || q.question?.imageUrl || "",
    },
    options: normalizeOptions(q.options),
    correctOption: q.correctOption || "",
    answer: q.answer || "",
    explanation: q.explanation || "",
    publication: q.publication || "",
    level: q.level || "Medium",
    subject: meta.subject || q.subject || "Unknown",
    topic: meta.topic || q.topic || "Unknown",
    unit: meta.unit || q.unit || "",
  }));

  try {
    const res = await fetch("/api/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enrichedQuestions),
    });

    const data = await res.json();
    if (res.ok) {
      alert(`✅ Successfully saved ${data.insertedCount} questions to MongoDB.`);
    } else {
      console.error(data);
      alert("❌ Failed to save questions.");
    }
  } catch (err) {
    console.error("Save Error:", err);
    alert("❌ Unexpected error occurred.");
  }
};


  return (
    <div className='w-[100%] '>
      <div className="max-w-5xl mx-auto p-6 ">
      <h1 className="text-2xl font-bold mb-4">MCQ Editor & Converter</h1>

      <textarea
        rows={8}
        className="w-full border p-3 font-mono text-sm"
        placeholder="Paste question array JSON here"
        value={rawData}
        onChange={(e) => setRawData(e.target.value)}
      />

      <div className="flex gap-4 my-4">
        <input
          className="border p-2 flex-1"
          placeholder="Subject"
          value={meta.subject}
          onChange={(e) => setMeta({ ...meta, subject: e.target.value })}
        />
        <input
          className="border p-2 flex-1"
          placeholder="Topic"
          value={meta.topic}
          onChange={(e) => setMeta({ ...meta, topic: e.target.value })}
        />
        <input
          className="border p-2 flex-1"
          placeholder="Unit"
          value={meta.unit}
          onChange={(e) => setMeta({ ...meta, unit: e.target.value })}
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleConvert}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Render Questions
        </button>

        {questions.length > 0 && (
          <button
            onClick={handleSaveToDB}
            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ${isSaving ? 'opacity-60' : ''}`}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save to DB'}
          </button>
        )}
      </div>

      {questions.length > 0 && (
        <QuestionRenderer
          questions={questions}
          meta={meta}
          onUpdate={handleQuestionUpdate}
        />
      )}

      {/* <pre className="mt-6 bg-gray-100 p-4 rounded text-sm">
        {JSON.stringify(questions, null, 2)}
      </pre> */}
    </div>
    </div>
    
  );
}
