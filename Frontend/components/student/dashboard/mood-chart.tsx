"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { useEffect, useState } from "react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"
import  MoodChartSkeleton  from "./mood-chart-skeleton"

// const moodData = [
//   { day: "Mon", mood: 3.5, stress: 4.2 },
//   { day: "Tue", mood: 3.8, stress: 3.8 },
//   { day: "Wed", mood: 2.9, stress: 4.5 },
//   { day: "Thu", mood: 3.2, stress: 3.9 },
//   { day: "Fri", mood: 4.1, stress: 3.2 },
//   { day: "Sat", mood: 4.5, stress: 2.5 },
//   { day: "Sun", mood: 4.2, stress: 2.8 },
// ]

export interface WeeklyMoodData {
  day: string
  mood: number | null
  stress: number | null
}

export default function MoodChart({moodData, loading}:{moodData:WeeklyMoodData[], loading:boolean}) {
  

  if(loading) return <MoodChartSkeleton/>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Weekly Mood & Stress Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={moodData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="stressGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-5)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-chart-5)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 5]}
              tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                fontSize: '13px',
                color: 'var(--color-foreground)',
              }}
            />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="var(--color-chart-1)"
              fill="url(#moodGrad)"
              strokeWidth={2}
              name="Mood"
            />
            <Area
              type="monotone"
              dataKey="stress"
              stroke="var(--color-chart-5)"
              fill="url(#stressGrad)"
              strokeWidth={2}
              name="Stress"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-3 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-1" />
            <span className="text-xs text-muted-foreground">Mood Score</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-chart-5" />
            <span className="text-xs text-muted-foreground">Stress Level</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
