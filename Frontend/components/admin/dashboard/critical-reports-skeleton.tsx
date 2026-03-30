import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const CriticalReportsSkeleton = () => {
  return (
    <Card className="lg:col-span-2 border-destructive/20 bg-destructive/5 p-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded-full bg-destructive/20" />
          <Skeleton className="h-6 w-48 bg-destructive/10" />
        </div>
        <Skeleton className="h-8 w-20 bg-destructive/10" />
      </div>

      {/* Alert Item Skeletons */}
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div 
            key={i} 
            className="rounded-lg border border-destructive/10 bg-white/50 p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2">
                {/* Reason Title */}
                <Skeleton className="h-5 w-3/4" />
                {/* Reported By Text */}
                <Skeleton className="h-4 w-1/2" />
                {/* Description snippet */}
                <div className="pt-2 space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
              {/* Review Button */}
              <Skeleton className="h-8 w-16 ml-4" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};