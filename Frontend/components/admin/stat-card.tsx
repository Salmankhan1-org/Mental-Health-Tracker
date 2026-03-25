import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  highlight?: boolean
  className?: string
}

export function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  highlight,
  className,
}: StatsCardProps) {
  return (
    <div
    className={cn(
        'rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md',
        highlight && 'border-destructive bg-destructive/5',
        className
    )}
    >
    <div className="flex items-start justify-between gap-4 min-w-0">
        
        <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>

        <p className="mt-2 text-2xl md:text-3xl font-bold text-foreground truncate">
            {value}
        </p>

        {trend && (
            <p
            className={cn(
                'mt-2 text-xs font-semibold',
                trend.isPositive ? 'text-primary' : 'text-destructive'
            )}
            >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
            </p>
        )}
        </div>

        <div
        className={cn(
            'rounded-lg p-3 shrink-0 flex items-center justify-center',
            highlight
            ? 'bg-destructive/10 text-destructive'
            : 'bg-primary/10 text-primary'
        )}
        >
        <Icon className="h-6 w-6" />
        </div>

    </div>
    </div>
  )
}
