'use client'

import { useState } from 'react'
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  ShieldAlert, 
  FileText,
  Calendar
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
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
import { StatusBadge } from './status-badge'
import { REASON_LABELS } from '@/app/admin/reports/page'
import { ToastFunction } from '@/helper/toast-function'
import axios from 'axios'

// Mapping for better readability in the head

interface ReportDetailsModalProps {
  report: any // Matches your UserReports interface
  isOpen: boolean
  onClose: () => void,
  fetchReports: ()=>void
}

export default function ReportDetailsModal({
  report,
  isOpen,
  onClose,
  fetchReports
}: ReportDetailsModalProps) {
  const [newStatus, setNewStatus] = useState(report.status)
  const [notes, setNotes] = useState(report.notes || '')
  const [isUpdating, setIsUpdating] = useState(false)

	const handleStatusChange = async () => {
		try {
			setIsUpdating(true)
			const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_HOST}/users/admin/report/${report._id}`,
				{status: newStatus, notes},
				{withCredentials: true}
			)
			if(response.data.success){
				onClose();
				fetchReports();
				ToastFunction('success', response.data.message);
			}
		
		} catch (error) {
			ToastFunction('error',error);
		}finally{
			setIsUpdating(false);
		}
	}

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[85vh] flex flex-col p-0 overflow-hidden border-slate-200">
        
        {/* Header Section */}
        <DialogHeader className="p-4 border-b bg-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldAlert className={cn(
                  "h-5 w-5",
                  report.severity === 'critical' ? "text-red-600" : "text-amber-500"
                )} />
                <DialogTitle className="text-xl font-bold text-slate-900">
                  {REASON_LABELS[report.reason] || "Incident Report"}
                </DialogTitle>
              </div>
              <p className="text-xs text-slate-400 font-mono">Case ID: {report._id}</p>
            </div>
            <StatusBadge status={report.severity} type="report-severity" />
          </div>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
          
          {/* Involved Parties Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reported By (Student)</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{report.studentDetails?.name || "Unknown Student"}</p>
              <p className="text-xs text-slate-500 mt-1">ID: {report.reportedBy}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                  <ShieldAlert className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Against (Counsellor)</span>
              </div>
              <p className="text-sm font-bold text-slate-900">{report.counsellorDetails?.name || "Unknown Counsellor"}</p>
              <p className="text-xs text-slate-500 mt-1">ID: {report.against}</p>
            </div>
          </div>

          {/* Incident Description */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" /> Incident Narrative
            </h3>
            <div className="bg-white p-4 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed shadow-sm italic border-l-4 border-l-slate-300">
              "{report.description || "No detailed description provided by the reporter."}"
            </div>
          </div>

          {/* Timeline & Metadata */}
          <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" /> Submission Info
              </h3>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">
                    {format(new Date(report.createdAt), 'PPP')}
                  </p>
                  <p className="text-[10px] text-slate-500">{format(new Date(report.createdAt), 'hh:mm a')}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5" /> Current Status
              </h3>
              <StatusBadge status={report.status} type="report-status" />
            </div>
          </div>

          {/* Status Update Form */}
          {report.status !== 'resolved' && (
            <div className="mt-8 p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
               <h3 className="text-sm font-bold text-indigo-900">Administrative Action</h3>
               
               <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-indigo-700 uppercase">Change Status</label>
                    <Select value={newStatus} onValueChange={(v: any) => setNewStatus(v)}>
                      <SelectTrigger className="bg-white border-indigo-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Keep Open</SelectItem>
                        <SelectItem value="in_review">Mark In-Review</SelectItem>
                        <SelectItem value="resolved">Mark Resolved</SelectItem>
                        <SelectItem value="rejected">Reject Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-indigo-700 uppercase">Resolution Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter the outcome of the investigation..."
                      className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-700 h-24 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-3 border-t bg-white shrink-0 gap-2">
          <Button variant="outline" onClick={onClose} className="text-slate-500">
            Close
          </Button>
          {report.status !== 'resolved' && (
            <Button 
              onClick={handleStatusChange} 
              disabled={isUpdating}
              className={cn(
                "px-8 font-bold transition-all",
                report.severity === 'critical' ? "bg-red-600 hover:bg-red-700" : ""
              )}
            >
              {isUpdating ? "Processing..." : "Submit Decision"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}