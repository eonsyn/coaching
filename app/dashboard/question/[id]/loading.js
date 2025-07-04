// app/dashboard/question/[id]/loading.js

export default function LoadingQuestionPage() {
  return (
    <div className="px-6 py-4 max-w-4xl mx-auto font-puritan animate-pulse">
      {/* Skeleton Question Box */}
      <div className="p-6 rounded-2xl shadow-xl w-full bg-card border border-lightblue space-y-4">
        <div className="h-6 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />

        {/* Option Skeletons */}
        <div className="space-y-2 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded-md" />
          ))}
        </div>

        {/* Input Field Placeholder */}
        <div className="h-10 bg-gray-200 rounded-md mt-4 w-1/2" />

       {/* Bottom Buttons */}
      <div className="mt-8 pb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-gray-300 text-white w-40 h-10 animate-pulse"></div>

        <div className="px-5 py-2.5 w-full sm:w-auto rounded-md bg-gray-300 text-white h-10 animate-pulse"></div>

        <div className="flex items-center gap-2 px-5 py-2.5 rounded-md bg-gray-300 text-white w-40 h-10 animate-pulse"></div>
      </div>
      </div>
 
    </div>
  );
}
