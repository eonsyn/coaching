export default function QuesitonLoading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-6 w-1/3 bg-muted rounded mb-6"></div>
      <ul className="space-y-4">
        {[...Array(7)].map((_, i) => (
          <li key={i} className="bg-card border border-border rounded-lg p-4">
            <div className="h-4 w-11/12 bg-muted rounded mb-2"></div>
            <div className="h-4 w-9/12 bg-muted rounded"></div>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex items-center justify-between text-sm max-w-md mx-auto">
        <div className="h-8 w-20 bg-muted rounded"></div>
        <div className="h-4 w-24 bg-muted rounded"></div>
        <div className="h-8 w-20 bg-muted rounded"></div>
      </div>
    </div>
  );
}
