'use client'

import { useCallback, useEffect, useState } from 'react'
import { Search, ChevronDown, MoreHorizontal, Trash2, Mail, Eye, ChevronLeft, ChevronRight, RotateCcw, Star, CheckCircle, Briefcase } from 'lucide-react'
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
import { AdminCounsellors, PaginationData } from '@/types/types'
import { StatusBadge } from '@/components/admin/status-badge'
import { toast } from 'sonner'
import dynamic from 'next/dynamic'
import SendMessageDialog from '@/components/admin/send-message-dialog'
// import CounsellorDetailDialog from '@/components/admin/counsellor/view-details-dialog'

const CounsellorDetailDialog = dynamic(()=>import('@/components/admin/counsellor/view-details-dialog'));


export default function CounsellorsPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [specialization, setSpecialization] = useState('')
    const [minRating, setMinRating] = useState('0')
    const [loading, setLoading] = useState(true)
    const [counsellors, setCounsellors] = useState<AdminCounsellors[]>([])
    const [pagination, setPagination] = useState<PaginationData | null>(null)
    const [selectedCounsellor, setSelectedCounsellor] = useState<any | null>(null);
    const [selectCounsellorForMessage, setSelectCounsellorForMessage] = useState<AdminCounsellors|null>(null);

    const fetchCounsellors = useCallback(async (page = 1) => {
        try {
            setLoading(true)
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_HOST}/counsellors/admin/filter-counsellors`,
                {
                    params: {
                        page,
                        limit: 5,
                        search: searchTerm,
                        specialization: specialization,
                        minRating: minRating,
                        status: 'approved' // Hardcoded for this page
                    },
                    withCredentials: true
                }
            )

            if (res.data.success) {
                setCounsellors(res.data.data.counsellors)
                setPagination(res.data.data.pagination)
            }
        } catch (error) {
            console.error("Error fetching counsellors:", error)
            toast.error("Failed to load counsellors")
        } finally {
            setLoading(false)
        }
    }, [searchTerm, specialization, minRating])

    useEffect(() => { fetchCounsellors(1) }, [])

    const handleReset = () => {
        setSearchTerm('')
        setSpecialization('')
        setMinRating('0')
        fetchCounsellors(1)
    }

    return (
        <div className="flex flex-col gap-4 min-h-screen bg-slate-50/50">
            {/* 1. Header & Pagination Nav */}
            <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div>
                    <p className="text-sm text-slate-500">Manage professional profiles and session performance</p>
                </div>

                {pagination && pagination.totalPages > 1 && (
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel={<ChevronRight className="h-4 w-4" />}
                        onPageChange={(e) => fetchCounsellors(e.selected + 1)}
                        pageCount={pagination.totalPages}
                        previousLabel={<ChevronLeft className="h-4 w-4" />}
                        containerClassName="flex items-center gap-1"
                        pageLinkClassName="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium hover:bg-accent"
                        activeLinkClassName="!bg-primary !text-primary-foreground border-primary"
                        previousLinkClassName="flex h-9 w-9 items-center justify-center rounded-md border border-input"
                        nextLinkClassName="flex h-9 w-9 items-center justify-center rounded-md border border-input"
                    />
                )}
            </nav>

            {/* 2. Advanced Filters */}
            <div className="grid grid-cols-1 items-center md:grid-cols-12 gap-3 bg-white p-3 rounded-md border border-slate-200 shadow-sm">

                {/* Search */}
                <div className="md:col-span-4 relative min-w-0">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                    placeholder="Search name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-slate-50 border-slate-200 h-10 w-full"
                    />
                </div>

                {/* Specialization */}
                <div className="md:col-span-3 relative min-w-0">
                    <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                    placeholder="Specialization..."
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="pl-9 bg-slate-50 border-slate-200 h-10 w-full"
                    />
                </div>

                {/* Rating */}
                <div className="md:col-span-2 min-w-0">
                    <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger className="bg-slate-50 h-10 w-full">
                        <SelectValue placeholder="Min Rating" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">All Ratings</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="4.5">4.5+ Stars</SelectItem>
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
                    <RotateCcw className="h-3 w-3 mr-2" /> Reset
                    </Button>

                    <Button
                    onClick={() => fetchCounsellors(1)}
                    className="h-9 px-4 bg-primary hover:bg-primary/90 w-full md:w-auto"
                    >
                    <Search className="h-3 w-3 mr-2" /> Filter
                    </Button>

                </div>
                </div>

            {/* 3. Grid Table */}
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <div className="col-span-3 text-xs font-bold uppercase text-slate-500 tracking-wider">Counsellor</div>
                    <div className="col-span-2 text-xs font-bold uppercase text-slate-500 tracking-wider">Specialization</div>
                    <div className="col-span-2 text-xs font-bold uppercase text-slate-500 tracking-wider text-center">Rating</div>
                    <div className="col-span-2 text-xs font-bold uppercase text-slate-500 tracking-wider text-center">Sessions</div>
                    <div className="col-span-2 text-xs font-bold uppercase text-slate-500 tracking-wider text-center">Status</div>
                    <div className="col-span-1 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Actions</div>
                </div>

                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <div className="h-8 w-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                            <p className="text-sm font-medium text-slate-500 tracking-wide">Syncing data...</p>
                        </div>
                    ) : counsellors.length > 0 ? counsellors.map((c) => (
                        <div key={c._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-blue-50/20 transition-colors">
                            
                            {/* Identity */}
                            <div className="col-span-3 flex items-center gap-4">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarImage src={c.profileImage} />
                                    <AvatarFallback className="bg-indigo-100 text-indigo-700 font-bold">
                                        {c.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold text-slate-900 truncate">{c.name}</span>
                                    <span className="text-xs text-slate-500 truncate">{c.email}</span>
                                </div>
                            </div>

                            {/* Specialization */}
                            <div className="col-span-2">
                                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                    {c.title}
                                </span>
                            </div>

                            {/* Rating (2) */}
                            <div className="col-span-2 flex justify-center">
                                <div className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-md border border-amber-100">
                                    <Star className="h-3.5 w-3.5 fill-amber-500" />
                                    {c.averageRating?.toFixed(1) || "0.0"}
                                </div>
                            </div>

                            {/* Sessions (2) */}
                            <div className="col-span-2 flex justify-center">
                                <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-100">
                                    <CheckCircle className="h-3.5 w-3.5" />
                                    {c.completedSessions || 0}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="col-span-2 flex justify-center">
                                <StatusBadge status={c.status} type="counsellor-request-status" />
                            </div>

                            {/* Actions */}
                            <div className="col-span-1 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-52 p-2">
                                        <DropdownMenuLabel className="text-xs">Counsellor Options</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => setSelectedCounsellor(c)} className="cursor-pointer">
                                            <Eye className="mr-2 h-4 w-4 text-blue-500" /> View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>setSelectCounsellorForMessage(c)} className="cursor-pointer">
                                            <Mail className="mr-2 h-4 w-4 text-slate-500" /> Send Message
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer">
                                            <Trash2 className="mr-2 h-4 w-4" /> Deactivate Account
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )) : (
                        <div className="py-24 text-center">
                            <p className="text-slate-500">No active counsellors found matching your filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* View Detail Dialog */}
            <CounsellorDetailDialog
                open={!!selectedCounsellor} 
                onClose={() => setSelectedCounsellor(null)} 
                counsellor={selectedCounsellor} 
            />

           {selectCounsellorForMessage && (
             <SendMessageDialog
                isOpen={!!selectCounsellorForMessage}
                onClose={()=>setSelectCounsellorForMessage(null)}
                counsellor={selectCounsellorForMessage}
            />
           )}
        </div>
    )
}