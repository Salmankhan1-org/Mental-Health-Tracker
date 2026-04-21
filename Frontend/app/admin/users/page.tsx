'use client'

import { useCallback, useEffect, useState } from 'react'
import { Search, ChevronDown, MoreHorizontal, Trash2, UserCog, ShieldCheck, Calendar, CheckCircle, ChevronLeft, ChevronRight, Filter, RotateCcw, Mail } from 'lucide-react'
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
import { AdminUsers, ApiErrorResponse, PaginationData } from '@/types/types'
import { ConfirmActionDialog } from '@/components/counsellor/appointments/confirm-action-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RoleBadge } from '@/components/admin/role-badge'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/admin/status-badge'
import { ToastFunction } from '@/helper/toast-function'
import dynamic from 'next/dynamic'

const RoleChangeDialog = dynamic(()=>import('@/components/admin/user/update-permission'));
const StatusChangeDialog = dynamic(()=>import('@/components/admin/user/toggle-user-status')) 
const SendMessageDialog = dynamic(()=>import('@/components/admin/send-message-dialog')) 

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRole, setFilterRole] = useState('all')
    const [filterStatus, setFilterStatus] = useState('active');
    const [users, setUsers] = useState<AdminUsers[]>([])
    const [pagination, setPagination] = useState<PaginationData | null>(null)
    const [loading, setLoading] = useState(true)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedUserForRole, setselectedUserForRole] = useState<AdminUsers | null>(null)
    const [selectedUserForStatus, setSelectedUserForStatus] = useState<AdminUsers | null>(null)
    const [selectedUserForMessage, setSelectedUserForMessage] = useState<AdminUsers|null>(null);

    const fetchUsers = useCallback(async (page = 1) => {
        try {
            setLoading(true)
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_HOST}/users/admin/filter-users`,
                { 
                    params: {
                        page,
                        limit: 6,
                        search: searchTerm,
                        role: filterRole,
                        status: filterStatus // New field added
                    },
                    withCredentials: true 
                }
            )
            
            if (res.data.success) {
                setUsers(res.data.data.users)
                setPagination(res.data.data.pagination)
            }
        } catch (error) {
            console.error("Error fetching users:", error)
        } finally {
            setLoading(false)
        }
        // Added filterStatus to the dependency array
    }, [searchTerm, filterRole, filterStatus])

    useEffect(() => { fetchUsers(1) }, [])

    const handlePageClick = (event: { selected: number }) => {
        fetchUsers(event.selected + 1);
    };

    const handleSearchClick = ()=>{
        fetchUsers(1);
    }

    const handleResetClick = ()=>{
        if(!searchTerm && !filterRole && !filterStatus){
            return;
        }
        setSearchTerm(''); 
        setFilterRole('all');
        setFilterStatus('active');
        fetchUsers();
    }

    const handleDeleteUser = async () => {
        if (!deleteId) return
        try {
            setIsDeleting(true);
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_HOST}/users/admin/${deleteId}`, { withCredentials: true })
            
            if(res.data.success){
                fetchUsers(pagination?.page || 1)
                setDeleteId(null)
                ToastFunction('success',res.data.message);
            }
        } catch (error:any) {
            ToastFunction('error',error);
        }finally{
            setIsDeleting(false);
        }
    }

    return (
        <div className="flex flex-col gap-4 min-h-screen bg-slate-50/50">
            
            {/* 1. Header & Pagination Nav */}
            <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-md border border-slate-200 shadow-sm">
                <div>
                    <p className="text-sm text-slate-500">Overview of all registered platform members</p>
                </div>

                {pagination && pagination.totalPages > 1 && (
                    <ReactPaginate
                        breakLabel="..."
                        nextLabel={<ChevronRight className="h-4 w-4" />}
                        onPageChange={handlePageClick}
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

            {/* 2. Filters & Search Bar */}
            <div className="grid items-center grid-cols-1 md:grid-cols-12 gap-3 bg-white p-3 rounded-md border border-slate-200 shadow-sm">
            {/* Search Box */}
            <div className="md:col-span-4 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                    placeholder="Search name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-all h-10"
                />
            </div>

            {/* Role Filter - Shadcn Select */}
            <div className="md:col-span-2">
                <Select value={filterRole} onValueChange={(value) => setFilterRole(value)}>
                    <SelectTrigger className="w-full h-10 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500">
                        <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="counsellor">Counsellor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Status Filter - Shadcn Select */}
            <div className="md:col-span-2">
                <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value)}>
                    <SelectTrigger className="w-full h-10 bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-4 flex justify-end gap-2">
                <Button 
                    variant="outline" 
                    className="h-9 px-4 border-slate-200 hover:bg-slate-50 text-slate-600 font-medium" 
                    onClick={handleResetClick}
                >
                    <RotateCcw className="h-3 w-3 mr-2" /> Reset
                </Button>
                <Button  
                // disabled={!searchTerm || !filterStatus || !filterRole}
                onClick={handleSearchClick} 
                className="h-9 bg-primary hover:bg-primary/90">
                    <Search className="h-3 w-3 mr-2" /> Search
                </Button>
            </div>
        </div>

            {/* 3. Modern Grid Table */}
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                    <div className="col-span-4 text-xs font-bold uppercase text-slate-500">User Identity</div>
                    <div className="col-span-2 text-xs font-bold uppercase text-slate-500">Role</div>
                    <div className="col-span-2 text-xs font-bold uppercase text-slate-500">Sessions</div>
                    <div className="col-span-2 text-xs font-bold uppercase text-slate-500">Joined </div>
                    <div className="col-span-1 text-xs font-bold uppercase text-slate-500 text-center">Status</div>
                    <div className="col-span-1 text-xs font-bold uppercase text-slate-500 text-right">Actions</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-slate-100">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center gap-4">
                            <div className="h-8 w-8 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                            <p className="text-sm font-medium text-slate-500 tracking-wide">Refining your view...</p>
                        </div>
                    ) : users.length > 0 ? users.map((user) => (
                        <div key={user._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-1.5 items-center hover:bg-blue-50/30 transition-colors group">
                            
                            {/* User Identity */}
                            <div className="col-span-4 flex items-center gap-4">
                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarImage src={user.profileImage} />
                                    <AvatarFallback className="bg-slate-100 text-slate-600 font-bold">{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold text-slate-900 truncate">{user.name}</span>
                                    <span className="text-xs text-slate-500 truncate">{user.email}</span>
                                </div>
                            </div>

                            {/* Role */}
                            <div className="col-span-2">
                                <RoleBadge role={user?.role} />
                            </div>

                            {/* Sessions */}
                            <div className="col-span-2 flex items-center gap-2 text-sm font-bold text-emerald-600">
                                <CheckCircle className="h-4 w-4" />
                                {user.sessionsAttained || 0}
                            </div>

                            {/* Joined Date */}
                            <div className="col-span-2 text-xs text-slate-500 flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>

                            {/* Status */}
                            <div className="col-span-1 flex justify-center">
                                <StatusBadge status={user.status} type='user-status' />
                            </div>

                            {/* Actions */}
                            <div className="col-span-1 text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white hover:shadow-sm">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 p-2">
                                        <DropdownMenuLabel className="text-xs text-slate-400">Manage Account</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={()=>setselectedUserForRole(user)} className="rounded-md cursor-pointer">
                                            <ShieldCheck className="mr-2 h-4 w-4 text-blue-500" />
                                            Update Permission
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>setSelectedUserForStatus(user)} className="rounded-md cursor-pointer">
                                            <UserCog className="mr-2 h-4 w-4 text-slate-500" />
                                            Toggle Status
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={()=>setSelectedUserForMessage(user)} className="cursor-pointer">
                                            <Mail className="mr-2 h-4 w-4 text-slate-500" /> Send Message
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem 
                                            className="text-red-600 focus:bg-red-50 focus:text-red-600 rounded-md cursor-pointer"
                                            onClick={() => setDeleteId(user._id)}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete Permanently
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-24 px-4 bg-slate-50/30">
                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4">
                            <Search className="h-8 w-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">No users found</h3>
                        <p className="text-sm text-slate-500 text-center max-w-[280px] mt-1">
                            We couldn't find any matches for your current filters. Try adjusting your search or role selection.
                        </p>
                        <Button 
                            variant="link" 
                            className="mt-4 bg-primary hover:bg-primary/90 text-white hover:no-underline cursor-pointer"
                            onClick={() => {
                                setSearchTerm('');
                                setFilterRole('all');
                                setFilterStatus('active');
                                fetchUsers();
                            }}
                        >
                            Clear all filters
                        </Button>
                    </div>
                    )}
                </div>
            </div>

            {selectedUserForRole && (
                 <RoleChangeDialog
                open={!!selectedUserForRole}
                onClose={()=>setselectedUserForRole(null)}
                user={selectedUserForRole}
                onConfirm={fetchUsers}
                />
            )}

            {selectedUserForStatus && (
                <StatusChangeDialog
                    open={!!selectedUserForStatus}
                    onClose={()=>setSelectedUserForStatus(null)}
                    user={selectedUserForStatus}
                    onConfirm={fetchUsers}
                />
            )}

            {selectedUserForMessage && (
                <SendMessageDialog
                isOpen={!!selectedUserForMessage}
                onClose={()=>setSelectedUserForMessage(null)}
                target={{
                    email: selectedUserForMessage?.email,
                    name: selectedUserForMessage?.name,
                    id: selectedUserForMessage?._id,
                    role: 'student'
                }}
                />
            )}

            <ConfirmActionDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDeleteUser}
                loading={isDeleting}
                title="Confirm Deletion"
                description="This user account will be removed from the system. This action cannot be undone."
                confirmText="Delete User"
            />
        </div>
    )
}