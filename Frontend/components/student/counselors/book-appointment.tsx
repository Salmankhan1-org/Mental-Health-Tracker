'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { format, startOfDay } from 'date-fns'
import { Calendar as CalendarIcon, Clock, Loader2, CheckCircle2, Video, Phone, MapPin, CalendarCheck } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { ApiErrorResponse } from '@/types/types'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { LoadingButton } from '@/components/common/button'

interface Slot {
  slotId: string // The availability document ID
  startTime: string
  endTime: string
  status: 'available' | 'pending' | 'scheduled' 
}

type MeetingMethod = 'google-meet' | 'phone' | 'in-person';

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
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [slots, setSlots] = useState<Slot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [meetingMethod, setMeetingMethod] = useState<MeetingMethod>('google-meet') 

  // 1. Reset selection and fetch slots when date changes
  useEffect(() => {
    if (date && open) {
      fetchSlots(date)
    } else {
      setSlots([])
      setSelectedSlot(null)
    }
  }, [date, open])

	const fetchSlots = async (selectedDate: Date) => {
		try {
			setLoadingSlots(true)
			setSelectedSlot(null) // Important: clear previous selection
			
			const formattedDate = format(selectedDate, 'yyyy-MM-dd')
			
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_API_HOST}/appointment/${counsellorId}/available/slots?date=${formattedDate}`,
				{ withCredentials: true }
			)

			if (response.data.success) {
				setSlots(response.data.data)
			}
		} catch (error) {
			toast.error("Could not fetch slots for this day.")
			setSlots([])
		} finally {
			setLoadingSlots(false)
		}
	}

	const handleBooking = async () => {
		// 1. Check Date
		if (!date) {
			toast.error("Please select a date from the calendar.");
			return;
		}

		// 2. Check Slot
		if (!selectedSlot) {
			toast.error("Please select a specific time slot.");
			return;
		}

		// 3. Check Meeting Method (Safety check)
		if (!meetingMethod) {
			toast.error("Please select how you want to meet (Zoom, Phone, etc.).");
			return;
		}

		// 4. Double check if the slot is actually available (not held/booked)
		if (selectedSlot.status !== 'available') {
			toast.error("This slot is no longer available. Please pick another.");
			return;
		}

		try {
		setBookingLoading(true)
		const payload = {
			date: format(date, 'yyyy-MM-dd'),
			startTime: selectedSlot.startTime,
			endTime: selectedSlot.endTime,
			meetingMethod
		}

		const response = await axios.post(
			`${process.env.NEXT_PUBLIC_API_HOST}/appointment/${counsellorId}/slots/${selectedSlot.slotId}/book/new`,
			payload,
			{ withCredentials: true }
		)

		if (response.data.success) {
				toast.success("Request sent! Waiting for counsellor approval.")
				onOpenChange(false)
		}
		} catch (error: any) {
			if (axios.isAxiosError<ApiErrorResponse>(error)) {
				const apiError = error.response?.data
				toast.error(apiError?.error?.[0]?.message || "Booking failed")
			}
		} finally {
			setBookingLoading(false)
		}
	}

  // Helper to determine if a slot is currently selected
  const isSelected = (slot: Slot) => 
    selectedSlot?.slotId === slot.slotId && selectedSlot?.startTime === slot.startTime

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl! p-0 overflow-hidden flex flex-col border-none shadow-2xl h-[90vh] md:h-[550px] rounded-xl">
        <div className="flex flex-col md:flex-row  w-full h-full">
          
          {/* Left Side: Date Selection */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-border bg-muted/20 shrink-0 md:w-[320px]">
            <DialogHeader className="mb-4">
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Select a Date
              </DialogTitle>
              <DialogDescription>
                Schedule with {counsellorName}
              </DialogDescription>
            </DialogHeader>

            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border bg-background shadow-sm"
              disabled={(date) => date < startOfDay(new Date())} 
            />
          </div>

          {/* Right Side: Slot Selection */}
          <div className="flex-1 flex w-full flex-col bg-background p-4 min-h-0 h-full overflow-hidden">

			{/* Select Meeting Method */}
			<div className="mb-6 shrink-0">
              <Label className="text-sm font-semibold mb-3 block">Preferred Meeting Method</Label>
              <RadioGroup
                defaultValue="zoom" 
                onValueChange={(val) => setMeetingMethod(val as MeetingMethod)}
                className="grid grid-cols-3 gap-3"
              >
                <div>
                  <RadioGroupItem value="google-meet" id="google-meet" className="peer sr-only" />
                  <Label
                    htmlFor="google-meet"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Video className="mb-1 h-4 w-4" />
                    <span className="text-[10px] uppercase font-bold">Google Meet</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="phone" id="phone" className="peer sr-only" />
                  <Label
                    htmlFor="phone"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Phone className="mb-1 h-4 w-4" />
                    <span className="text-[10px] uppercase font-bold">Phone</span>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="in-person" id="in-person" className="peer sr-only" />
                  <Label
                    htmlFor="in-person"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <MapPin className="mb-1 h-4 w-4" />
                    <span className="text-[10px] uppercase font-bold">Office</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {date ? format(date, 'PPP') : 'Pick a day'}
              </h3>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-2 border-t pt-4">
              {loadingSlots ? (
                <div className="flex flex-col items-center justify-center h-40 space-y-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">Checking availability...</p>
                </div>
              ) : !date ? (
                <div className="text-center py-10 text-sm text-muted-foreground">
                  Choose a date on the left to see available slots.
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-10 text-sm text-muted-foreground">
                  No availability on this day.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {slots.map((slot) => {
                    const isOnHold = slot.status === 'pending';
                    const isBooked = slot.status === 'scheduled';
                    const active = isSelected(slot);

                    return (
                      <button
                        key={`${slot.slotId}-${slot.startTime}`} // Unique key
                        disabled={isOnHold || isBooked}
                        onClick={() => setSelectedSlot(slot)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all flex items-center justify-between
                          ${active 
                            ? 'bg-primary text-primary-foreground border-primary shadow-md scale-[1.02]' 
                            : 'bg-background hover:border-primary/50'}
                          ${(isOnHold || isBooked) && 'opacity-50 grayscale cursor-not-allowed bg-muted'}
                        `}
                      >
                        <span className="font-medium">{slot.startTime} - {slot.endTime}</span>
                        <div className="flex items-center gap-2">
                          {active && <CheckCircle2 className="w-4 h-4" />}
                          {isOnHold && <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded uppercase font-bold">On Hold</span>}
                          {isBooked && <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded uppercase font-bold">Booked</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="mt-6">
              <LoadingButton
				loading={bookingLoading}
				loadingText="Booking..."
				icon={<CalendarCheck className="w-4 h-4" />}
				disabledConditions={[!selectedSlot, !meetingMethod]}
				onClick={handleBooking}
				>
				Request Book Slot
				</LoadingButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}