'use client'

import React from 'react'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppointmentsList } from '@/components/counsellor/appointments/appointments-list'
import { appointmentsData } from '@/lib/mock-data'


export default function AppointmentsPage() {
  return (
    <Tabs defaultValue="upcoming" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        <AppointmentsList appointments={appointmentsData.upcoming} status="upcoming" />
      </TabsContent>

      <TabsContent value="pending">
        <AppointmentsList appointments={appointmentsData.pending} status="pending" />
      </TabsContent>

      <TabsContent value="completed">
        <AppointmentsList appointments={appointmentsData.completed} status="completed" />
      </TabsContent>

      <TabsContent value="cancelled">
        <AppointmentsList appointments={appointmentsData.cancelled} status="cancelled" />
      </TabsContent>
    </Tabs>
  )
}
