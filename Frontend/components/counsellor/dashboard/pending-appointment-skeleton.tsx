import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const PendingRequestsSkeleton = () => (
  <Card className="border-none shadow-sm bg-white">
    <CardHeader className="pb-3 border-b border-slate-50">
      <CardTitle className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </CardTitle>
    </CardHeader>
    <CardContent className="p-4 space-y-4">
      {[1, 2,3,4].map((i) => (
        <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30 space-y-3">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-5 w-12 rounded-md" />
          </div>
          <Skeleton className="h-4 w-20 rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-8 flex-1 rounded-md" />
            <Skeleton className="h-8 flex-1 rounded-md" />
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);