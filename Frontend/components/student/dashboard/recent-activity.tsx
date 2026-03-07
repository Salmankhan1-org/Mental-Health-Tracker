"use client"
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios";
import {
  MessageSquare,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Activity,
} from "lucide-react"
import { useEffect, useState } from "react"
import type { RecentActivity } from "@/types/types";
import { formatDistanceToNow } from "date-fns";


// const activities = [
//   {
//     icon: <MessageSquare className="h-4 w-4" />,
//     title: "Chat Session Completed",
//     description: "Discussed exam stress coping strategies",
//     time: "2 hours ago",
//     type: "chat",
//   },
//   {
//     icon: <CheckCircle2 className="h-4 w-4" />,
//     title: "Mood Check-in",
//     description: "Logged mood: Feeling Good",
//     time: "5 hours ago",
//     type: "checkin",
//   },
//   {
//     icon: <BookOpen className="h-4 w-4" />,
//     title: "Resource Viewed",
//     description: "Mindfulness Meditation for Students guide",
//     time: "1 day ago",
//     type: "resource",
//   },
//   {
//     icon: <BarChart3 className="h-4 w-4" />,
//     title: "Weekly Report Generated",
//     description: "Your emotional trend analysis is ready",
//     time: "2 days ago",
//     type: "report",
//   },
//   {
//     icon: <MessageSquare className="h-4 w-4" />,
//     title: "Chat Session Completed",
//     description: "Explored sleep improvement techniques",
//     time: "3 days ago",
//     type: "chat",
//   },
// ]

export function RecentActivity() {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {activities && activities?.length > 0 && activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-3 border-b border-border py-3 last:border-0 last:pb-0 first:pt-0"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Activity className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {activity?.relation}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {activity?.message}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
