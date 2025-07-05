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
import Image from 'next/image';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { HiOutlineChartBar } from 'react-icons/hi';

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
    <div className="bg-[var(--card-bg)] text-[var(--foreground)] px-6 w-full max-w-5xl mx-auto shadow-xl rounded-2xl space-y-10 font-sans transition-all pb-12 duration-300">

      {/* Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 pt-8">
        {/* Profile Image */}
        <div className="relative h-full w-52 flex-shrink-0 rounded-2xl overflow-hidden group">
          <Image
            src="/assets/profile.png"
            alt="Profile"
            width={208}
            height={208}
            className="z-10 relative transition-all duration-300 group-hover:-translate-y-1"
          />
          <div className="w-full h-40 bg-[var(--primary)] rounded-t-full absolute bottom-0 left-0" />
        </div>

        {/* Info */}
        <div className="flex-1 w-full">
          <div className="bg-[var(--primary)] text-[var(--light)] p-6 rounded-xl border border-dashed shadow-sm space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold capitalize">{name}</h1>
            </div>

            <div className="pt-2 space-y-3">
              <h2 className="text-xl font-semibold">Score Summary</h2>

              <div className="text-base font-medium">
                <span className="bg-yellow-100 text-yellow-900 px-3 py-1 rounded-md shadow-sm">
                  Total Score: <span className="font-bold">{score}</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <span className="flex items-center gap-2 bg-[var(--success)]/10 text-[var(--success)] px-3 py-1 rounded-full shadow-sm">
                  <FaCheckCircle />
                  Correct: <strong>{correctQuestion.length}</strong>
                </span>

                <span className="flex items-center gap-2 bg-[var(--danger)]/10 text-[var(--danger)] px-3 py-1 rounded-full shadow-sm">
                  <FaTimesCircle />
                  Incorrect: <strong>{incorrectQuestion.length}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-[var(--background)] rounded-xl border border-[var(--border-color)] p-6 h-[320px] shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-[var(--foreground)]">
          <HiOutlineChartBar className="text-[var(--highlight)] text-2xl" />
          Performance Over Time
        </h2>

        {data.length === 0 ? (
          <p className="text-[var(--muted)] text-sm">No performance data yet.</p>
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
