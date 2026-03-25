'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, CheckCircle } from "lucide-react"

interface ApproveActionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
}

export function ApproveActionDialog({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Approve Action",
  description = "This action will proceed and grant access.",
  confirmText = "Approve",
  cancelText = "Cancel",
}: ApproveActionDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[400px]">
        
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <AlertDialogTitle className="text-xl font-bold text-slate-900">
              {title}
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="text-slate-500">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={loading} onClick={onClose}>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  )
}