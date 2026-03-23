import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const StatsCardSkeleton = ({statsConfig}:any) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat:any) => (
          <Card key={stat.title} className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" /> {/* Title Skeleton */}
              <Skeleton className="h-8 w-8 rounded-lg" /> {/* Icon Skeleton */}
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-16" /> {/* Value Skeleton */}
            </CardContent>
          </Card>
        ))}
      </div>
  )
}

export default StatsCardSkeleton