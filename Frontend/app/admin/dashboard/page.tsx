
import { StatusBadge } from '@/components/admin/status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Users,
  Stethoscope,
  FileCheck,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { mockAdminMetrics, mockReports, mockAdminAppointments } from '@/lib/admin-mock-data'
import Link from 'next/link'
import { StatsCard } from '@/components/admin/stat-card'

export const metadata = {
  title: 'Admin Dashboard - MindBridge',
  description: 'Admin panel dashboard with key metrics and alerts',
}

export default function AdminDashboard() {
  const criticalReports = mockReports.filter(
    (r) => r.severity === 'critical' && r.status !== 'resolved'
  )
  const recentAppointments = mockAdminAppointments.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <StatsCard
            label="Total Users"
            value={mockAdminMetrics.totalUsers}
            icon={Users}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            label="Active Counsellors"
            value={mockAdminMetrics.activeCounsellors}
            icon={Stethoscope}
            trend={{ value: 5, isPositive: true }}
          />
          <StatsCard
            label="Pending Approvals"
            value={mockAdminMetrics.pendingApprovals}
            icon={FileCheck}
          />
          <StatsCard
            label="Total Appointments"
            value={mockAdminMetrics.totalAppointments}
            icon={Calendar}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            label="Critical Reports"
            value={mockAdminMetrics.criticalReports}
            icon={AlertTriangle}
            highlight={mockAdminMetrics.criticalReports > 0}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Critical Alerts */}
        {criticalReports.length > 0 && (
          <Card className="lg:col-span-2 border-destructive/50 bg-destructive/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h3 className="text-lg font-bold text-foreground">
                  Critical Alerts ({criticalReports.length})
                </h3>
              </div>
              <Link href="/admin/reports?severity=critical">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {criticalReports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-lg border border-destructive/20 bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">
                        {report.reason}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {report.reportedByName} reported {report.againstName}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {report.description}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/reports?id=${report.id}`}>
                        Review
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-bold text-foreground">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-primary/10 p-2 flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Appointment Completed</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-accent/10 p-2 flex-shrink-0">
                <Clock className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">New Appointment Booked</p>
                <p className="text-xs text-muted-foreground">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-destructive/10 p-2 flex-shrink-0">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Critical Report Filed</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-secondary/10 p-2 flex-shrink-0">
                <FileCheck className="h-4 w-4 text-secondary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Counsellor Application</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Appointments */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Recent Appointments</h3>
          <Link href="/admin/appointments">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Counsellor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((apt) => (
                <tr key={apt.id} className="border-b border-border/50 hover:bg-secondary/50">
                  <td className="px-4 py-3 text-sm text-foreground">{apt.studentName}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{apt.counsellorName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(apt.scheduledAt).toLocaleDateString()} at{' '}
                    {new Date(apt.scheduledAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={apt.status}
                      type="appointment-status"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
