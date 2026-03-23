

'use client'

import { 
  Calendar, Clock, Video, Phone, MapPin, 
  FileText, Link as LinkIcon, Search, RotateCcw,
  ChevronLeft, ChevronRight, MoreHorizontal
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {  IAppointment, AppointmentsResponse, PaginationData, ApiErrorResponse } from '@/types/types'
import { useEffect, useState, useCallback } from 'react'
import ReactPaginate from 'react-paginate'
import axios from 'axios'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { AppointmentSkeleton } from './appointment-skeleton'
import AcceptAppointmentDialog from './accept-appointment-dialog'
import { useCancelAppointment } from '@/hooks/use-cancel-appointment'
import { ConfirmActionDialog } from './confirm-action-dialog'

interface AppointmentsListProps {
  status: 'scheduled' | 'pending' | 'completed' | 'cancelled' 
}

const modeIcons = {
  'google-meet': Video,
  'phone': Phone,
  'in-person': MapPin,
}

const statusStyles = {
  scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
}

export function AppointmentsList({ status }: AppointmentsListProps) {
	console.log("Status:",status);
  const [appointmentsData, setAppointmentsData] = useState<IAppointment[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [openAcceptAppointmentDialog, setOpenAcceptAppointmentDialog] = useState<boolean>(false);
  const {handleCancelAppointment, isCancelling} = useCancelAppointment();
  const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [aptToDecline, setAptToDecline] = useState<string | null>(null);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleFetchData = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        status,
        page: page.toString(),
        limit: '4',
        name: searchTerm, // Assuming backend supports these
        date: selectedDate
      });

      const response = await axios.get<AppointmentsResponse>(
        `${process.env.NEXT_PUBLIC_API_HOST}/appointment/status-filter?${queryParams}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setAppointmentsData(response.data.data.appointments);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  }, [status, searchTerm, selectedDate]);

  useEffect(() => {
    handleFetchData(1);
  }, []);

  const handleSearchClick = ()=>{
	handleFetchData(1);
  }

  const handlePageClick = (event: { selected: number }) => {
    handleFetchData(event.selected + 1);
  };

  const handleResetClick = ()=>{
	if(!searchTerm && !selectedDate){
		return;
	}
	setSearchTerm(''); 
	setSelectedDate('');
	handleFetchData();
  }

  // 1. Function to trigger the dialog
const triggerDecline = (id: string) => {
  setAptToDecline(id);
  setDeclineDialogOpen(true);
};

// 2. The actual confirm handler
const confirmDecline = async () => {
  if (aptToDecline) {
    await handleCancelAppointment({
      appointmentId: aptToDecline,
      handleFetchData: () => handleFetchData()
    });
    setDeclineDialogOpen(false);
    setAptToDecline(null);
  }
};

//   // Cancel Appointment
//   const handleCancelAppointment = async(appointmentId:any)=>{
// 	try {
// 		const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/appointment/${appointmentId}/reject`,{
// 			withCredentials: true
// 		});

// 		if(response.data.success){
// 			handleFetchData();
// 			toast.success(response.data.message);
// 		}
// 	} catch (error:any) {
// 		if (axios.isAxiosError<ApiErrorResponse>(error)) {
//             const apiError = error.response?.data
//             toast.error(apiError?.error[0].message)
//         }
// 	}
//   }


	// Mark as complete by counsellor
	const handleCompleteAppointment = async(appointmentId:string)=>{
		try {
			const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_HOST}/appointment/${appointmentId}/confirm`,{},{
				withCredentials: true
			});
			if(response.data.success){
				handleFetchData();
				toast.success(response.data.message);
			}
		} catch (error) {
			if (axios.isAxiosError<ApiErrorResponse>(error)) {
				const apiError = error.response?.data
				toast.error(apiError?.error[0].message)
			}
		}
	}

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">

		{/* Stats Summary */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-semibold capitalize">{status} Appointments</h2>
        {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center">
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
        </div>
      )}
      </div>
      
      {/* Search & Filter Bar (Inspired by Image) */}
      <Card className="p-4 bg-white border shadow-none">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px] space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Student Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search student..." 
                className="pl-9 bg-background" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-48 space-y-1.5">
            <label className="text-xs font-bold uppercase text-muted-foreground">Select Date</label>
            <Input 
              type="date" 
              className="bg-background" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSearchClick} className="bg-primary hover:bg-primary/90">
              <Search className="h-4 w-4 mr-2" /> Search
            </Button>
            <Button variant="outline" onClick={handleResetClick}>
              <RotateCcw className="h-4 w-4 mr-2" /> Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Appointment Cards Grid */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <AppointmentSkeleton/>
          ))
        ) : appointmentsData.length === 0 ? (
          <div className="lg:col-span-2 py-20 text-center border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">No records found for this criteria.</p>
          </div>
        ) : (
          appointmentsData.map((apt) => {
            const ModeIcon = modeIcons[apt.meetingMethod as keyof typeof modeIcons] || Video;
            return (
              <Card key={apt._id} className="relative py-2 overflow-hidden group hover:border-primary/50 transition-all border-l-4 border-l-primary">
                <div className="p-2">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                        {apt.student?.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{apt.student?.name || 'Unknown Student'}</h3>
                        <Badge variant="outline" className={`${statusStyles[status]} border-none px-2 py-0`}>
                           {status}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>{format(new Date(apt.date), 'PPP')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{apt.startTime} - {apt.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ModeIcon className="h-4 w-4 text-primary" />
                      <span className="capitalize">{apt.meetingMethod}</span>
                    </div>
                  </div>

                  {['completed', 'pending', 'upcoming', 'scheduled'].includes(apt.status) && (
					<div className="flex gap-2 pt-4 border-t">
						{/* Use apt.status here to match the specific record */}
						{apt.status === 'pending' && (
						<>
							<Button onClick={()=>setSelectedAppointment(apt)} size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">Accept</Button>
							<Button 
							onClick={()=>triggerDecline(apt._id)} 
							size="sm" variant={'outline'} className="flex-1 bg-red-400 text-white hover:bg-red-500 transition-colors duration-300 cursor-pointer hover:text-white">Decline</Button>
						</>
						)}
						
						{(apt.status === 'scheduled' ) && (
							<Button onClick={()=>handleCompleteAppointment(apt._id)} size="sm" className="w-full gap-2">
								<LinkIcon className="h-3 w-3" /> Mark As Complete
							</Button>
						)}
						
						{apt.status === 'completed' && (
						<Button size="sm" variant="outline" className="w-full gap-2">
							<FileText className="h-3 w-3" /> View Summary
						</Button>
						)}
					</div>
					)}
                </div>
              </Card>
            )
		})
	)}
      </div>
		{selectedAppointment && (
			<AcceptAppointmentDialog 
				open={openAcceptAppointmentDialog} 
				onOpenChange={setOpenAcceptAppointmentDialog} 
				meetingMethod={selectedAppointment?.meetingMethod}
				appointmentId={selectedAppointment._id}
				handleFetchAppointments={handleFetchData}
				/>
		)}

		<ConfirmActionDialog
			isOpen={declineDialogOpen}
			loading={isCancelling}
			onClose={() => setDeclineDialogOpen(false)}
			onConfirm={confirmDecline}
			title="Decline Appointment?"
			description="Are you sure you want to decline this request? The student will be notified."
			confirmText="Decline Request"
			/>
    </div>
  )
}
