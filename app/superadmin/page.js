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

  const promptText = `Task:
Extract all questions from the attached PDF and convert them into a valid JSON array using the strict schema provided below.
All mathematical expressions must be converted into proper inline LaTeX, wrapped in $...$.
Ensure that all math is accurately preserved and rendered correctly. If any expression appears to be broken or incomplete, fix it using LaTeX standards wherever logically possible.

✅ Output Instructions:
Divide the total output into 3 parts.

After sending each part, wait for my reply "next" before continuing.

Each part must be a valid JSON array — strictly no extra text, comments, markdown, or formatting outside the JSON.

Ensure every question is fully parseable JSON.

✅ LaTeX Formatting Rules (Strict):
All math expressions must follow proper LaTeX standards. Wrap every math part in $...$.
Convert any raw math-like text or pseudo-LaTeX from the PDF to valid LaTeX. Pay attention to:

Integrals: $\\int x^2 \\, dx$

Fractions: $\\frac{a}{b}$

Matrices: $\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$

Limits/Sums/Products: $\\lim_{x \\to \\infty}$, $\\sum_{i=1}^{n}$, $\\prod_{i=1}^{n}$

Roots: $\\sqrt{x}$, $\\sqrt[n]{y}$

Complex numbers: $z = x + iy$, $\\arg(z)$, $|z|$

Greek letters: $\\theta$, $\\pi$, $\\alpha$, $\\beta$, etc.

Vectors or modulus: $|\\vec{A}|$, $\\hat{i}$, $\\vec{F}$

Special characters: escape underscore (_ as \\_) and percent (% as \\%) where needed.

Ensure \left, \right are used for scalable brackets: e.g., $\left| \arg\left(\frac{z - 1}{z + 1} \right) \right|$.

  JSON Output Format (Strict)
 
[
  {
    "type": "MCQ" | "MSQ" | "Numerical" | "Descriptive",
    "question": {
      "text": "Full question text with valid LaTeX (math in $...$).",
      "imageUrl": ""
    },
    "options": {
      "option1": { "text": "Option A", "imageUrl": "" },
      "option2": { "text": "Option B", "imageUrl": "" },
      "option3": { "text": "Option C", "imageUrl": "" },
      "option4": { "text": "Option D", "imageUrl": "" }
    },
    "correctOption": ["optionX"],
    "answer": "",
    "topic": "", //if you find topic then write it there otherwise dont write leave blank
    "askedIn": {
          "exam": "Exam Name (e.g., JEE Main)",
          "year": Number,  // e.g., 2019
          "date": String, // e.g., "12 Jan I"
          "marks": Number // e.g., 3 (for "3M")
    }
  }
]
  Notes & Rules
Always divide questions into 3 equal parts (if possible).

Wait for the prompt “next” before sending the next batch.

Only use this exact structure — do not include fields like explanation, difficulty, tags, etc.

If an image is present with a question or option, extract and place its URL in imageUrl; otherwise, leave it as an empty string.

If the correct answer is not available, set:

"correctOption": []

"answer": ""

Always validate the final JSON output — it must be parsable without any extra characters, newlines outside strings, or trailing commas.

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
