"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SentimentData } from "@/types/types"
import axios from "axios"
import { useEffect, useState } from "react"
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts"
import  SentimentAnalysisSkeleton  from "./sentiment-analysis-skeleton"

// const sentimentData = [
//   { name: "Positive", value: 42, color: "var(--color-chart-1)" },
//   { name: "Neutral", value: 35, color: "var(--color-chart-4)" },
//   { name: "Negative", value: 23, color: "var(--color-chart-5)" },
// ]



// const recentEmotions = [
//   { label: "Hopeful", intensity: 0.8 },
//   { label: "Anxious", intensity: 0.5 },
//   { label: "Focused", intensity: 0.7 },
//   { label: "Tired", intensity: 0.6 },
//   { label: "Grateful", intensity: 0.9 },
// ]



export interface SentimentAnalysisProps{
  sentimentData: SentimentData[],
  recentEmotions: string[],
  loading: boolean
}

export default function SentimentAnalysis({sentimentData, recentEmotions,loading}:SentimentAnalysisProps) {
  

  if(loading) return <SentimentAnalysisSkeleton/>



  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Emotion Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex justify-center">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--color-foreground)',
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mb-4 flex items-center justify-center gap-4">
          {sentimentData.map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground">
                {item.name} {item.value}%
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Recent Detected Emotions
          </p>
          <div className="flex flex-wrap gap-2">
            {recentEmotions.map((emotion) => (
              <span
                key={emotion}
                className="inline-flex capitalize items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                // style={{ opacity: 0.4 + emotion.intensity * 0.6 }}
              >
                {emotion}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
