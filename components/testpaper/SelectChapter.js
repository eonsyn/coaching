import React from 'react'

function SelectChapter({ questionCount, setQuestionCount, duration, setduration, generateQuestions, loading }) {
  return (
    <div>
      <div>
                  <label className="block mb-1 font-medium">
                    Number of Questions (max 15):
                  </label>
                  <input
                    type="number"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full border p-2 rounded bg-[var(--input-bg)] border-[var(--border-color)]"
                    min={1}
                    max={15}
                  />
                </div>
      
                <div>
                  <label className="block mb-1 font-medium">Test Duration (minutes):</label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setduration(e.target.value)}
                    className="w-full border p-2 rounded bg-[var(--input-bg)] border-[var(--border-color)]"
                  />
                </div>
      
                <button
                  disabled={loading}
                  onClick={generateQuestions}
                  className={`w-full cursor-pointer py-2 px-4 rounded font-medium text-white transition ${loading
                    ? 'bg-[var(--muted)] cursor-not-allowed'
                    : 'bg-[var(--primary)] hover:bg-[var(--primary-light)] text-white'
                    }`}
                >
                  {loading ? 'Generating...' : 'Generate Questions'}
                </button>
    </div>
  )
}

export default SelectChapter
