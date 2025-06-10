"use client";
import { useState } from "react";
import QuestionRenderer from "./QuestionRenderer";

export default function QuestionInputForm() {
  const [rawData, setRawData] = useState("");
  const [questions, setQuestions] = useState([]);
  const [meta, setMeta] = useState({ subject: "", topic: "", unit: "" });

  const handleConvert = () => {
    try {
      const parsed = JSON.parse(rawData);
      if (!Array.isArray(parsed)) throw new Error("Input must be an array");
      setQuestions(parsed);
    } catch (err) {
      alert("Invalid JSON");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Input Questions JSON</h2>
      <textarea
        rows={10}
        className="w-full border p-2 my-2"
        placeholder="Paste question array JSON here"
        value={rawData}
        onChange={(e) => setRawData(e.target.value)}
      />
      <div className="flex gap-4 mb-2">
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
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleConvert}>
        Render Questions
      </button>

      {questions.length > 0 && (
        <QuestionRenderer questions={questions} meta={meta} />
      )}
    </div>
  );
}
