'use client'

import { Users, Calendar, XCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const stats = [
  {
    title: 'Total Sessions This Week',
    value: '12',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Upcoming Sessions',
    value: '4',
    icon: Calendar,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Cancelled Sessions',
    value: '1',
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    title: 'Completion Rate',
    value: '92%',
    icon: TrendingUp,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
