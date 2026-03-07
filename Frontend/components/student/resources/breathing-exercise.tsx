"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

const phases = [
  { name: "Breathe In", duration: 4 },
  { name: "Hold", duration: 7 },
  { name: "Breathe Out", duration: 8 },
]

export function BreathingExercise() {
  const [isActive, setIsActive] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [counter, setCounter] = useState(phases[0].duration)
  const [cycles, setCycles] = useState(0)

  const reset = useCallback(() => {
    setIsActive(false)
    setPhaseIndex(0)
    setCounter(phases[0].duration)
    setCycles(0)
  }, [])

  useEffect(() => {
    if (!isActive) return

    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 1) {
          const nextPhase = (phaseIndex + 1) % phases.length
          if (nextPhase === 0) {
            setCycles((c) => c + 1)
          }
          setPhaseIndex(nextPhase)
          return phases[nextPhase].duration
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, phaseIndex])

  const phase = phases[phaseIndex]
  const progress = 1 - counter / phase.duration

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">4-7-8 Breathing Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6">
          {/* Circle animation */}
          <div className="relative flex h-48 w-48 items-center justify-center">
            <svg className="absolute inset-0" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="var(--color-secondary)"
                strokeWidth="6"
              />
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${progress * 534} 534`}
                transform="rotate(-90 100 100)"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div
              className={`flex h-36 w-36 flex-col items-center justify-center rounded-full transition-all duration-1000 ${
                isActive ? "bg-primary/10" : "bg-secondary"
              }`}
              style={{
                transform: isActive
                  ? phaseIndex === 0
                    ? `scale(${1 + progress * 0.15})`
                    : phaseIndex === 2
                      ? `scale(${1.15 - progress * 0.15})`
                      : "scale(1.15)"
                  : "scale(1)",
              }}
            >
              <span className="text-3xl font-bold text-foreground">{counter}</span>
              <span className="text-sm font-medium text-primary">{phase.name}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            Cycles completed: {cycles}
          </p>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={reset}
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setIsActive(!isActive)}
              className="gap-2 px-6"
            >
              {isActive ? (
                <>
                  <Pause className="h-4 w-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" /> Start
                </>
              )}
            </Button>
          </div>

          <p className="max-w-sm text-center text-sm text-muted-foreground">
            This technique activates your parasympathetic nervous system, reducing
            anxiety and promoting relaxation. Aim for 3-4 cycles.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
