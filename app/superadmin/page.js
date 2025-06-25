'use client';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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

Extract all questions from the attached PDF topic-wise.

For each topic:
- Extract all questions belonging to that topic together.
- Once one topic is complete, wait for my input "next" before continuing to the next topic.

Important:
Solutions and explanations are mentioned at the end of the PDF — match them with the respective questions and map them into the "answer" and "explanation" fields accurately.

Output Instructions:

- Convert each question into a **valid JSON array**, using the exact schema below.
- Each output should contain **only one topic’s questions**.
- Output only JSON — no extra text, no markdown, no comments, no trailing commas.

LaTeX Formatting Rules (Strict):

- Wrap all math expressions in \`$\`...\`$\`
- Use correct LaTeX syntax and escape special characters.
- Examples:
  - Integrals: \`$\\int x^2\\, dx$\`
  - Fractions: \`$\\frac{a}{b}$\`
  - Matrices: \`$\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}$\`
  - Limits: \`$\\lim_{x \\to \\infty}$\`
  - Roots: \`$\\sqrt{x}$\`
  - Complex: \`$z = x + iy$, $\\arg(z)$\`
  - Vectors: \`$\\vec{A}$\`, \`$\\hat{i}$\`, \`$|\\vec{F}|$\`
  - Brackets: use \`\\left\` and \`\\right\`
  - Escape characters like \`_\` as \`\\_\`, \`%\` as \`\\%\`

JSON Schema Format (Strict):

[
  {
    "type": "MCQ" | "MSQ" | "Numerical" | "Descriptive",
    "question": {
      "text": "Question text with LaTeX (math in $...$)",
      "imageUrl": ""
    },
    "options": {
      "option1": { "text": "", "imageUrl": "" },
      "option2": { "text": "", "imageUrl": "" },
      "option3": { "text": "", "imageUrl": "" },
      "option4": { "text": "", "imageUrl": "" }
    },
    "correctOption": ["optionX"],  // Use [] if unknown
    "answer": "Direct answer in plain text or LaTeX",
    "explanation": [
      {
        "text": "Explanation block 1 (can include LaTeX)",
        "imageUrl": ""
      },
      {
        "text": "Explanation block 2 (if any)",
        "imageUrl": ""
      }
    ],  
    "topic": "Topic name",
    "level": "Easy" | "Medium" | "Hard",
    "askedIn": {
      "exam": "",
      "year": 2020,
      "date": "",
      "marks": 3
    }
  }
]

Strict Rules:

- Group output strictly by topic — each JSON array must contain **only one topic’s questions**.
- Do not include questions from multiple topics in a single output.
- Do not add or remove any fields from the schema.
- Remove labels like (a), (b), 1., 2., etc., from option texts.
- If correct answer is unknown:
  - Set \`"correctOption": []\`
  - Leave \`"answer": ""\`, and \`"explanation": []\`
- If any image is present, insert the extracted URL; else keep \`"imageUrl": ""\`
- Final JSON must be clean, 100% valid, and fully parseable
`;



  const handlecopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      toast.success('Prompt copied to clipboard!');
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
