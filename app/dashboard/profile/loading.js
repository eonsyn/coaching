export default function Loading() {
  return (
    <div className="min-h-screen px-6 py-8 bg-background text-foreground animate-pulse">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />

        {/* Score section */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />

        {/* Graph placeholder */}
        <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg mt-4" />
      </div>
    </div>
  );
}
