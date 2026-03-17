"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import { ApiErrorResponse } from "@/types/types"
import { toast } from "sonner"

const moods = [
  { value: 5, label: "Great", color: "bg-chart-2" },
  { value: 4, label: "Good", color: "bg-chart-1" },
  { value: 3, label: "Okay", color: "bg-chart-4" },
  { value: 2, label: "Low", color: "bg-accent" },
  { value: 1, label: "Struggling", color: "bg-destructive" },
]


export interface MoodCheckInProps{
  fetchWeeklyMoodData: ()=>void,
  fetchRecentActivities: ()=>void,
  fetchWeeklySentimentData: ()=>void,
  fetchRecentEmotions: ()=>void
}
export default function MoodCheckin({fetchWeeklyMoodData,fetchRecentActivities,fetchWeeklySentimentData,fetchRecentEmotions}:MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [submitted, setSubmitted] = useState(false);
  const [loading ,setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selectedMood || loading) return

    try {
      setLoading(true)

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/mood/check-in`,
        {
          mood: selectedMood.toLowerCase(),
          note: note.toLowerCase(),
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )

      if (response?.data.success) {
        setSubmitted(true)
        setSelectedMood(null)
        setNote("")
        fetchWeeklyMoodData()
        fetchWeeklySentimentData()
        fetchRecentActivities()
        fetchRecentEmotions()
        toast.success(response?.data?.message)
      }
    } catch (error: any) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const apiError = error.response?.data
        toast.error(apiError?.error[0].message)
      }
    } finally {
      setLoading(false)
    }
  }

  const isAlreadyCheckedIn = async()=>{
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/mood/today/status`,{
        withCredentials: true
      });

      if(response?.data?.success){
        setSubmitted(true);
      }
    } catch (error) {
      if (axios.isAxiosError<ApiErrorResponse>(error)) {
        const apiError = error.response?.data
        console.log(apiError?.error[0].message)
      }
    }
  }

  useEffect(()=>{
    isAlreadyCheckedIn();
  },[]);



  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">Check-in recorded!</p>
            <p className="text-sm text-muted-foreground">Thank you for sharing.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.label)}
                  className={`flex flex-1 flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                    selectedMood === mood.label
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-transparent bg-secondary hover:border-border"
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full ${mood.color}`} />
                  <span className="text-xs font-medium text-foreground">
                    {mood.label}
                  </span>
                </button>
              ))}
            </div>

            <Textarea
              placeholder="Want to add a note about how you're feeling? (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="resize-none text-sm"
              rows={3}
            />

            <Button
            onClick={handleSubmit}
            disabled={selectedMood === null || loading}
            className="w-full"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Logging...
              </div>
            ) : (
              "Log Check-in"
            )}
          </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
