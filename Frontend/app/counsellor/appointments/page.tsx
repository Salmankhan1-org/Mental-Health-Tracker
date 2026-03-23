'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AppointmentsList } from '@/components/counsellor/appointments/appointments-list'



export default function AppointmentsPage() {
	return (
		<Tabs defaultValue="scheduled" className="space-y-2">
		<TabsList className="grid w-full grid-cols-4">
			<TabsTrigger value="scheduled">Upcoming</TabsTrigger>
			<TabsTrigger value="pending">Pending</TabsTrigger>
			<TabsTrigger value="completed">Completed</TabsTrigger>
			<TabsTrigger value="cancelled">Cancelled</TabsTrigger>
		</TabsList>

		<TabsContent value="scheduled">
			<AppointmentsList  status="scheduled" />
		</TabsContent>

		<TabsContent value="pending">
			<AppointmentsList  status="pending" />
		</TabsContent>

		<TabsContent value="completed">
			<AppointmentsList  status="completed" />
		</TabsContent>

		<TabsContent value="cancelled">
			<AppointmentsList  status="cancelled" />
		</TabsContent>
		</Tabs>
	)
}
