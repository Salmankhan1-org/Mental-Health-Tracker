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
import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ConfirmActionDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'destructive' | 'default'
}

export function ConfirmActionDialog({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = 'destructive'
}: ConfirmActionDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-[400px] p-0 border-none bg-transparent shadow-none">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white p-6 rounded-lg border border-slate-200 shadow-lg"
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold text-slate-900">
                  {title}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500">
                  {description}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="mt-6 gap-2">
                <AlertDialogCancel
                  disabled={loading}
                  onClick={onClose}
                  className="mt-0"
                >
                  {cancelText}
                </AlertDialogCancel>
                
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    onConfirm();
                  }}
                  disabled={loading}
                  className={variant === 'destructive' ? "bg-red-500 hover:bg-red-600 text-white" : "bg-teal-600 hover:bg-teal-700 text-white"}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  {confirmText}
                </AlertDialogAction>
              </AlertDialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </AlertDialogContent>
    </AlertDialog>
  )
}