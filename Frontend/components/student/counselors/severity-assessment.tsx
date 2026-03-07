"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle2, Info, ArrowRight } from "lucide-react"
import Link from "next/link"

const questions = [
  {
    id: "q1",
    text: "Over the past two weeks, how often have you felt down, depressed, or hopeless?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" },
    ],
  },
  {
    id: "q2",
    text: "How often have you had trouble falling or staying asleep, or sleeping too much?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" },
    ],
  },
  {
    id: "q3",
    text: "How often have you felt nervous, anxious, or on edge?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" },
    ],
  },
  {
    id: "q4",
    text: "How often have you had difficulty concentrating on things like schoolwork or reading?",
    options: [
      { value: "0", label: "Not at all" },
      { value: "1", label: "Several days" },
      { value: "2", label: "More than half the days" },
      { value: "3", label: "Nearly every day" },
    ],
  },
]

type SeverityLevel = "low" | "moderate" | "high" | null

export function SeverityAssessment() {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [result, setResult] = useState<SeverityLevel>(null)
  const [currentStep, setCurrentStep] = useState(0)

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value })
  }

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      calculateResult()
    }
  }

  const calculateResult = () => {
    const total = Object.values(answers).reduce(
      (sum, val) => sum + parseInt(val),
      0
    )
    if (total <= 3) setResult("low")
    else if (total <= 7) setResult("moderate")
    else setResult("high")
  }

  const reset = () => {
    setAnswers({})
    setResult(null)
    setCurrentStep(0)
  }

  if (result) {
    return <ResultCard level={result} onReset={reset} />
  }

  const question = questions[currentStep]
  const isAnswered = answers[question.id] !== undefined

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Wellbeing Check</CardTitle>
        <p className="text-sm text-muted-foreground">
          This brief assessment helps us recommend the right level of support for
          you.
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= currentStep ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>

        <p className="mb-4 text-xs text-muted-foreground">
          Question {currentStep + 1} of {questions.length}
        </p>

        <p className="mb-6 text-sm font-medium text-foreground">
          {question.text}
        </p>

        <RadioGroup
          value={answers[question.id] || ""}
          onValueChange={(value) => handleAnswer(question.id, value)}
          className="flex flex-col gap-3"
        >
          {question.options.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-secondary/50"
            >
              <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
              <Label
                htmlFor={`${question.id}-${option.value}`}
                className="flex-1 cursor-pointer text-sm text-foreground"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <Button
          onClick={handleNext}
          disabled={!isAnswered}
          className="mt-6 w-full gap-2"
        >
          {currentStep < questions.length - 1 ? (
            <>
              Next <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            "See Results"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

function ResultCard({
  level,
  onReset,
}: {
  level: SeverityLevel
  onReset: () => void
}) {
  const configs = {
    low: {
      icon: <CheckCircle2 className="h-8 w-8 text-chart-1" />,
      title: "Low Severity",
      description:
        "Your responses suggest you are managing well overall. Continue with self-care practices and check in regularly.",
      recommendation: "Self-care resources and AI chat support",
      color: "border-chart-1/20 bg-chart-1/5",
    },
    moderate: {
      icon: <Info className="h-8 w-8 text-accent" />,
      title: "Moderate Severity",
      description:
        "Your responses indicate some areas of concern. We recommend exploring our wellness resources and considering speaking with a counselor.",
      recommendation: "Wellness resources + counselor consultation recommended",
      color: "border-accent/20 bg-accent/5",
    },
    high: {
      icon: <AlertTriangle className="h-8 w-8 text-destructive" />,
      title: "Elevated Severity",
      description:
        "Your responses suggest you may benefit significantly from professional support. We strongly encourage connecting with a counselor.",
      recommendation: "Professional counselor appointment strongly recommended",
      color: "border-destructive/20 bg-destructive/5",
    },
  }

  const config = configs[level!]

  return (
    <Card className={config.color}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          {config.icon}
          <h3 className="text-lg font-semibold text-foreground">
            {config.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {config.description}
          </p>
          <div className="w-full rounded-lg bg-background/60 p-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Recommended Next Step
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {config.recommendation}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2">
            {level === "high" || level === "moderate" ? (
              <Button className="w-full" asChild>
                <Link href="#counselors">Browse Counselors</Link>
              </Button>
            ) : (
              <Button className="w-full" asChild>
                <Link href="/student/resources">View Resources</Link>
              </Button>
            )}
            <Button variant="outline" className="w-full" onClick={onReset}>
              Retake Assessment
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            This is a screening tool, not a diagnosis. Always consult a
            professional for clinical assessment.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
