"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { Save, AlertCircle } from "lucide-react";
import { AdminUsers, ApiErrorResponse } from "@/types/types";
import axios from "axios";
import { toast } from "sonner";
import { LoadingButton } from "@/components/common/button";

export interface StatusChangeDialogParams {
  open: boolean;
  onClose: () => void;
  user: AdminUsers | null;
  onConfirm: () => void;
}

export default function StatusChangeDialog({
  open,
  onClose,
  user,
  onConfirm
}: StatusChangeDialogParams) {

  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    if (user) setStatus(user.status);
  }, [user, open]);

  const handleStatusChange = async () => {
    if (!status.trim()) {
      toast.error("Please select a status");
      return;
    }

    if (status === "suspended" && !reason.trim()) {
        toast.error("Reason is required for suspension");
        return;
    }

    try {
      setLoading(true);

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_HOST}/users/admin/update/status/${user?._id}?status=${status}`,
        {reason:reason.trim()},
        { withCredentials: true }
      );

      if (response.data.success) {
        onConfirm();
        onClose();
        toast.success(response.data.message);
      }

    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const apiError = error.response?.data;
        toast.error(apiError?.error[0].message);
      }
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
        if (user) {
            setStatus(user.status);
            setReason("");
        }
    }, [user, open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-slate-200">

        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            Modify Account Status
          </DialogTitle>

          <DialogDescription className="text-slate-500">
            Update user account status. This affects login and platform access.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-2">

          {/* USER INFO */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {user?.name?.charAt(0)}
            </div>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                {user?.name}
              </p>
              <p className="text-xs text-slate-500 italic">
                {user?.email}
              </p>
            </div>
          </div>

          {/* STATUS SELECT */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
              Account Status
            </label>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11 border-slate-200 shadow-sm">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>

                <SelectItem value="active" className="py-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">Active</span>
                    <span className="text-[11px] text-slate-500">
                      User can access all features normally.
                    </span>
                  </div>
                </SelectItem>

                <SelectItem value="inactive" className="py-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">Inactive</span>
                    <span className="text-[11px] text-slate-500">
                      Temporarily disabled account.
                    </span>
                  </div>
                </SelectItem>

                <SelectItem value="suspended" className="py-2">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">Suspended</span>
                    <span className="text-[11px] text-slate-500">
                      Restricted due to violations.
                    </span>
                  </div>
                </SelectItem>

              </SelectContent>
            </Select>
          </div>

          {(status === "inactive" || status === "suspended") && (
            <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
                Reason {status === "suspended" && <span className="text-red-500">*</span>}
                </label>

                <Textarea
                placeholder={
                    status === "suspended"
                    ? "Enter reason for suspension..."
                    : "Optional reason (e.g. inactivity, admin action...)"
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[90px] border-slate-200"
                />

                {status === "suspended" && (
                <p className="text-xs text-red-500">
                    This reason will be shared with the user.
                </p>
                )}
            </div>
            )}

          {/* WARNING */}
          {status === "suspended" && (
            <div className="flex gap-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-xs leading-relaxed">
                <strong>Warning:</strong> Suspended users cannot login or use the system.
                This action will notify the user via email.
                </p>
            </div>
          )}

        </div>

        <DialogFooter className="gap-2 sm:gap-0">

          <Button
            variant="outline"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 font-medium"
          >
            Cancel
          </Button>

          <LoadingButton
            loading={loading}
            loadingText="Updating..."
            icon={<Save className="w-4 h-4" />}
            disabledConditions={[loading, !status.trim(), status === user?.status]}
            onClick={handleStatusChange}
            className="ml-2"
          >
            Update Status
          </LoadingButton>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}