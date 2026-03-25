'use client'

import { useState } from 'react'
import { Report, ReportStatus } from '@/lib/admin-types'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from './status-badge'

interface ReportDetailsModalProps {
  report: Report
  isOpen: boolean
  onClose: () => void
}

export default function ReportDetailsModal({
  report,
  isOpen,
  onClose,
}: ReportDetailsModalProps) {
  const [newStatus, setNewStatus] = useState<ReportStatus | ''>(report.status)
  const [notes, setNotes] = useState(report.notes || '')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async () => {
    if (!newStatus) return
    setIsUpdating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsUpdating(false)
    onClose()
  }

  const getSeverityIcon = () => {
    if (report.severity === 'critical') {
      return <AlertTriangle className="h-5 w-5 text-destructive" />
    }
    return <AlertTriangle className="h-5 w-5 text-accent" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {getSeverityIcon()}
              <div className="flex-1">
                <DialogTitle className="text-xl">{report.reason}</DialogTitle>
                <DialogDescription className="mt-2">
                  Report ID: {report.id}
                </DialogDescription>
              </div>
            </div>
            <StatusBadge
              status={report.severity}
              type="report-severity"
              className="flex-shrink-0"
            />
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Report Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Report Information</h3>
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-secondary/30 p-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Reported By</p>
                <p className="mt-1 text-sm text-foreground">{report.reportedByName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Against</p>
                <p className="mt-1 text-sm text-foreground">{report.againstName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Severity</p>
                <div className="mt-1">
                  <StatusBadge
                    status={report.severity}
                    type="report-severity"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Status</p>
                <div className="mt-1">
                  <StatusBadge
                    status={report.status}
                    type="report-status"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground">Description</h3>
            <p className="text-sm text-foreground leading-relaxed">{report.description}</p>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Timeline</h3>
            <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div className="w-0.5 h-8 bg-border" />
                </div>
                <div className="pb-4">
                  <p className="text-xs font-medium text-muted-foreground">Created</p>
                  <p className="mt-1 text-sm text-foreground">{report.createdAt}</p>
                </div>
              </div>

              {report.updatedAt && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    {report.resolvedAt && <div className="w-0.5 h-8 bg-border" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-xs font-medium text-muted-foreground">Last Updated</p>
                    <p className="mt-1 text-sm text-foreground">{report.updatedAt}</p>
                  </div>
                </div>
              )}

              {report.resolvedAt && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Resolved</p>
                    <p className="mt-1 text-sm text-foreground">{report.resolvedAt}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Update Section */}
          {report.status !== 'resolved' && report.status !== 'rejected' && (
            <div className="space-y-3 border-t border-border pt-4">
              <h3 className="font-semibold text-foreground">Update Status</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    New Status
                  </label>
                  <Select
                    value={newStatus}
                    onValueChange={(v) => setNewStatus(v as ReportStatus)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Admin Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add resolution notes or feedback..."
                    className={cn(
                      'mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground',
                      'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary'
                    )}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {report.status !== 'resolved' && report.status !== 'rejected' && (
            <Button
              onClick={handleStatusChange}
              disabled={!newStatus || isUpdating}
              className={cn(
                report.severity === 'critical' && 'bg-destructive hover:bg-destructive/90'
              )}
            >
              {isUpdating ? 'Updating...' : 'Update Report'}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
