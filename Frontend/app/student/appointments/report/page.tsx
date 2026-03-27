

'use client'

import { useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, AlertTriangle } from 'lucide-react'

export default function ReportPage() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const token = searchParams.get('token')

  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reason) {
      toast.error('Please select a reason')
      return
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/appointment/report?token=${token}`,
        { reason, description },{withCredentials: true}
      )

      if (res.data.success) {
        toast.success('Report submitted successfully')
        setSubmitted(true);
      }

    } catch (err: any) {
      toast.error(err?.response?.data?.error?.[0]?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
            <Card className="w-full max-w-lg shadow-xl border">

            {!submitted ? (
                <>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Report an Issue
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div>
                    <p className="text-sm text-muted-foreground mb-3">
                        Let us know what went wrong with your session. Your feedback helps us improve the experience.
                    </p>

                    <Select onValueChange={setReason}>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="no_show">Counsellor didn’t show up</SelectItem>
                        <SelectItem value="late_join">Joined late</SelectItem>
                        <SelectItem value="unprofessional_behavior">Unprofessional behavior</SelectItem>
                        <SelectItem value="technical_issue">Technical issue</SelectItem>
                        <SelectItem value="breach_of_confidentiality">Breach of Confidentiality</SelectItem>
                        <SelectItem value="missed_appointment">Missed Appointment</SelectItem>
                        <SelectItem value="unprofessional_communication">Unprofessional Communication</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>

                    <div>
                    <Textarea
                        placeholder="Example: Counsellor didn’t join for 15 minutes and didn’t inform beforehand"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />
                    </div>

                    <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2"
                    >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? 'Submitting...' : 'Submit Report'}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                    Our team will review your report and take appropriate action.
                    </p>
                </CardContent>
                </>
            ) : (
                <CardContent className="flex flex-col items-center justify-center text-center py-12 space-y-4">
                
                <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-lg font-semibold">
                    Report Submitted
                </h2>

                <p className="text-sm text-muted-foreground max-w-sm">
                    Thank you for your feedback. Our team will review the issue and take appropriate action.
                </p>

                </CardContent>
            )}

            </Card>
        </div>
    )
}
