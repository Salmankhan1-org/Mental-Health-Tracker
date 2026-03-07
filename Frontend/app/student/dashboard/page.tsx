

import { MoodCheckin } from "@/components/student/dashboard/mood-checkin"
import { MoodChart } from "@/components/student/dashboard/mood-chart"
import { WellbeingScore } from "@/components/student/dashboard/wellbeing-score"
import { SentimentAnalysis } from "@/components/student/dashboard/sentiment-analysis"
import { QuickActions } from "@/components/student/dashboard/quick-actions"
import { RecentActivity } from "@/components/student/dashboard/recent-activity"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import DashBoardHeader from "@/components/student/dashboard/dashboard-header"

export const metadata = {
  title: "Dashboard - MindBridge",
  description: "Track your emotional wellbeing, mood patterns, and access mental health tools.",
}

export default function DashboardPage() {

  return (
    <div className="px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <DashBoardHeader/>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <MoodCheckin />
            <MoodChart />
            <RecentActivity />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <WellbeingScore />
            <SentimentAnalysis />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}
