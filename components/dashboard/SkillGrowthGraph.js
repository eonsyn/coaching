"use client";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const data = [
  { day: "Day 1", skill: 5 },
  { day: "Day 2", skill: 10 },
  { day: "Day 3", skill: 20 },
  { day: "Day 4", skill: 35 },
  { day: "Day 5", skill: 50 },
  { day: "Day 6", skill: 70 },
  { day: "Day 7", skill: 85 },
  { day: "Day 8", skill: 95 },
];

export default function SkillGrowthGraph() {
  return (
    <div className="w-full h-[300px] p-3">
      <h2 className="text-xl font-bold mb-4 text-center">  Your Skill Over Time</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="skill" stroke="#8884d8" strokeWidth={3} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
