

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
import { Button } from "@/components/ui/button";
import { AlertCircle, Save, ShieldAlert, UserCircle } from "lucide-react";
import { AdminUsers, ApiErrorResponse } from "@/types/types";
import axios from "axios";
import { toast } from "sonner";
import { LoadingButton } from "@/components/common/button";

export interface RoleChangeDialogParams {
  open: boolean;
  onClose: () => void;
  user: AdminUsers | null; 
  onConfirm: ()=>void
}

export default function RoleChangeDialog({
  open,
  onClose,
  user,
  onConfirm
}: RoleChangeDialogParams) {
    const [role, setRole] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Sync state when dialog opens or user changes
    useEffect(() => {
        if (user) setRole(user.role);
    }, [user, open]);

    const handlePermissionChange = async()=>{
        if(role.trim() === ''){
            toast.error('Please select a role');
            return;
        }
        try {
            const response = await 
                axios.patch(`${process.env.NEXT_PUBLIC_API_HOST}/users/admin/update/permission/${user?._id}?newRole=${role}`,
                    {},{
                withCredentials: true
            });

            if(response.data.success){
                onConfirm();
                onClose();
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=" border-slate-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">Modify Account Permissions</DialogTitle>
          <DialogDescription className="text-slate-500">
            Assign a new organizational role to this user. Changes take effect immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-2">
          {/* User Identity Section */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500 font-medium italic">{user?.email}</p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="text-[13px] font-bold text-slate-700 uppercase tracking-wider">
              Target Role
            </label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="h-11 border-slate-200  shadow-sm">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student" className="py-2 hover:text-white">
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-900 ">Student</span>
                        <span className="text-[11px] text-slate-500">Standard platform access and session booking.</span>
                    </div>
                </SelectItem>
                {/* <SelectItem value="counsellor" className="py-3">
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-900">Counsellor</span>
                        <span className="text-[11px] text-slate-500">Manage appointments and student interactions.</span>
                    </div>
                </SelectItem> */}
                <SelectItem value="admin" className="py-2 hover:text-white" >
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-900">Administrator</span>
                        <span className="text-[11px] text-slate-500">Full system oversight and user management.</span>
                    </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Critical Warning */}
          {role === "admin" && (
            <div className="flex gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <p className="text-xs leading-relaxed">
                <strong>Attention:</strong> Elevating a user to Admin grants complete access to all data and settings. Ensure this is intentional.
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
            loadingText="Processing..."
            icon={<Save className="w-4 h-4" />}
            disabledConditions={[loading, !role.trim(), role === user?.role]}
            onClick={handlePermissionChange}
            className="ml-2"
        >
            Confirm Change
        </LoadingButton>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}