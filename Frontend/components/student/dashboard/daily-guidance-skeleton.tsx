import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const GuidanceSkeleton = () => (
  <Card className="p-6 space-y-6">
    <div className="flex justify-between">
      <div className="flex gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
    <Skeleton className="h-12 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  </Card>
);
