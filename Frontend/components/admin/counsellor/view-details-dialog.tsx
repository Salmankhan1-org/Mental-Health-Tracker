"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Badge 
} from "@/components/ui/badge";
import { 
  Mail, 
  Briefcase, 
  MapPin, 
  FileText, 
  Award, 
  Clock, 
  Globe 
} from "lucide-react";
import { AdminCounsellors } from "@/types/types";

interface CounsellorDetailDialogProps {
  open: boolean;
  onClose: () => void;
  counsellor: AdminCounsellors; // Ideally use your Counsellor Type here
}

export default function CounsellorDetailDialog({
  open,
  onClose,
  counsellor,
}: CounsellorDetailDialogProps) {
  if (!counsellor) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[85vh] flex flex-col p-0 border-slate-200 shadow-xl overflow-hidden">
        <DialogHeader className="p-3 border-b bg-white shrink-0 bg-slate-50/30">
          <DialogTitle className="text-xl font-bold text-slate-900">Application Review</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/30">
          {/* Header Profile Section */}
          <div className="flex items-start gap-5">
            <Avatar className="h-20 w-20 border-4 border-white shadow-md">
              <AvatarImage src={counsellor.profileImage} />
              <AvatarFallback className="bg-indigo-600 text-white text-2xl font-bold">
                {counsellor.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">{counsellor.name}</h2>
              <p className="flex items-center text-indigo-600 font-semibold text-sm">
                <Briefcase className="h-4 w-4 mr-2" />
                {counsellor.title}
              </p>
              <p className="flex items-center text-slate-500 text-sm">
                <Mail className="h-4 w-4 mr-2" />
                {counsellor.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Professional Stats */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Credentials</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 italic">License Number</p>
                    <p className="font-medium text-slate-900">{counsellor.licenseNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 italic">Experience</p>
                    <p className="font-medium text-slate-900">{counsellor.yearsOfExperience} Years</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logistics */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Logistics</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 italic">Location</p>
                    <p className="font-medium text-slate-900">{counsellor.location || "Remote"}</p>
                  </div>
                </div>
                {/* <div className="flex items-center gap-3 text-sm">
                  <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 italic">Virtual Sessions</p>
                    <p className="font-medium text-slate-900">{counsellor.virtualSessions ? "Enabled" : "Disabled"}</p>
                  </div>
                </div> */}
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center">
              <FileText className="h-3 w-3 mr-2" /> Professional Bio
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed italic">
              "{counsellor.bio}"
            </div>
          </div>

          {/* Expertise Tags */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Specialized Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {counsellor.expertiseTags?.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100 px-3 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="p-2 border-t bg-slate-50/30 shrink-0">
          <Button variant="outline" onClick={onClose} className="text-slate-500">
            Close Overview
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}