const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-indigo-100/60 rounded-lg ${className}`} />
);

export const ReceiptScanSkeleton = () => (
  <div className="space-y-4 p-2">
    <Skeleton className="h-40 w-full" />
    <div className="grid grid-cols-2 gap-3">
      <Skeleton className="h-10" />
      <Skeleton className="h-10" />
      <Skeleton className="h-10 col-span-2" />
      <Skeleton className="h-10" />
      <Skeleton className="h-10" />
    </div>
    <Skeleton className="h-11 w-full" />
  </div>
);

export const InsightsPageSkeleton = () => (
  <div className="ai-insights-grid">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="ai-insight-card ai-insight-card--violet" style={{ opacity: 0.7 }}>
        <Skeleton className="h-6 w-1/2 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    ))}
  </div>
);

export default Skeleton;
