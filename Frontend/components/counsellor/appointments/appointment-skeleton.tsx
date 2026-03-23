import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export  const AppointmentSkeleton = () => (
  <Card className="relative py-2 overflow-hidden border-l-4 border-l-muted animate-pulse">
    <div className="p-2">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Name */}
            <Skeleton className="h-3 w-16 rounded-full" /> {/* Badge */}
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-md" /> {/* More Icon */}
      </div>

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-2 gap-y-3 mb-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      {/* Footer Action Skeleton */}
      <div className="flex gap-2 pt-4 border-t">
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  </Card>
);