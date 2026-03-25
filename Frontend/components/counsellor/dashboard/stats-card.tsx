'use client'

import { Users, Calendar, XCircle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { DashboardAnalytics } from '@/types/types'
import StatsCardSkeleton from './stats-card-skeleton'

// Map UI constants to Backend Keys
const statsConfig = [
  {
    title: 'Total Sessions This Week',
    key: 'totalSessionsThisWeek',
    icon: Users,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Upcoming Sessions',
    key: 'upcomingSessions',
    icon: Calendar,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Cancelled Sessions',
    key: 'cancelledSessions',
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    title: 'Completion Rate',
    key: 'completionRate',
    icon: TrendingUp,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
]

export function StatsCards() {
    const [analyticsData, setAnalyticsData] = useState<DashboardAnalytics | null>(null);
    const [loading, setLoading] = useState(false);
    
    const handleFetchDashboardStats = async () => {
        try {
			setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/counsellors/dashboard/stats`, {
                withCredentials: true
            });

            if (response.data.success) {
                setAnalyticsData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handleFetchDashboardStats();
    }, []);

	if(loading) return <StatsCardSkeleton statsConfig={statsConfig} />

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsConfig.map((stat) => {
                const Icon = stat.icon;
                
                // Pull value from the object using the key defined in statsConfig
                const value = analyticsData 
                    ? analyticsData[stat.key as keyof DashboardAnalytics] 
                    : '0';

                return (
                    <Card key={stat.title} className="border-border shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-foreground">
                                { value}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}