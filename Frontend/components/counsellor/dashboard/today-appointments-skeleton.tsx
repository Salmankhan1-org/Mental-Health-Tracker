import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TodayAppointmentsSkeleton = () => (
  <Card className="border-none shadow-sm bg-white overflow-hidden">
    <CardHeader className="pb-3 border-b border-slate-50">
      <CardTitle className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </CardTitle>
    </CardHeader>
    <CardContent className="p-0">
      <div className="divide-y divide-slate-50">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <Skeleton className="h-3 w-48" />
            <div className="flex gap-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default TodayAppointmentsSkeleton;