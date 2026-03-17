import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function MoodChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-56" />
      </CardHeader>

      <CardContent>
        {/* Chart Area Skeleton */}
        <div className="relative h-65 w-full">
          <Skeleton className="h-full w-full rounded-md" />

          {/* Optional fake grid lines for realism */}
          <div className="absolute inset-0 flex flex-col justify-between py-4 px-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-px w-full bg-border/40"
              />
            ))}
          </div>
        </div>

        {/* Legend Skeleton */}
        <div className="mt-3 flex items-center justify-center gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}