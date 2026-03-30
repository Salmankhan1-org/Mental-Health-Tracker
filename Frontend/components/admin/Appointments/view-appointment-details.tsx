"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Fingerprint, 
  History, 
  Video,
  User,
  ShieldCheck
} from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { format } from "date-fns";
import { AdminAppointments } from "@/types/types";
import { getDurationInMinutes } from "@/helper/calculate.duration";

interface AppointmentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: AdminAppointments;
}

export default function AppointmentDetailDialog({
  open,
  onClose,
  appointment,
}: AppointmentDetailDialogProps) {
  if (!appointment) return null;

 console.log(appointment);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby="View Appointment Details" className="sm:max-w-[550px] h-[80vh] flex flex-col p-0 border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Static Header */}
        <DialogHeader className="p-6 border-b bg-white shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-slate-900">Appointment Overview</DialogTitle>
            <StatusBadge status={appointment.status} type="appointment-status" />
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
          
          {/* Section 1: Session Timing */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
              <Clock className="h-3 w-3 mr-2" /> Schedule & Duration
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Date</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  {appointment.date ? format(new Date(appointment.date), "PPP") : "N/A"}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Time Slot</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  {appointment.startTime} - {appointment.endTime} 
                  <span className="text-[10px] text-slate-400 font-normal ml-1">
                    ({getDurationInMinutes(appointment.startTime, appointment.endTime)}m)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">

            {/* Counsellor */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                <div>
                <p className="text-xs text-slate-400">Counsellor</p>
                <p className="text-sm font-semibold text-slate-900">
                    {appointment.counsellorDetails?.name}
                </p>
                <p className="text-xs text-slate-500">
                    {appointment.counsellorDetails?.email}
                </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                {appointment.counsellor}
                </span>
            </div>

            {/* Student */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                <div>
                <p className="text-xs text-slate-400">Student</p>
                <p className="text-sm font-semibold text-slate-900">
                    {appointment.studentDetails?.name}
                </p>
                <p className="text-xs text-slate-500">
                    {appointment.studentDetails?.email}
                </p>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                {appointment.student}
                </span>
            </div>

            </div>

          {/* Section 3: Logistics */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
              <MapPin className="h-3 w-3 mr-2" /> Meeting Logistics
            </h3>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                {appointment.meetingMethod === 'in-person' ? (
                  <MapPin className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Video className="h-4 w-4 text-blue-500" />
                )}
                <span className="text-sm font-bold capitalize text-slate-900">{appointment.meetingMethod}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-md border border-dashed border-slate-200">
                {appointment.meetingDetails || "No specific details provided."}
              </p>
            </div>
          </div>

          {/* Section 4: System Data */}
          <div className="space-y-4 pb-4">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
              <ShieldCheck className="h-3 w-3 mr-2" /> Audit Trail
            </h3>
            <div className="grid grid-cols-2 gap-y-4 text-[11px]">
              <div>
                <p className="text-slate-400 font-bold uppercase mb-1">Appointment ID</p>
                <p className="font-mono text-slate-600">{appointment._id}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase mb-1">Slot Ref</p>
                <p className="font-mono text-slate-600">{appointment.slotId}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase mb-1">Created At</p>
                <p className="text-slate-600">{format(new Date(appointment.createdAt), "PPp")}</p>
              </div>
              {appointment?.confirmationDeadline && (
                <div>
                <p className="text-slate-400 font-bold uppercase mb-1">Confirmation Deadline</p>
                <p className={`${new Date() > new Date(appointment.confirmationDeadline) ? 'text-red-500' : 'text-slate-600'}`}>
                  {format(new Date(appointment.confirmationDeadline), "PPp")}
                </p>
              </div>
              )}
            </div>
          </div>

        </div>

        {/* Static Footer */}
        <DialogFooter className="p-4 border-t bg-white shrink-0">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto text-slate-600 border-slate-200">
            Close Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}