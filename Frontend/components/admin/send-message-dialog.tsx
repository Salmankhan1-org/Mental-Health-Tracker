'use client'

import { useState } from 'react'
import { 
  Send, 
  Mail, 
  User, 
  AlertCircle, 
  Info, 
  UserCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { AdminCounsellors } from '@/types/types'
import { LoadingButton } from '../common/button'

interface ContactCounsellorProps {
  counsellor: AdminCounsellors
  reportId?: string
  isOpen: boolean
  onClose: () => void
}

export default function SendMessageDialog({
  counsellor,
  reportId,
  isOpen,
  onClose
}: ContactCounsellorProps) {
  if (!counsellor) return null

  const [subject, setSubject] = useState(reportId ? `Urgent: Regarding Report #${reportId.slice(-6)}` : '')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState(reportId ? 'report_inquiry' : 'general')
  const [isSending, setIsSending] = useState(false)

  const handleSendMessage = async () => {
    if (!message || !subject) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSending(true)
    try {
      // API call placeholder
      await new Promise(resolve => setTimeout(resolve, 1200))
      toast.success(`Message sent to ${counsellor.name}`)
      onClose()
    } catch (error) {
      toast.error("Failed to send message")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Key Changes: 
          1. h-[90vh] - Sets a responsive max height 
          2. flex flex-col - Allows children to stack and share space
      */}
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-slate-200 shadow-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col">
        
        {/* Header: Fixed at top */}
       <DialogHeader className="p-6 border-b bg-white shrink-0">
        <div className="space-y-1">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-slate-900">
            <Mail className="h-5 w-5 text-primary" />
            Contact Counsellor
            </DialogTitle>
            <p className="text-slate-500 text-xs">
            Direct communication from Admin Panel
            </p>
        </div>

        <div className="mt-5 flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
            <UserCircle className="h-6 w-6 text-primary" />
            </div>

            <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 truncate">
                {counsellor.name}
            </p>
            <p className="text-xs text-slate-500 truncate">
                {counsellor.email}
            </p>
            </div>

            {reportId && (
            <div className="ml-auto bg-destructive/10 text-destructive text-[10px] font-semibold px-2 py-1 rounded border border-destructive/20 uppercase">
                Linked to Report
            </div>
            )}
        </div>
        </DialogHeader>

        {/* Scrollable Content: 
            flex-1 + overflow-y-auto ensures this area scrolls while header/footer stay put 
        */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white custom-scrollbar">
          {/* Category Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Communication Purpose</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11 bg-muted border-border focus:ring-primary">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Coordination</SelectItem>
                <SelectItem value="report_inquiry">Report Follow-up / Inquiry</SelectItem>
                <SelectItem value="warning">Formal Warning</SelectItem>
                <SelectItem value="training">Training & Guidance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject Line */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Subject Line</label>
            <Input 
              placeholder="Enter email subject..." 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-11 bg-muted border-border focus:ring-primary"
            />
          </div>

          {/* Message Body */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Message Content</label>
              {category === 'warning' && (
                <span className="text-[10px] text-red-500 flex items-center gap-1 font-medium bg-red-50 px-2 py-0.5 rounded border border-red-100">
                  <AlertCircle className="h-3 w-3" /> This will be logged as a formal warning
                </span>
              )}
            </div>
            <Textarea 
              placeholder="Write your message here..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[220px] bg-muted border-border resize-none focus:ring-primary p-4"
            />
          </div>

          {/* Guidelines Note */}
          <div className="flex gap-3 p-4 bg-muted rounded-xl border border-border">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
                <p className="text-[11px] font-semibold text-slate-700 uppercase">
                Important Notice
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                A copy of this thread will be saved in the counsellor's communication logs for audit purposes.
                </p>
            </div>
            </div>
        </div>

        {/* Footer: Fixed at bottom */}
        <DialogFooter className="p-4 border-t bg-slate-50 shrink-0 flex-row justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isSending} className="text-slate-500">
            Cancel
          </Button>
          <LoadingButton
            loading={isSending}
            loadingText="Sending..."
            icon={<Send className="h-4 w-4" />}
            onClick={handleSendMessage}
            disabledConditions={[
                isSending,
                !message.trim(),
                !subject.trim()
            ]}
            className={cn(
                "px-8 font-semibold",
                category === 'warning'
                ? "bg-destructive hover:bg-destructive/90 text-white"
                : "bg-primary hover:bg-primary/90 text-white"
            )}
            >
            Send Message
            </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}