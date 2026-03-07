'use client'

import { Calendar, Clock, Video, Phone, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const todayAppointments = [
  {
    id: 1,
    studentName: 'Alex Johnson',
    time: '10:00 AM',
    duration: '60 min',
    mode: 'Google Meet',
    modeIcon: Video,
    topic: 'Anxiety Management',
  },
  {
    id: 2,
    studentName: 'Emma Wilson',
    time: '11:30 AM',
    duration: '45 min',
    mode: 'Phone',
    modeIcon: Phone,
    topic: 'Career Stress',
  },
  {
    id: 3,
    studentName: 'Michael Brown',
    time: '2:00 PM',
    duration: '60 min',
    mode: 'In-person',
    modeIcon: MapPin,
    topic: 'Academic Pressure',
  },
]

export function TodayAppointments() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Today's Appointments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {todayAppointments.length > 0 ? (
          todayAppointments.map((apt) => {
            const ModeIcon = apt.modeIcon
            return (
              <div
                key={apt.id}
                className="space-y-2 rounded-lg border border-border bg-secondary/30 p-4 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{apt.studentName}</h3>
                    <p className="text-sm text-muted-foreground">{apt.topic}</p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    Scheduled
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{apt.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ModeIcon className="h-4 w-4" />
                    <span>{apt.mode}</span>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center text-muted-foreground">No appointments today</div>
        )}
      </CardContent>
    </Card>
  )
}
