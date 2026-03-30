'use client'

import { useCallback, useEffect, useState } from 'react'
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  AlertTriangle, 
  Calendar as CalendarIcon,
  MoreHorizontal,
  Eye,
  Flag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { StatusBadge } from '@/components/admin/status-badge'
import ReactPaginate from 'react-paginate'
import axios from 'axios'
import { format } from 'date-fns'
// import ReportDetailsModal from '@/components/admin/report-details-modal'
import { ToastFunction } from '@/helper/toast-function'
import { PaginationData, UserReports } from '@/types/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import dynamic from 'next/dynamic'


const ReportDetailsModal = dynamic(()=>import('@/components/admin/report-details-modal'));

export const REASON_LABELS: Record<string, string> = {
  no_show: "Counsellor didn't show up",
  late_join: "Joined late",
  unprofessional_behavior: "Unprofessional behavior",
  technical_issue: "Technical issue",
  breach_of_confidentiality: "Breach of Confidentiality",
  missed_appointment: "Missed Appointment",
  unprofessional_communication: "Unprofessional Communication",
  other: "Other"
};

export default function ReportsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [severityFilter, setSeverityFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [dateFilter, setDateFilter] = useState('')
    const [loading, setLoading] = useState(true)
    const [reports, setReports] = useState<UserReports[]>([])
    const [pagination, setPagination] = useState<PaginationData|null>(null)
    const [selectedReport, setSelectedReport] = useState<UserReports|null>(null)

    const fetchReports = useCallback(async (page = 1) => {
        
        try {
            setLoading(true)
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/users/admin/filter-reports`, {
                params: {
                    page,
                    limit: 10,
                    search: searchTerm,
                    severity: severityFilter,
                    status: statusFilter,
                    date: dateFilter ? format(dateFilter, "yyyy-MM-dd") : ""
                },
                withCredentials: true
            })
            if (res.data.success) {
                setReports(res.data.data.reports)
                setPagination(res.data.data.pagination)
            }
        } catch (error) {
            ToastFunction('error', error);
        } finally {
            setLoading(false)
        }
    }, [searchTerm, severityFilter, statusFilter, dateFilter])

    useEffect(() => { fetchReports(1) }, []);

    const handleReset = () => {
        setSearchTerm('')
        setSeverityFilter('all')
        setStatusFilter('all')
        setDateFilter('');
        fetchReports();
    }

    const criticalCount = reports.filter(r => r.severity === 'critical' && r.status !== 'resolved').length

    return (
        <div className="flex flex-col gap-4 min-h-screen bg-slate-50/50 p-4">
            
            {/* Header & Pagination */}
            <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div>
                    <p className="text-sm text-slate-500">Review and resolve community violations</p>
                </div>

                {pagination && pagination.totalPages > 1 && (
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel={<ChevronRight className="h-4 w-4" />}
                        onPageChange={(e) => fetchReports(e.selected + 1)}
                        pageRangeDisplayed={3}
                        pageCount={pagination.totalPages}
                        previousLabel={<ChevronLeft className="h-4 w-4" />}
                        containerClassName="flex items-center gap-1 select-none"
                        pageClassName="block"
                        pageLinkClassName="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                        activeLinkClassName="!bg-primary !text-primary-foreground border-primary"
                        previousLinkClassName="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent"
                        nextLinkClassName="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent"
                        disabledLinkClassName="opacity-50 cursor-not-allowed hover:bg-background"
                        breakLinkClassName="flex h-9 w-9 items-center justify-center"
                        renderOnZeroPageCount={null}
                    />
                )}
            </nav>

            {/* Critical Alert Banner */}
            {criticalCount > 0 && (
                <div className="flex items-center gap-3 rounded-md border border-red-200 bg-red-50 p-4 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
                    <div>
                        <p className="text-sm font-bold text-red-900">
                            {criticalCount} Critical Action Item{criticalCount !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-red-700">Immediate review required for high-risk safety violations.</p>
                    </div>
                </div>
            )}

            {/* Unified Filter Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white p-3 rounded-md border border-slate-200 shadow-sm">
                <div className="md:col-span-3 relative min-w-0">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search users or reason..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-slate-50 border-slate-200 h-10 w-full"
                    />
                </div>

                <div className="md:col-span-2 relative min-w-0">
                    <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10" />
                    <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="pl-9 bg-slate-50 border-slate-200 h-10 w-full"
                    />
                </div>

                <div className="md:col-span-2 min-w-0">
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                        <SelectTrigger className="bg-slate-50 h-10 border-slate-200 w-full">
                            <SelectValue placeholder="Severity" />
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

                <div className="md:col-span-2 min-w-0">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-slate-50 h-10 border-slate-200 w-full">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_review">In Review</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Buttons */}
                <div className="md:col-span-3 flex flex-wrap md:flex-nowrap justify-start md:justify-end gap-2 min-w-0">
    
                    <Button
                    variant="outline"
                    className="h-9 px-4 w-full md:w-auto"
                    onClick={handleReset}
                    >
                    <RotateCcw className="h-4 w-4 mr-2" /> Reset
                    </Button>
    
                    <Button
                    onClick={() => fetchReports(1)}
                    className="h-9 bg-primary hover:bg-primary/90 w-full md:w-auto"
                    >
                    <Search className="h-3 w-3 mr-2" /> Search
                    </Button>
    
                </div>
            </div>

            {/* Data Grid */}
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <div className="col-span-3 text-[10px] font-bold uppercase text-slate-500 tracking-widest">Reported By</div>
                    <div className="col-span-3 text-[10px] font-bold uppercase text-slate-500 tracking-widest">Against</div>
                    <div className="col-span-3 text-[10px] font-bold uppercase text-slate-500 tracking-widest">Reason</div>
                    <div className="col-span-1 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-center">Severity</div>
                    <div className="col-span-1 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-center">Status</div>
                    <div className="col-span-1 text-[10px] font-bold uppercase text-slate-500 tracking-widest text-right">Action</div>
                </div>

                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <div className="h-8 w-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                            <p className="text-sm text-slate-500 font-medium">Loading reports...</p>
                        </div>
                    ) : reports.length > 0 ? reports.map((report) => (
                        <div key={report._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-2 items-center hover:bg-slate-50/50 transition-colors">
                            
                           {/* Student Identity */}
                            <div className="col-span-3 flex items-center gap-3">
                                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                    <AvatarImage src={report.studentDetails?.profileImage} />
                                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold uppercase">
                                        {report.studentDetails?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold text-slate-900 truncate">{report.studentDetails?.name}</span>
                                    <span className="text-[11px] text-slate-500 truncate">{report.studentDetails?.email}</span>
                                </div>
                            </div>

                            {/* Counsellor Identity */}
                            <div className="col-span-3 flex items-center gap-3">
                                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                    <AvatarImage src={report.counsellorDetails?.profileImage} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold uppercase">
                                        {report.counsellorDetails?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold text-slate-900 truncate">{report.counsellorDetails?.name}</span>
                                    <span className="text-[11px] text-slate-500 truncate">{report.counsellorDetails?.email}</span>
                                </div>
                            </div>

                            <div className="col-span-3 flex flex-col">
                                <span className="text-sm font-medium text-slate-700 truncate max-w-[250px]">
                                    {/* Map the key to the label, fallback to the original string if not found */}
                                    {REASON_LABELS[report.reason] || report.reason || "No reason specified"}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-slate-400 font-medium">
                                        {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                                    </span>
                                    <span className="text-[10px] text-slate-300">•</span>
                                    <span className="text-[10px] text-slate-400">
                                        {format(new Date(report.createdAt), 'hh:mm a')}
                                    </span>
                                </div>
                            </div>

                            <div className="col-span-1 flex justify-center">
                                <StatusBadge status={report.severity} type="report-severity" />
                            </div>

                            <div className="col-span-1 flex justify-center">
                                <StatusBadge status={report.status} type="report-status" />
                            </div>

                            <div className="col-span-1 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 p-2">
                                        <DropdownMenuLabel className="text-xs text-slate-400">Action</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => setSelectedReport(report)} className="cursor-pointer">
                                            <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )) : (
                        <div className="py-24 text-center">
                            <Flag className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">Clean slate! No pending reports found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal - only show if there's a selected report */}
            {selectedReport && (
                <ReportDetailsModal
                    report={selectedReport}
                    isOpen={!!selectedReport}
                    onClose={() => setSelectedReport(null)}
                    fetchReports={fetchReports}
                />
            )}
        </div>
    )
}