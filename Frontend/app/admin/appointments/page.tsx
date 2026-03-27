'use client'

import { Fragment, useCallback, useEffect, useState } from 'react'
import { Search, ChevronDown, MoreHorizontal, Eye, Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight, RotateCcw, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'
import ReactPaginate from 'react-paginate'
import { AdminAppointments, PaginationData } from '@/types/types'
import { StatusBadge } from '@/components/admin/status-badge'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ToastFunction } from '@/helper/toast-function'
import {  getDurationInMinutes } from '@/helper/calculate.duration'
const AppointmentDetailDialog = dynamic(()=>import('@/components/admin/Appointments/view-appointment-details'));

import { Video, Phone, Users, Globe } from 'lucide-react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'


export const METHOD_THEMES: Record<string, { label: string; icon: any; className: string }> = {
  'google-meet': { 
    label: "Google Meet", 
    icon: Video, 
    className: "text-emerald-700 bg-emerald-50 border-emerald-200" 
  },
  'phone': { 
    label: "Phone Call", 
    icon: Phone, 
    className: "text-blue-700 bg-blue-50 border-blue-200" 
  },
  'in-person': { 
    label: "In-Person", 
    icon: Users, 
    className: "text-slate-700 bg-slate-50 border-slate-200" 
  },
}

export default function AppointmentsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [filterDate, setFilterDate] = useState('')
    const [loading, setLoading] = useState(true)
    const [appointments, setAppointments] = useState<AdminAppointments[]>([])
    const [pagination, setPagination] = useState<PaginationData | null>(null)
    const [selectedAppointment, setSelectedAppointment] = useState<AdminAppointments|null>(null);

    const fetchAppointments = useCallback(async (page = 1) => {
        try {
            setLoading(true)
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_HOST}/appointment/admin/filter-appointments`,
                {
                    params: {
                        page,
                        limit: 6,
                        search: searchTerm,
                        status: filterStatus,
                        date: filterDate
                    },
                    withCredentials: true
                }
            )

            if (res.data.success) {
                setAppointments(res.data.data.appointments)
                setPagination(res.data.data.pagination)
            }
        } catch (error) {
            console.error("Error fetching appointments:", error)
            ToastFunction('error',error);
        } finally {
            setLoading(false)
        }
    }, [searchTerm, filterStatus, filterDate])

    useEffect(() => { fetchAppointments(1) }, []);

    const handleReset = () => {
        setSearchTerm('')
        setFilterStatus('all')
        setFilterDate('');
        fetchAppointments(1);
    }

    return (
        <div className="flex flex-col gap-3 min-h-screen bg-slate-50/50 ">
            
            {/* Header & Pagination */}
            <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2 rounded-md border border-slate-200 shadow-sm">
                <div>
                   
                    <p className="text-sm text-slate-500">Monitor and manage all student-counsellor interactions</p>
                </div>

                {pagination && pagination.totalPages > 1 && (
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel={<ChevronRight className="h-4 w-4" />}
                        onPageChange={(e) => fetchAppointments(e.selected + 1)}
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

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-white p-3 rounded-md border border-slate-200 shadow-sm">

            {/* Search */}
            <div className="md:col-span-4 relative min-w-0">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                placeholder="Search student or counsellor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 h-10 w-full"
                />
            </div>

            {/* Date */}
            <div className="md:col-span-2 relative min-w-0">
                <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
                <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="pl-9 bg-slate-50 border-slate-200 h-10 w-full min-w-0"
                />
            </div>

            {/* Status */}
            <div className="md:col-span-3 min-w-0">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="bg-slate-50 h-10 border-slate-200 w-full">
                    <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Appointments</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
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
                onClick={() => fetchAppointments(1)}
                className="h-9 bg-primary hover:bg-primary/90 w-full md:w-auto"
                >
                <Search className="h-3 w-3 mr-2" /> Search
                </Button>

            </div>

            </div>

            {/* Grid Table */}
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                {/* Desktop Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <div className="col-span-3 text-xs font-bold uppercase text-slate-500 ">Student</div>
                    <div className="col-span-3 text-xs font-bold uppercase text-slate-500">Counsellor</div>
                    <div className="col-span-2 text-xs font-bold uppercase text-slate-500">Date & Time</div>
                    <div className="col-span-1 text-xs font-bold uppercase text-slate-500 text-center">Duration</div>
                    <div className="col-span-1 text-xs font-bold uppercase text-slate-500 text-center">Status</div>
                    <div className="col-span-1 text-xs font-bold uppercase text-slate-500 text-center">Meeting Method</div>
                    <div className="col-span-1 text-xs font-bold uppercase text-slate-500 text-right">Action</div>
                </div>

                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <div className="h-8 w-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                            <p className="text-sm text-slate-500 font-medium">Fetching sessions...</p>
                        </div>
                    ) : appointments.length > 0 ? appointments.map((apt) => (
                        <div key={apt._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-slate-50/50 transition-colors">
                            
                            {/* Student Identity */}
                            <div className="col-span-3 flex items-center gap-3">
                                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                    <AvatarImage src={apt.studentDetails?.profileImage} />
                                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold uppercase">
                                        {apt.studentDetails?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold text-slate-900 truncate">{apt.studentDetails?.name}</span>
                                    <span className="text-[11px] text-slate-500 truncate">{apt.studentDetails?.email}</span>
                                </div>
                            </div>

                            {/* Counsellor Identity */}
                            <div className="col-span-3 flex items-center gap-3">
                                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                                    <AvatarImage src={apt.counsellorDetails?.profileImage} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold uppercase">
                                        {apt.counsellorDetails?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold text-slate-900 truncate">{apt.counsellorDetails?.name}</span>
                                    <span className="text-[11px] text-slate-500 truncate">{apt.counsellorDetails?.email}</span>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="col-span-2">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-700">
                                        {apt.date ? format(new Date(apt.date), 'dd MMM, yyyy') : 'N/A'}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-medium italic">
                                        {apt.startTime  || 'TBD'} - {apt.endTime || 'TBD'}
                                    </span>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="col-span-1 text-center">
                                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                    <Clock className="h-3 w-3" />
                                    {getDurationInMinutes(apt.startTime, apt.endTime) || '45'}m
                                </div>
                            </div>

                            {/* Status */}
                            <div className="col-span-1 flex justify-center">
                                <StatusBadge status={apt.status} type="appointment-status" />
                            </div>

                            <div className="col-span-1 flex items-center">
                                {(() => {
                                    const config = METHOD_THEMES[apt.meetingMethod] || METHOD_THEMES.default;
                                    const Icon = config?.icon;
                                    
                                    return (
                                    <div className={cn(
                                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold uppercase tracking-tight",
                                        config.className
                                    )}>
                                        <Icon className="h-3.5 w-3.5" />
                                        {config.label}
                                    </div>
                                    );
                                })()}
                            </div>

                            {/* Actions */}
                            <div className="col-span-1 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white border border-transparent hover:border-slate-200">
                                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 p-2">
                                        <DropdownMenuLabel className="text-xs text-slate-400">Manage Appointment</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={()=>setSelectedAppointment(apt)} className="cursor-pointer">
                                            <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Details
                                        </DropdownMenuItem>
                                        {apt.status === 'pending' && (
                                            <Fragment>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                                                    <XCircle className="mr-2 h-4 w-4" /> Cancel Session
                                                </DropdownMenuItem>
                                            </Fragment>
                                            )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )) : (
                        <div className="py-24 text-center">
                            <div className="bg-slate-50 inline-flex p-4 rounded-full mb-4">
                                <CalendarIcon className="h-8 w-8 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-medium">No appointments found for this period.</p>
                        </div>
                    )}
                </div>
            </div>
            {selectedAppointment && (
                <AppointmentDetailDialog
                open={!!selectedAppointment}
                onClose={()=>setSelectedAppointment(null)}
                appointment={selectedAppointment}
                />
            )}
        </div>
    )
}