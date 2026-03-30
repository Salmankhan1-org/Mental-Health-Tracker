'use client'
import React, { useEffect, useState } from 'react'
import { StatsCard } from '../stat-card'
import { AlertTriangle, Calendar, FileCheck, Stethoscope, Users } from 'lucide-react'
import { ToastFunction } from '@/helper/toast-function'
import axios from 'axios'
import { Skeleton } from '@/components/ui/skeleton'

// Icon mapping helper
const iconMap: Record<string, any> = {
  users: Users,
  counsellor: Stethoscope,
  pending: FileCheck,
  appointment: Calendar,
  alert: AlertTriangle,
};

const AdminStatCards = () => {
    const [adminMetrics, setAdminMetrics] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAdminMetrics = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/users/admin/dashboard/stats`, {
                withCredentials: true
            });

            if (response.data.success) {
                setAdminMetrics(response.data.data);
            }
        } catch (error) {
            ToastFunction('error', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAdminMetrics();
    }, []);

    // 1. Loading State (Skeleton)
    if (loading) {
        return (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-43 rounded-xl border bg-card animate-pulse p-6">
                        <div className="flex justify-between">
                            <div className="space-y-4">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-8 w-12" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-10 w-10 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // 2. Data State
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {adminMetrics.map((stat, index) => {
                const IconComponent = iconMap[stat.icon] || Users;
                
                // Ensure growth is a valid number before passing it to the trend
                const hasValidGrowth = typeof stat.growth === 'number' && !isNaN(stat.growth);

                return (
                <StatsCard
                    key={index}
                    label={stat.label}
                    value={stat.value ?? 0} // Fallback to 0 if value is missing
                    icon={IconComponent}
                    trend={hasValidGrowth ? { 
                        value: Math.abs(stat.growth), 
                        isPositive: stat.growth >= 0 
                    } : undefined} // If NaN or null, don't show the trend at all
                    highlight={stat.isCritical && stat.value > 0}
                />
                );
            })}
        </div>
    )
}

export default AdminStatCards