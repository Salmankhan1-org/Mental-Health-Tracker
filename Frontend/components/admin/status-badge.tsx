import { cn } from '@/lib/utils'
import { ReportSeverity, ReportStatus, UserStatus, AppointmentStatus } from '@/lib/admin-types'
import { CounsellorRequestStatus, CounsellorStatus } from '@/types/types'



interface StatusBadgeProps {
  status:
    | ReportStatus
    | UserStatus
    | AppointmentStatus
    | ReportSeverity
    | CounsellorStatus
    | CounsellorRequestStatus
  type:
    | 'report-status'
    | 'user-status'
    | 'appointment-status'
    | 'report-severity'
    | 'counsellor-status'
    | 'counsellor-request-status'
  className?: string
}

const statusColors = {
  'report-status': {
    open: 'bg-accent text-accent-foreground',
    in_review: 'bg-wellness-warm text-foreground',
    resolved: 'bg-primary text-primary-foreground',
    rejected: 'bg-muted text-muted-foreground',
  },
  'report-severity': {
    low: 'bg-secondary text-secondary-foreground',
    medium: 'bg-accent text-accent-foreground',
    high: 'bg-wellness-warm text-foreground',
    critical: 'bg-destructive text-destructive-foreground',
  },
  'user-status': {
    active: 'bg-primary text-primary-foreground',
    suspended: 'bg-destructive text-white',
    inactive: 'bg-muted text-muted-foreground',
  },
  'appointment-status': {
    pending: 'bg-accent text-accent-foreground',
    scheduled: 'bg-primary text-primary-foreground',
    completed: 'bg-secondary text-secondary-foreground',
    cancelled: 'bg-muted text-muted-foreground',
    completed_by_counsellor: 'bg-primary text-primary-foreground',
  },
  'counsellor-status': {
    active: 'bg-primary text-primary-foreground',
    inactive: 'bg-muted text-muted-foreground',
    on_leave: 'bg-accent text-accent-foreground',
  },
  'counsellor-request-status': {
    pending: 'bg-accent text-accent-foreground',
    approved: 'bg-primary text-primary-foreground',
    rejected: 'bg-destructive text-destructive-foreground',
  },
}

const statusLabels = {
  'report-status': {
    open: 'Open',
    in_review: 'In Review',
    resolved: 'Resolved',
    rejected: 'Rejected',
  },
  'report-severity': {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
  },
  'user-status': {
    active: 'Active',
    suspended: 'Suspended',
    inactive: 'Inactive',
  },
  'appointment-status': {
    pending: 'Pending',
    scheduled: 'Scheduled',
    completed: 'Completed',
    cancelled: 'Cancelled',
    completed_by_counsellor: 'Awaiting Confirmation',
  },
  'counsellor-status': {
    active: 'Active',
    inactive: 'Inactive',
    on_leave: 'On Leave',
  },
  'counsellor-request-status': {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
  },
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const colorClass =
    statusColors[type][status as keyof typeof statusColors[typeof type]]

  const label =
    statusLabels[type][status as keyof typeof statusLabels[typeof type]]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        colorClass,
        className
      )}
    >
      {label}
    </span>
  )
}