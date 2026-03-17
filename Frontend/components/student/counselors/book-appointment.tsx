'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

import { ApiErrorResponse } from '@/types/types'
import { LoadingButton } from '@/components/common/button'

interface Props {
  counsellorId: string
  counsellorName: string 
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function BookAppointmentDialog({
  counsellorId,
  counsellorName,
  open,
  onOpenChange
}: Props) {
  const [availability, setAvailability] = useState<any[]>([])
  const [activeDay, setActiveDay] = useState<any>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotFetched, setSlotFetched] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<any>(null)
  const [bookSlotLoading, setBookSlotLoading] = useState(false)

  const handleFetchAvailableSlots = async () => {
    if (slotFetched) return

    try {
      setLoadingSlots(true)

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}/availability/${counsellorId}/available/slots`,
        { withCredentials: true }
      )

      if (response.data.success) {
        setAvailability(response.data.data)
        setSlotFetched(true)

        if (response.data.data.length > 0) {
          setActiveDay(response.data.data[0])
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingSlots(false)
    }
  }

  const handleBookingSlot = async () => {
    if (!selectedSlot) {
      toast.error('Select a Slot to Book')
      return
    }

    try {
      setBookSlotLoading(true)

      console.dir(`${selectedSlot} Has been Booked`)

      onOpenChange(false)

      toast.success('Slot has been Booked Successfully')
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const apiError = error.response?.data
        toast.error(apiError?.error[0].message)
      }
    } finally {
      setBookSlotLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      handleFetchAvailableSlots()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Schedule with {counsellorName}
          </DialogTitle>

          <DialogDescription>
            Choose a time that works for you. All sessions are confidential.
          </DialogDescription>
        </DialogHeader>

        {loadingSlots && (
          <p className="text-center text-sm py-6">
            Loading slots...
          </p>
        )}

        {!loadingSlots && availability.length > 0 && (
          <div className="flex flex-col gap-4 py-4">

            {/* Days */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {availability.map((day) => (
                <button
                  key={day._id}
                  onClick={() => setActiveDay(day)}
                  className={`px-3 py-2 rounded-lg border text-sm whitespace-nowrap
                  ${
                    activeDay?._id === day._id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border-border hover:border-primary'
                  }`}
                >
                  {new Date(day.date).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    day: 'numeric',
                  })}
                </button>
              ))}
            </div>

            {/* Slots */}
            <div className="rounded-lg bg-secondary p-4">
              <p className="mb-3 text-sm font-medium">
                Available Slots
              </p>

              <div className="grid grid-cols-2 gap-2">
                {activeDay?.slots.map((slot: any) => (
                  <button
                    key={slot._id}
                    disabled={slot?.isBooked || slot?.status === 'blocked'}
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-lg border px-3 py-2 text-sm transition
                    ${
                      slot.isBooked
                        ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                        : selectedSlot?._id === slot._id
                        ? 'bg-primary text-primary-foreground border-primary shadow scale-105'
                        : 'bg-background hover:border-primary hover:bg-primary/5'
                    }`}
                  >
                    {slot.startTime} - {slot.endTime}
                  </button>
                ))}
              </div>
            </div>

            <LoadingButton
              loading={bookSlotLoading}
              className="w-full"
              onClick={handleBookingSlot}
            >
              Confirm Booking
            </LoadingButton>

            <p className="text-center text-xs text-muted-foreground">
              You will receive a confirmation email with session details.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}