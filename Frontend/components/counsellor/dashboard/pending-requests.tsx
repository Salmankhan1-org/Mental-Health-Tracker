'use client'

import { AlertCircle, Check, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const pendingRequests = [
  {
    id: 1,
    studentName: 'Sarah Davis',
    requestDate: 'Today',
    topic: 'Panic Attacks',
    preferredTime: 'Evening',
  },
  {
    id: 2,
    studentName: 'James Miller',
    requestDate: 'Yesterday',
    topic: 'Sleep Issues',
    preferredTime: 'Morning',
  },
]

export function PendingRequests() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-wellness-alert" />
          Pending Requests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingRequests.length > 0 ? (
          pendingRequests.map((req) => (
            <div
              key={req.id}
              className="space-y-3 rounded-lg border border-border bg-secondary/30 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{req.studentName}</h3>
                  <p className="text-sm text-muted-foreground">{req.topic}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="text-xs">
                      {req.preferredTime}
                    </Badge>
                    <span>{req.requestDate}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 gap-1">
                  <Check className="h-4 w-4" />
                  Accept
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1">
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground">No pending requests</div>
        )}
      </CardContent>
    </Card>
  )
}
