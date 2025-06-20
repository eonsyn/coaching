'use client';
import { useEffect, useState } from 'react';
import QuestionRenderer from '@/components/superadmin/QuestionRenderer';
import MetaData from '@/components/superadmin/MetaData';
export default function Page() {
  const [rawData, setRawData] = useState(``);


  const [questions, setQuestions] = useState([]);
  const [meta, setMeta] = useState({ subject: 'Mathematics', topic: '', unit: '' });
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

  // useEffect(() => {
  //   console.log("test", questions)
  // }, [questions])

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
      options: q.options,
      correctOption: q.correctOption || "",
      answer: q.answer || "",
      explanation: q.explanation || "",
      publication: q.publication || "",
      level: q.level || "Medium",
      subject: meta.subject || q.subject || "Unknown",
      topic: meta.topic || q.topic || "Unknown",
      unit: meta.unit || q.unit || "",
      askedIn: q.askedIn || "",
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

  const promptText = `Task: Extract all questions from this PDF and format them as an array of JSON objects using the specified schema.
Important: Return the output in 3 parts. When I say "next", continue with the next part.
Each part should return a clean array of questions only, strictly in the following JSON format (no extra text or HTML).

Output Format:
[
  {
    "type": "MCQ" | "Numerical" | "Descriptive",
    "question": {
      "text": "Question text with LaTeX math like $\\int x^2 dx$ if present.",
      "imageUrl": ""
    },
    "options": {
      "option1": { "text": "Option A", "imageUrl": "" },
      "option2": { "text": "Option B", "imageUrl": "" },
      "option3": { "text": "Option C", "imageUrl": "" },
      "option4": { "text": "Option D", "imageUrl": "" }
    },
    "correctOption": "optionX",
    "answer": "",
    askedIn: {
  exam: String,   // e.g., "JEE Main"
  year: Number,   // e.g., 2019
  date: String,   // e.g., "12 Jan I"
  marks: Number,  // e.g., 3 (for "3M")
 },


  }
]

Rules & Notes:
- Divide the PDF content into 3 parts. Wait for my “next” before proceeding to the next one.
- Preserve any math expressions using LaTeX syntax with $...$.
- If a question or option contains an image, fill imageUrl with the extracted URL (else leave it as "").
- For MCQs, use correctOption if the answer key is available.
- For Numerical or Descriptive, fill the "answer" field with the actual answer if known.
- If the correct answer is missing, leave both "correctOption" and "answer" as empty strings.
- Do not include any extra fields (like explanations, createdBy, etc.)
- Return a clean array of JSON objects only. No wrapping text, no formatting tags, and no extra explanations.
`;
  const handlecopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      alert('Prompt copied to clipboard!');
    } catch (error) {
      alert('Failed to copy the prompt. Please try again.');
    }
  }
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
        <button onClick={handlecopy} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Copy Prompt</button>

        <MetaData setMeta={setMeta} meta={meta} />
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
