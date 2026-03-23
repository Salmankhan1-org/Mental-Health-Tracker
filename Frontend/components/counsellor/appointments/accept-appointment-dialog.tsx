'use client'

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Video, MapPin, Phone,  CheckCircle } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ApiErrorResponse } from '@/types/types'
import { LoadingButton } from '@/components/common/button'

type MeetingMethod = 'google-meet' | 'phone' | 'in-person'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  meetingMethod: MeetingMethod
  appointmentId: string
  handleFetchAppointments: ()=>void
}

export default function AcceptAppointmentDialog({
  open,
  onOpenChange,
  meetingMethod,
  appointmentId,
  handleFetchAppointments
}: Props) {
  const [loading, setLoading] = useState(false)

  const [meetingLink, setMeetingLink] = useState('')
  const [location, setLocation] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const handleSubmit = async () => {
    try {
      // Validation
      if (meetingMethod === 'google-meet' && !meetingLink) {
        return toast.error('Please provide meeting link')
      }

      if (meetingMethod === 'in-person' && !location) {
        return toast.error('Please provide location')
      }

      if (meetingMethod === 'phone' && !phoneNumber) {
        return toast.error('Please provide phone number')
      }

      setLoading(true)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/appointment/${appointmentId}/accept`,
        {
          meetingMethod,
          meetingLink,
          location,
          phoneNumber,
        },
        { withCredentials: true }
      )

      if(response.data.success){
            handleFetchAppointments();
            toast.success('Appointment accepted successfully')
            onOpenChange(false)
      }


    } catch (error: any) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiError = error.response?.data
            toast.error(apiError?.error[0].message)
        }
    } finally {
      setLoading(false)
    }
  }

  const renderFields = () => {
    switch (meetingMethod) {
      case 'google-meet':
        return (
          <div className="space-y-2">
            <Label>Google Meet Link</Label>
            <div className="relative">
              <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="https://meet.google.com/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )

      case 'in-person':
        return (
          <div className="space-y-2">
            <Label>Meeting Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Office / Room / Address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )

      case 'phone':
        return (
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="+91 9876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Accept Appointment</DialogTitle>
          <DialogDescription>
            Provide meeting details to confirm this session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {renderFields()}

          {/* <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Confirm & Accept
          </Button> */}

            <LoadingButton
				loading={loading}
				loadingText="Accepting..."
				icon={<CheckCircle className="w-4 h-4" />}
				disabledConditions={[loading]}
				onClick={handleSubmit}
				>
				confirm And Accept
			</LoadingButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}