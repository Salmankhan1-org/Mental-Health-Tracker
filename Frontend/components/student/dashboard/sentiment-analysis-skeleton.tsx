import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SentimentAnalysisSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>

      <CardContent>
        {/* Pie Chart Skeleton */}
        <div className="mb-6 flex justify-center">
          <Skeleton className="h-50 w-50 rounded-full" />
        </div>

        {/* Legend Skeleton */}
        <div className="mb-4 flex items-center justify-center gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Skeleton className="h-2.5 w-2.5 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>

        {/* Recent Emotions Section */}
        <div className="border-t border-border pt-4">
          <Skeleton className="mb-3 h-3 w-40" />

          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton
                key={item}
                className="h-6 w-20 rounded-full"
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}