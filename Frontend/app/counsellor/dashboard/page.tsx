import { PendingRequests } from "@/components/counsellor/dashboard/pending-requests"
import { StatsCards } from "@/components/counsellor/dashboard/stats-card"
import { TodayAppointments } from "@/components/counsellor/dashboard/today-appointments"


export const metadata = {
  title: 'Counsellor Dashboard - MindBridge',
  description: 'Manage appointments and client sessions',
}

export default function CounsellorDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsCards />

      {/* Main Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TodayAppointments />
        <PendingRequests />
      </div>
    </div>
  )
}
