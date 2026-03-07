'use client'

import { Calendar, Clock, Video, Phone, MapPin, FileText, Link as LinkIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {type Appointment } from '@/types/types'


interface AppointmentsListProps {
  appointments: Appointment[]
  status: 'upcoming' | 'pending' | 'completed' | 'cancelled'
}

const modeIcons = {
  'Google Meet': Video,
  'Phone': Phone,
  'In-person': MapPin,
}

const statusStyles = {
  upcoming: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
}

export function AppointmentsList({ appointments, status }: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <Card className="border-border p-12 text-center">
        <p className="text-muted-foreground">No {status} appointments</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {appointments.map((apt) => {
        const ModeIcon = modeIcons[apt.mode as keyof typeof modeIcons]
        return (
          <Card
            key={apt.id}
            className="border-border p-4 hover:shadow-md transition-shadow"
          >
            <div className="grid gap-4 md:grid-cols-4 md:items-start">
              {/* Student Info */}
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">{apt.studentName}</h3>
                <p className="text-sm text-muted-foreground">{apt.topic}</p>
              </div>

              {/* Date & Time */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{apt.date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{apt.time}</span>
                </div>
              </div>

              {/* Mode & Status */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {ModeIcon && <ModeIcon className="h-4 w-4 text-muted-foreground" />}
                  <span className="text-sm text-muted-foreground">{apt.mode}</span>
                </div>
                <Badge className={statusStyles[status]}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {status === 'pending' && (
                  <>
                    <Button size="sm" variant="default">
                      Confirm
                    </Button>
                    <Button size="sm" variant="outline">
                      Reject
                    </Button>
                  </>
                )}
                {status === 'upcoming' && (
                  <>
                    <Button size="sm" variant="outline" className="gap-1">
                      <LinkIcon className="h-3 w-3" />
                      Add Link
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <FileText className="h-3 w-3" />
                      Notes
                    </Button>
                  </>
                )}
                {status === 'completed' && (
                  <Button size="sm" variant="outline" className="gap-1">
                    <FileText className="h-3 w-3" />
                    View Notes
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
