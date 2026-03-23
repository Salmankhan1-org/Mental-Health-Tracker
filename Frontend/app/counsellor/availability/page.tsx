

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus, Loader2, Clock, AlertCircle } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { ApiErrorResponse } from '@/types/types'

interface TimeRange {
  id: string
  startTime: string
  endTime: string
  duration: string
}

export default function AvailabilityPage() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const [activeDay, setActiveDay] = useState('Monday')
  const [loading, setLoading] = useState(false)
  const [timezone, setTimezone] = useState('Asia/Kolkata')
  const [schedule, setSchedule] = useState<Record<string, TimeRange[]>>({
    Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [], Sunday: []
  })

  // Local state for the "Add New" form
  const [newRange, setNewRange] = useState({ startTime: '', endTime: '', duration: '60' })
  const [rangeError, setRangeError] = useState('')

  // 1. Fetch existing data on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/availability/counsellor/schedule`, { withCredentials: true })
        if (data.success && data.data) {
          // Transform backend payload back to our schedule format
          const newSchedule = { ...schedule }
          data.data.forEach((item: any) => {
            newSchedule[item.dayOfWeek] = item.ranges.map((r: any) => ({
              id: crypto.randomUUID(),
              startTime: r.startTime,
              endTime: r.endTime,
              duration: r.duration.toString()
            }))
          })
          setSchedule(newSchedule)
          if(data.timezone) setTimezone(data.timezone)
        }
      } catch (error) {
        console.error("Fetch error", error)
      }
    }
    fetchAvailability()
  }, [])



  const timeToMin = (t: string) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  // 2. Local Validation Logic
  const validateAndAddRange = () => {
    setRangeError('')
    const { startTime, endTime, duration } = newRange
    if (!startTime || !endTime) return setRangeError('Please select both times')

    const start = timeToMin(startTime)
    const end = timeToMin(endTime)

    if (start >= end) return setRangeError('Start time must be before end time')
    if (Number(duration) > (end - start)) return setRangeError('Duration exceeds time range')

    // Overlap/Duplicate Check
    const existing = schedule[activeDay]
    const hasOverlap = existing.some(r => {
      const rStart = timeToMin(r.startTime)
      const rEnd = timeToMin(r.endTime)
      return (start < rEnd && end > rStart)
    })

    if (hasOverlap) return setRangeError('This range overlaps or duplicates an existing one')

    setSchedule(prev => ({
      ...prev,
      [activeDay]: [...prev[activeDay], { id: crypto.randomUUID(), ...newRange }].sort((a,b) => timeToMin(a.startTime) - timeToMin(b.startTime))
    }))
    setNewRange({ startTime: '', endTime: '', duration: '60' })
  }

  const updateRange = (id: string, field: string, value: string) => {
    setSchedule(prev => ({
      ...prev,
      [activeDay]: prev[activeDay].map(r => r.id === id ? { ...r, [field]: value } : r)
    }))
  }

  const removeRange = (id: string) => {
    setSchedule(prev => ({
      ...prev,
      [activeDay]: prev[activeDay].filter(r => r.id !== id)
    }))
  }

  const saveToBackend = async () => {
    try {
      setLoading(true)
      const payload = Object.entries(schedule)
        .filter(([_, ranges]) => ranges.length > 0)
        .map(([day, ranges]) => ({
          dayOfWeek: day,
          ranges: ranges.map(r => ({
            startTime: r.startTime,
            endTime: r.endTime,
            duration: Number(r.duration)
          }))
        }))

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/availability/counsellor/new`,
        { payload, timezone },
        { withCredentials: true }
      )

      if (response.data.success) toast.success("Availability updated successfully")
    } catch (error: any) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiError = error.response?.data
            toast.error(apiError?.error[0].message)
        }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-1">
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <p className="text-muted-foreground text-sm">Set your weekly recurring time slots.</p>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-45 h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Asia/Kolkata">India (IST)</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="America/New_York">New York (EST)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2 bg-muted/50 p-1 rounded-lg w-fit">
        {days.map(day => (
          <button
            key={day}
            onClick={() => {setActiveDay(day); setRangeError('')}}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeDay === day ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-primary'}`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Add Range Form */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Add New Range</CardTitle>
              <CardDescription>Define a specific slot for {activeDay}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase text-muted-foreground">Start</Label>
                  <Input type="time" className="h-9" value={newRange.startTime} onChange={e => setNewRange({...newRange, startTime: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs uppercase text-muted-foreground">End</Label>
                  <Input type="time" className="h-9" value={newRange.endTime} onChange={e => setNewRange({...newRange, endTime: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs uppercase text-muted-foreground">Session Duration</Label>
                <Select value={newRange.duration} onValueChange={v => setNewRange({...newRange, duration: v})}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {rangeError && (
                <div className="flex items-center gap-2 text-destructive text-xs bg-destructive/10 p-2 rounded">
                  <AlertCircle className="w-3 h-3" /> {rangeError}
                </div>
              )}
              <Button onClick={validateAndAddRange} variant="secondary" className="w-full h-9">
                <Plus className="w-4 h-4 mr-2" /> Add to {activeDay}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: List of Ranges */}
        <div className="lg:col-span-7">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              Current Slots <span className="text-xs font-normal text-muted-foreground">({schedule[activeDay].length})</span>
            </h3>
            <div className="space-y-2">
              {schedule[activeDay].length === 0 ? (
                <div className="h-32 border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground text-sm">
                  No slots defined for {activeDay}
                </div>
              ) : (
                schedule[activeDay].map(range => (
                  <div key={range.id} className="group flex items-center gap-3 bg-white border p-2 pl-4 rounded-xl hover:border-primary/50 transition-colors">
                    <div className="flex-1 flex items-center gap-4">
                      <Input 
                        type="time" 
                        value={range.startTime} 
                        className="w-24 border-none p-0 h-7 focus-visible:ring-0 text-sm font-medium"
                        onChange={(e) => updateRange(range.id, 'startTime', e.target.value)}
                      />
                      <span className="text-muted-foreground text-xs">to</span>
                      <Input 
                        type="time" 
                        value={range.endTime} 
                        className="w-24 border-none p-0 h-7 focus-visible:ring-0 text-sm font-medium"
                        onChange={(e) => updateRange(range.id, 'endTime', e.target.value)}
                      />
                      <div className="ml-auto text-xs bg-primary/5 text-primary px-2 py-1 rounded">
                        {range.duration}m
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                      onClick={() => removeRange(range.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t flex justify-end">
        <Button onClick={saveToBackend} disabled={loading} className="px-8 shadow-lg shadow-primary/20">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save All Changes
        </Button>
      </div>
    </div>
  )
}