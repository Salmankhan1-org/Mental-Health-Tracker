import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const RecentAppointmentsSkeleton = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="space-y-4">
        {/* Table Header Skeleton */}
        <div className="grid grid-cols-4 gap-4 pb-2 border-b">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
        
        {/* Table Rows Skeleton */}
        {[1, 2, 3, 4, 5].map((row) => (
          <div key={row} className="grid grid-cols-4 gap-4 py-3 border-b border-border/50">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </Card>
  );
};