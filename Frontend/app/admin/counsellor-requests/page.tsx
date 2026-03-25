'use client'

import { useCallback, useEffect, useState } from 'react'
import { Search, ChevronDown, MoreHorizontal, Check, X, Eye, ChevronLeft, ChevronRight, RotateCcw, Briefcase, Mail } from 'lucide-react'
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
import axios from 'axios'
import ReactPaginate from 'react-paginate'
import { StatusBadge } from '@/components/admin/status-badge'
import { toast } from 'sonner'
import { AdminCounsellors, PaginationData } from '@/types/types'
import { ConfirmActionDialog } from '@/components/counsellor/appointments/confirm-action-dialog'
import { ToastFunction } from '@/helper/toast-function'
import { ApproveActionDialog } from '@/components/counsellor/appointments/approve-action-dialog'
import CounsellorDetailDialog from '@/components/admin/counsellor/view-details-dialog'

export default function CounsellorRequestsPage() {
    const [search, setSearch] = useState('')
    const [specialization, setSpecialization] = useState('')
    const [requests, setRequests] = useState<AdminCounsellors[]>([])
    const [pagination, setPagination] = useState<PaginationData | null>(null)
    const [loading, setLoading] = useState<boolean>(true);
    const [rejectId, setRejectId] = useState<string|null>(null);
    const [togglingStatus, setTogglingStatus] = useState<boolean>(false);
    const [approveId, setApproveId] = useState<string|null>(null);
    const [viewCounsellor, setViewCounsellor] = useState<AdminCounsellors|null>(null);

    const fetchRequests = useCallback(async (page = 1) => {
        try {
            setLoading(true)
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_HOST}/counsellors/admin/filter-counsellors`, 
                {
                    params: {
                        page,
                        limit: 5,
                        search,
                        specialization,
                        status: 'pending' 
                    },
                    withCredentials: true
                }
            )

            if (res.data.success) {
                setRequests(res.data.data.counsellors)
                setPagination(res.data.data.pagination)
            }
        } catch (error) {
            console.error("Error fetching requests:", error)
            ToastFunction('error',error);
        } finally {
            setLoading(false)
        }
    }, [search, specialization])

    useEffect(() => { fetchRequests(1) }, [])

    const handleSearchClick = () => {
        const trimmedSearch = search?.trim();
        const trimmedSpecialization = specialization?.trim();

        console.log(trimmedSearch, trimmedSpecialization);

        if (!trimmedSearch && !trimmedSpecialization) {
            ToastFunction("error", "Please enter name/email or specialization");
            return;
        }

        fetchRequests();
    };

    const handleReset = () => {
        setSearch('')
        setSpecialization('')
        fetchRequests()
    }

    const handleAction = async (id: string|null, action: 'approved' | 'rejected') => {
        try {
            setTogglingStatus(true);
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_HOST}/counsellors/${id}/admin/update/status`,
                { status: action },
                { withCredentials: true }
            )
            if (res.data.success) {
                setApproveId(null);
                setRejectId(null);
                fetchRequests(pagination?.page || 1)
                ToastFunction('success', res.data.message);
            }
        } catch (error) {
            ToastFunction('error', error);
        }finally{
            setTogglingStatus(false);
        }
    }

    return (
        <div className="flex flex-col gap-4 min-h-screen bg-slate-50/50">
            
            {/* 1. Header & Pagination */}
            <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div>
                  
                    <p className="text-sm text-slate-500">Review pending professional applications</p>
                </div>

                {pagination && pagination.totalPages > 1 && (
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel={<ChevronRight className="h-4 w-4" />}
                        onPageChange={(e) => fetchRequests(e.selected + 1)}
                        pageCount={pagination.totalPages}
                        previousLabel={<ChevronLeft className="h-4 w-4" />}
                        containerClassName="flex items-center gap-1"
                        pageLinkClassName="flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium hover:bg-accent"
                        activeLinkClassName="!bg-primary !text-primary-foreground border-primary"
                        previousLinkClassName="flex h-9 w-9 items-center justify-center rounded-md border"
                        nextLinkClassName="flex h-9 w-9 items-center justify-center rounded-md border"
                    />
                )}
            </nav>

            {/* 2. Filters */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white p-3 rounded-md border border-slate-200 shadow-sm">

            {/* Search */}
            <div className="md:col-span-4 relative items-center">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-slate-50 h-10"
                />
            </div>

            {/* Specialization */}
            <div className="md:col-span-4 relative items-center">
                <Briefcase className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                placeholder="Specialization (Title)..."
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="pl-9 bg-slate-50 h-10"
                />
            </div>

            {/* Buttons */}
            <div className="md:col-span-4 flex flex-wrap md:flex-nowrap justify-start md:justify-end gap-2">
                <Button variant="outline" className="h-9 px-4 w-full md:w-auto" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" /> Reset
                </Button>

                <Button
                onClick={handleSearchClick}
                className="h-9 bg-primary hover:bg-primary/90 w-full md:w-auto"
                >
                <Search className="h-3 w-3 mr-2" /> Search
                </Button>
            </div>

            </div>

            {/* 3. Requests Table */}
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <div className="col-span-5 text-xs font-bold uppercase text-slate-500">Applicant Identity</div>
                    <div className="col-span-3 text-xs font-bold uppercase text-slate-500">Specialization</div>
                    <div className="col-span-2 text-xs font-bold uppercase text-slate-500 text-center">Status</div>
                    <div className="col-span-2 text-xs font-bold uppercase text-slate-500 text-right">Actions</div>
                </div>

                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <div className="h-8 w-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                            <p className="text-sm font-medium text-slate-500">Processing applications...</p>
                        </div>
                    ) : requests.length > 0 ? requests.map((req) => (
                        <div key={req._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-2 items-center hover:bg-slate-50/50 transition-colors">
                            
                            {/* Identity */}
                            <div className="col-span-5 flex items-center gap-4">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarImage src={req.profileImage} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                                        {req.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold text-slate-900 truncate">{req.name}</span>
                                    <div className="flex items-center text-xs text-slate-500">
                                        <Mail className="h-3 w-3 mr-1" /> {req.email}
                                    </div>
                                </div>
                            </div>

                            {/* Specialization */}
                            <div className="col-span-3 ">
                                <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                                    {req.title}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="col-span-2 flex justify-center">
                                <StatusBadge status={req.status} type="counsellor-request-status" />
                            </div>

                            {/* Actions */}
                            <div className="col-span-2 text-right flex justify-end gap-2">
                                {/* <Button size="sm" variant="outline" className="h-8 w-8 p-0" title="View Details">
                                    <Eye className="h-4 w-4 text-slate-600" />
                                </Button>
                                <Button 
                                    size="sm" 
                                    className="h-8 bg-emerald-600 hover:bg-emerald-700" 
                                    // onClick={() => handleAction(req._id, 'approved')}
                                >
                                    <Check className="h-4 w-4" />
                                </Button> */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48 p-2">
                                        <DropdownMenuLabel className="text-xs">Application Actions</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={()=>setViewCounsellor(req)} className="cursor-pointer">
                                            <Eye className="mr-2 h-4 w-4" /> View Full Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>setApproveId(req._id)} className="cursor-pointer">
                                            <Check className="mr-2 h-4 w-4" /> Accept Application
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
                                            onClick={()=>setRejectId(req._id)}
                                        >
                                            <X className="mr-2 h-4 w-4" /> Reject Application
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="bg-slate-100 p-4 rounded-full mb-4">
                                <Briefcase className="h-8 w-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-semibold">No pending requests</h3>
                            <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                All counsellor applications have been processed.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {viewCounsellor && (
                <CounsellorDetailDialog
                open={!!viewCounsellor}
                onClose={()=>setViewCounsellor(null)}
                counsellor={viewCounsellor}
            />
            )}

            <ApproveActionDialog
                isOpen={!!approveId}
                onClose={() => setApproveId(null)}
                onConfirm={()=>handleAction(approveId,'approved')}
                loading={loading}
                title="Approve Counsellor"
                description="This counsellor will be approved and can start accepting appointments."
                confirmText="Approve"
            />
            <ConfirmActionDialog
                isOpen={!!rejectId}
                onClose={() => setRejectId(null)}
                onConfirm={()=>handleAction(rejectId,'rejected')}
                loading={togglingStatus}
                title="Reject Counsellor Application"
                description="This application will be rejected and the user will not be able to act as a counsellor."
                confirmText="Reject Application"
                />
        </div>
    )
}