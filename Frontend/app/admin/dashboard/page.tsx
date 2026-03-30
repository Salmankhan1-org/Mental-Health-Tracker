
import dynamic from 'next/dynamic'
const AdminCriticalReports = dynamic(()=>import('@/components/admin/dashboard/critical-reports'))
const AdminRecentActivities = dynamic(()=>import('@/components/admin/dashboard/admin-recent-activity'))
const RecentAppointments = dynamic(()=>import('@/components/admin/dashboard/recent-appointments')) 
const AdminStatCards = dynamic(()=>import('@/components/admin/dashboard/admin-stats-cards'));

export const metadata = {
  title: 'Admin Dashboard - MindBridge',
  description: 'Admin panel dashboard with key metrics and alerts',
}

export default function AdminDashboard() {

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <AdminStatCards/>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Critical Alerts */}
        <AdminCriticalReports/>

        {/* Recent Activity */}
        <AdminRecentActivities/>
      </div>

      {/* Recent Appointments */}
      <RecentAppointments/>
    </div>
  )
}
