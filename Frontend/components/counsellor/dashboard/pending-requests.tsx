'use client'

import { AlertCircle, Calendar, Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { PendingRequestsSkeleton } from './pending-appointment-skeleton'
import { useCancelAppointment } from '@/hooks/use-cancel-appointment'
import { LoadingButton } from '@/components/common/button'
import AcceptAppointmentDialog from '../appointments/accept-appointment-dialog'
import { IAppointment } from '@/types/types'
import { format } from 'date-fns'
import { ConfirmActionDialog } from '../appointments/confirm-action-dialog'

export function PendingRequests() {
    const [pendingAppointments, setPendingAppointments] = useState<IAppointment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    
    // Track which specific appointment is being accepted
    const [selectedAppointment, setSelectedAppointment] = useState<IAppointment | null>(null);
    const [openAcceptAppointmentDialog, setOpenAcceptAppointmentDialog] = useState<boolean>(false);
	const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  	const [aptToDecline, setAptToDecline] = useState<string | null>(null);

    const { handleCancelAppointment, isCancelling } = useCancelAppointment();

    const fetchRecentPendingAppointments = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/appointment/pending/recent`, {
                withCredentials: true
            });

            if (response.data.success) {
                setPendingAppointments(response.data.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchRecentPendingAppointments();
    }, []);

    // Helper to open dialog for a specific request
    const handleOpenAccept = (req: IAppointment) => {
        setSelectedAppointment(req);
        setOpenAcceptAppointmentDialog(true);
    };

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
			handleFetchData: () => fetchRecentPendingAppointments()
			});
			setDeclineDialogOpen(false);
			setAptToDecline(null);
		}
	};

    if (loading) return <PendingRequestsSkeleton />

    return (
        <Card className="border-none shadow-sm bg-white h-fit">
            <CardHeader className="border-b border-slate-50">
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    New Requests
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                {pendingAppointments.length > 0 ? (
                    pendingAppointments.map((req) => (
                        <div
                            key={req._id}
                            className="group relative p-4 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-md transition-all"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-slate-900">{req.student.name}</h3>
                                </div>
                                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400 uppercase tracking-tighter bg-white px-2 py-1 rounded-md border border-slate-100">
                                    <Calendar className="h-3 w-3 text-primary" />
                                    <span>{format(new Date(req.date), 'MMM dd, yyyy')}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border-none text-[11px] font-semibold px-2">
                                    {req.meetingMethod}
                                </Badge>
                            </div>

                            <div className="flex gap-2">
                                <Button 
                                    onClick={() => handleOpenAccept(req)} 
                                    size="sm" 
                                    className="flex-1 text-white shadow-none h-8 text-xs font-bold"
                                >
                                    <Check className="h-3 w-3 mr-1" /> Accept
                                </Button>

                                <Button 
									onClick={()=>triggerDecline(req._id)} 
									size="sm" variant={'outline'} className="flex-1 bg-red-400 text-white hover:bg-red-500 transition-colors duration-300 cursor-pointer hover:text-white">Decline</Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-slate-400 text-sm italic">
                        No pending requests
                    </div>
                )}

                {/* Dialog rendered ONCE outside the loop */}
                {selectedAppointment && (
                    <AcceptAppointmentDialog 
                        open={openAcceptAppointmentDialog} 
                        onOpenChange={setOpenAcceptAppointmentDialog} 
                        meetingMethod={selectedAppointment.meetingMethod}
                        appointmentId={selectedAppointment._id}
                        handleFetchAppointments={fetchRecentPendingAppointments}
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
            </CardContent>
        </Card>
    );
}