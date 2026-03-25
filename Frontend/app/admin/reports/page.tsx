'use client'

import { useState, useMemo } from 'react'
import { StatusBadge } from '@/components/admin/status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, AlertTriangle } from 'lucide-react'
import { mockReports } from '@/lib/admin-mock-data'
import { ReportSeverity, ReportStatus } from '@/lib/admin-types'
import ReportDetailsModal from '@/components/admin/report-details-modal'

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [severityFilter, setSeverityFilter] = useState<ReportSeverity | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all')
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  const filteredReports = useMemo(() => {
    return mockReports.filter((report) => {
      const matchesSearch =
        report.reportedByName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.againstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reason.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter

      return matchesSearch && matchesSeverity && matchesStatus
    })
  }, [searchQuery, severityFilter, statusFilter])

  const criticalCount = filteredReports.filter((r) => r.severity === 'critical').length
  const selectedReportData = mockReports.find((r) => r.id === selectedReport)

  return (
    <div className="space-y-6">
      {/* Header with Critical Alert */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-foreground">Reports Management</h1>
        {criticalCount > 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/5 p-4">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
            <div>
              <p className="font-semibold text-foreground">
                {criticalCount} Critical Report{criticalCount !== 1 ? 's' : ''} Require Immediate Attention
              </p>
              <p className="text-sm text-muted-foreground">
                These reports involve serious violations and need urgent review.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-foreground mb-2">
              Search Reports
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-foreground mb-2">
              Severity
            </label>
            <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as ReportSeverity | 'all')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ReportStatus | 'all')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Reports Table */}
      <Card className="p-6 overflow-x-auto">
        <div className="inline-block w-full">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Reported By
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Against
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Reason
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Severity
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center">
                    <p className="text-muted-foreground">No reports found matching your filters</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-foreground">{report.reportedByName}</td>
                    <td className="px-4 py-3 text-sm text-foreground">{report.againstName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground max-w-xs truncate">
                      {report.reason}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={report.severity}
                        type="report-severity"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={report.status}
                        type="report-status"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedReport(report.id)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Report Details Modal */}
      {selectedReportData && (
        <ReportDetailsModal
          report={selectedReportData}
          isOpen={!!selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  )
}
