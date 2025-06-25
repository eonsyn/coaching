'use client';
import React from 'react';

function SelectQuestion({ form, loading, handleChange, handleSubmit }) {
  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Select Subject
          </label>
          <select
            onChange={handleChange}
            name="subject"
            id="subject"
            className="w-full p-2 border rounded-md bg-blue-50 text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          ><option value="Mathematics">Mathematics</option>
            <option value="">-- Choose Subject --</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            
          </select>
        </div>
 
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full p-2 rounded-md text-white font-semibold transition-all ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Loading...' : "Let's Go →"}
        </button>
      </form>
    </div>
  );
}

export default SelectQuestion;
