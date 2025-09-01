import React, { useEffect, useState } from "react";
import TestPaper from "./TestPaper";
import RenderMathx from "@/components/RenderMathx";
import { IoIosCloseCircleOutline } from "react-icons/io";

function Step2({
  selectedChapter,
  setStep,
  setSelectedChapter,
  chapters,
  setQuestionCount,
  setduration,
  generateQuestions,
  questionCount,
  duration,
  setQuestions,
  questions,
  subject,
}) {
  const [data, setData] = useState({ questions: [], totalPages: 0 });
  const [type, setType] = useState("mains");
  const [page, setPage] = useState(0);
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async (chapterId, chapterType, pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/subject/chapter?chapterId=${chapterId}&type=${chapterType}&page=${pageNum}`
      );
      const tdata = await res.json();
      setData((prev) => ({
        questions: [...prev.questions, ...tdata.questions],
        totalPages: tdata.totalPages,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // fetch whenever chapter/type changes
  useEffect(() => {
    if (!selectedChapter) return;
    setData({ questions: [], totalPages: 0 }); // reset when changing chapter
    setPage(0);
    fetchQuestions(selectedChapter, type, 0);
  }, [selectedChapter, type]);

  // fetch more on page change
  useEffect(() => {
    if (page === 0) return;
    fetchQuestions(selectedChapter, type, page);
  }, [page]);

  // Toggle question selection
  const toggleQuestion = (ques) => {
    if (questions.some((q) => q._id === ques._id)) {
      // Remove if already added
      setQuestions((prev) => prev.filter((q) => q._id !== ques._id));
    } else {
      // Add if not present
      setQuestions((prev) => [...prev, ques]);
    }
  };

  return (
    <div className="w-full relative flex-shrink-0 p-4">

      {/* Questions Popup */}
      {popup && (
        <div className="popupdiv absolute top-16 right-8 w-[480px] max-h-[80vh] bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-700 rounded-lg overflow-y-auto p-6 z-50">
          <div className="flex sticky p-2 z-50 bg-primary rounded-2xl top-0 justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Select Questions <span className="font-medium ml-1">{questions.length}</span>
            </h3>
            <button
              onClick={() => setPopup(false)}
              className="text-red-500 hover:text-red-700 font-bold text-xl"
            >
              <IoIosCloseCircleOutline className="text-2xl font-bold" />
            </button>
          </div>

          <div className="space-y-2">
            {data.questions.map((item) => {
              const isAdded = questions.some((q) => q._id === item._id);
              return (
                <div
                  key={item._id}
                  onClick={() => toggleQuestion(item)}
                  className={`p-3 rounded-lg cursor-pointer shadow transition-colors duration-200 ${
                    isAdded
                      ? "bg-red-400 text-white hover:bg-red-500"
                      : "bg-green-200 text-black hover:bg-green-300"
                  }`}
                >
                  <RenderMathx text={item.question.text} />
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          {page + 1 < data.totalPages && (
            <button
              disabled={loading}
              onClick={() => setPage((prev) => prev + 1)}
              className="w-full mt-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
            >
              {loading ? "Loading..." : "Load More Questions"}
            </button>
          )}
        </div>
      )}

      {/* Form Section */}
      <div className="bg-[var(--bg-secondary)] p-6 rounded-xl shadow border border-[var(--bg-accent)] mt-4">
        <form>
          <label className="block mb-2 font-semibold">Select Chapter:</label>
          <select
            className="w-full p-3 rounded-lg bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
          >
            <option value="">-- Choose Chapter --</option>
            {chapters.map((ch) => (
              <option key={ch._id} value={ch._id}>
                {ch.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setPopup(!popup)}
            className="bg-[var(--bg-tertiary)] px-3 py-1 rounded-lg mt-3  transition-colors"
          >
            Custom Paper?
          </button>

          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full mt-4 p-3 rounded-lg bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="mains">Mains</option>
            <option value="advance">Advance</option>
          </select>

          {questions.length != 0 && (<><label className="block mt-4 mb-2 font-semibold">Number of Questions:</label>
          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full p-3 rounded-lg bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
            min={1}
            max={15}
          /></>)}

          <label className="block mt-4 mb-2 font-semibold">Test Duration (minutes):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setduration(e.target.value)}
            className="w-full p-3 rounded-lg bg-[var(--bg-tertiary)] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex justify-between items-center mt-6">
            <button type="button" className="text-[var(--secondary)] hover:underline">
              Back
            </button>
            {
                questions.length === 0 ? (<button
              type="button"
              disabled={!selectedChapter}
              onClick={generateQuestions}
              className="bg-[var(--primary)] text-white px-5 py-2.5 rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-200"
            >
              Generate Random Paper
            </button>):(<button
              type="button"
              disabled={!selectedChapter}
              onClick={
                ()=>{
                    setStep(3)
                }
              }
              className="bg-[var(--primary)] text-white px-5 py-2.5 rounded-lg hover:bg-[var(--primary-dark)] transition-colors duration-200"
            >
              Generate Custom Paper
            </button>)
            }
            
          </div>
        </form>
      </div>
    </div>
  );
}

export default Step2;
