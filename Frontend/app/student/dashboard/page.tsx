"use client"
import DailyGuidance from "@/components/student/dashboard/daily-guidance";
import { WeeklyMoodData } from "@/components/student/dashboard/mood-chart";
import { Stats } from "@/components/student/dashboard/wellbeing-score";
import {SentimentData, type RecentActivity } from "@/types/types";
import axios from "axios";
import dynamic from "next/dynamic"
import { useEffect, useState } from "react";

const DashBoardHeader = dynamic(()=>import('@/components/student/dashboard/dashboard-header'));
const MoodCheckin  = dynamic(()=>import("@/components/student/dashboard/mood-checkin"))
const MoodChart  = dynamic(()=>import("@/components/student/dashboard/mood-chart"))
const WellbeingScore  = dynamic(()=>import("@/components/student/dashboard/wellbeing-score"))
const SentimentAnalysis  = dynamic(()=>import("@/components/student/dashboard/sentiment-analysis"))
const QuickActions = dynamic(()=>import('@/components/student/dashboard/quick-actions'))
const RecentActivity = dynamic(()=>import('@/components/student/dashboard/recent-activity'))

// export const metadata = {
//   title: "Dashboard - MindBridge",
//   description: "Track your emotional wellbeing, mood patterns, and access mental health tools.",
// }

export default function DashboardPage() {
  const [moodData, setMoodData] = useState<WeeklyMoodData[]>([]);
  const [moodDataloading, setMoodDataLoading] = useState(false);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [stats, setStats] = useState<Stats | null>(null)
  const [wellBeingScoreLoading, setWellBeingScoreLoading] = useState(true)
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [recentEmotions, setRecentEmotions] = useState([]);
  const [sentimentDataLoading, setSentimentDataLoading] = useState(false);

  const fetchWeeklyMoodData = async()=>{
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/mood/weekly/mood/chart`,{
        withCredentials: true
      });

      if(response?.data.success){
        setMoodData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    setMoodDataLoading(true);
    const loadData = async()=>{
      await fetchWeeklyMoodData();
      setMoodDataLoading(false);
    }
    loadData();
  },[]);

  const fetchRecentActivities = async()=>{
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/users/logs`,{
        withCredentials: true
      });

      if(response.data?.success){
        setActivities(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    fetchRecentActivities();
  },[]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setWellBeingScoreLoading(true);
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_HOST}/mood/weekly/status`,
          { withCredentials: true }
        )

        if(res.data.success){
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err)
      } finally {
        setWellBeingScoreLoading(false)
      }
    }

    fetchStats()
  }, [])

  const fetchWeeklySentimentData = async()=>{
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/mood/weekly/sentiment/status`,{
        withCredentials: true
      });

      if(response.data.success){
        setSentimentData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }


  const fetchRecentEmotions = async()=>{
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/mood/emotions/today`,{
        withCredentials: true
      });

      if(response.data.success){
        setRecentEmotions(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }



  useEffect(() => {
    const loadData = async () => {
		setSentimentDataLoading(true);
		await Promise.all([
			fetchWeeklySentimentData(),
			fetchRecentEmotions(),
		])
		setSentimentDataLoading(false)
    }

    loadData()
  }, []);

  return (
    <div className="px-4 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <DashBoardHeader/>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Daily Guidance  */}
            <DailyGuidance/>
            <MoodCheckin 
				fetchWeeklyMoodData={fetchWeeklyMoodData} 
				fetchRecentActivities={fetchRecentActivities} 
				fetchWeeklySentimentData={fetchWeeklySentimentData}
				fetchRecentEmotions={fetchRecentEmotions}
				/>
            <MoodChart moodData={moodData} loading={moodDataloading} />
            <RecentActivity activities={activities} />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            <WellbeingScore stats={stats} loading={wellBeingScoreLoading}/>
            <SentimentAnalysis sentimentData={sentimentData} recentEmotions={recentEmotions} loading={sentimentDataLoading} />
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  )
}
