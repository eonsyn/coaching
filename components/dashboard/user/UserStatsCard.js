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
import StudentBadge from './StudentBadge';
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
    <div className="user bg-card text-textprimary px-6  w-full md:max-w-5xl mx-auto md:shadow-xl md:rounded-2xl space-y-10 font-puritan transition-all pb-12 duration-300">

      {/* 👤 Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6">

        {/* Profile Image */}
        <div className="relative group h-full w-52 flex-shrink-0 rounded-2xl overflow-hidden  ">
          <Image
            src="/assets/profile.png"
            alt="Profile"
            width={208}
            height={208}
            className="z-10 relative transition-all ease-in-out duration-300 group-hover:-translate-y-1"
          />
          <div className="w-full bg-darkblue rounded-t-full h-40 absolute bottom-0 left-0" />
        </div>

        {/* Profile & Score Summary */}
        <div className="flex-1 w-full">
          <div className="bg-darkblue p-6 rounded-xl border border-dashed border-darkblue shadow-sm space-y-4 w-full">

            {/* Name & Email */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold capitalize flex items-center text-lightblue gap-2">
                {name}
              </h1>
              {/* <p className="text-sm flex items-center gap-2 text-highlight">
                <FaEnvelope className="text-highlight text-base" />
                {email}
              </p> */}
            </div>

            {/* Score Summary */}
            <div className="pt-2 space-y-3">
              <h2 className="text-xl font-bold text-lightblue flex items-center gap-2">
                {/* <CiMedal className="text-2xl text-yellow-500" /> */}
                Score Summary
              </h2>

              <div className="text-base text-purple-700 font-medium">
                <span className="bg-yellow-100 px-3 py-1 rounded-md shadow-sm">
                  Total Score: <span className="font-bold text-purple-900">{score}</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-gray-800">
                <span className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full shadow-sm">
                  <FaCheckCircle className="text-green-500" />
                  Correct: <strong>{correctQuestion.length}</strong>
                </span>

                <span className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full shadow-sm">
                  <FaTimesCircle className="text-red-500" />
                  Incorrect: <strong>{incorrectQuestion.length}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📈 Performance Chart */}
      <div className="bg-background rounded-xl border pb-4 border-gray-200 p-6 h-[320px] shadow-sm">
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
