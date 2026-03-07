'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  duration: string
}

export default function AvailabilityPage() {
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: '1', startTime: '09:00', endTime: '12:00', duration: '60' },
    { id: '2', startTime: '14:00', endTime: '17:00', duration: '45' },
  ])
  const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '', duration: '60' })

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const addSlot = () => {
    if (newSlot.startTime && newSlot.endTime) {
      setTimeSlots([
        ...timeSlots,
        {
          id: Date.now().toString(),
          ...newSlot,
        },
      ])
      setNewSlot({ startTime: '', endTime: '', duration: '60' })
    }
  }

  const removeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id))
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Select Available Days</CardTitle>
          <CardDescription>Choose which days you're available for sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {days.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={day}
                  checked={selectedDays.includes(day)}
                  onCheckedChange={() => toggleDay(day)}
                />
                <Label htmlFor={day} className="font-medium cursor-pointer">
                  {day}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Add Time Slots</CardTitle>
          <CardDescription>Define your session availability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add New Slot */}
          <div className="space-y-4 rounded-lg border border-border bg-secondary/30 p-4">
            <h3 className="font-semibold text-foreground">New Time Slot</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, startTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) =>
                    setNewSlot({ ...newSlot, endTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Session Duration</Label>
                <Select value={newSlot.duration} onValueChange={(value) =>
                  setNewSlot({ ...newSlot, duration: value })
                }>
                  <SelectTrigger id="duration">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={addSlot} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Add Slot
            </Button>
          </div>

          {/* Existing Slots */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Current Time Slots</h3>
            {timeSlots.length > 0 ? (
              timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {slot.startTime} - {slot.endTime}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {slot.duration} minute sessions
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSlot(slot.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No time slots added yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button variant="outline">Cancel</Button>
        <Button>Save Availability</Button>
      </div>
    </div>
  )
}
