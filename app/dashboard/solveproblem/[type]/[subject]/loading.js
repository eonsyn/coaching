import React from 'react';
import { IoIosBook } from "react-icons/io";

const SkeletonCard = () => (
  <div className="animate-pulse p-4 h-28 bg-card border border-gray-200 dark:border-[--color-highlight]/10 rounded-xl shadow-sm">
    <div className="flex items-start gap-4">
      <div className="bg-gray-300 dark:bg-gray-700 rounded-full w-7 h-7 mt-1" />
      <div className="flex flex-col gap-2 w-full">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
      </div>
    </div>
  </div>
);

export default function Loading() {
  return (
    <div className="px-6 bg-background text-foreground font-puritan">
      <h2 className="text-xl font-semibold text-textprimary mb-6">Loading Chapters...</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
