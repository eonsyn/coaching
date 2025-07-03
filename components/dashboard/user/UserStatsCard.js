'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { FaUser, FaEnvelope, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { HiOutlineChartBar } from 'react-icons/hi';
import { CiMedal } from 'react-icons/ci';

export default function UserStatsCard({ user }) {
  const {
    name,
    email,
    score,
    correctQuestion = [],
    incorrectQuestion = [],
    performanceByDate = {},
  } = user;

  const data = Object.entries(performanceByDate).map(([date, stats]) => ({
    date,
    correct: stats.correctQuestion || 0,
    incorrect: stats.incorrectQuestion || 0,
  }));

  return (
    <div className="user bg-card text-textprimary shadow-xl rounded-2xl p-8 w-full max-w-5xl mx-auto transition-all space-y-8 font-puritan">

      {/* Header + User Details */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold flex items-center gap-2 text-darkblue">
          <FaUser className="text-highlight" />
          Hello, <span className="capitalize">{name}</span>
        </h1>

        <p className="text-sm flex items-center gap-2 text-highlight">
          <FaEnvelope className="text-highlight" />
          {email}
        </p>

        <p className="text-base mt-2 flex items-center gap-2 text-highlight">
          <CiMedal className="text-highlight text-xl" />
          Total Score: <span className="font-bold">{score}</span>
        </p>

        <div className="mt-2 text-sm flex flex-wrap gap-4">
          <span className="flex items-center gap-1 text-success font-medium">
            <FaCheckCircle /> Total Correct: <strong>{correctQuestion.length}</strong>
          </span>
          <span className="flex items-center gap-1 text-error font-medium">
            <FaTimesCircle /> Total Incorrect: <strong>{incorrectQuestion.length}</strong>
          </span>
        </div>
      </div>

      {/* Performance Line Chart */}
      <div className="h-[320px] bg-background rounded-lg p-5 border border-gray-200">
        <h2 className="text-xl font-semibold text-darkblue mb-4 flex items-center gap-2">
          <HiOutlineChartBar className="text-highlight text-2xl" />
          Performance Over Time
        </h2>

        {data.length === 0 ? (
          <p className="text-gray-500 text-sm">No performance data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="correct" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} name="Correct" />
              <Line type="monotone" dataKey="incorrect" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} name="Incorrect" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
