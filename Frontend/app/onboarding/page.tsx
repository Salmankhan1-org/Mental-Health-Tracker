"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { ToastFunction } from "@/helper/toast-function"
import { useRouter } from "next/navigation"

const steps = [
  {
    id: "goal",
    question: "What do you need help with?",
    options: [
      { label: "Stress", icon: "😣" },
      { label: "Anxiety", icon: "😰" },
      { label: "Focus", icon: "🎯" },
      { label: "Sleep", icon: "😴" },
      { label: "Emotional Support", icon: "💙" }
    ]
  },
  {
    id: "feeling",
    question: "How are you feeling lately?",
    options: [
      { label: "Calm", icon: "😌" },
      { label: "Stressed", icon: "😓" },
      { label: "Overwhelmed", icon: "😵" },
      { label: "Anxious", icon: "😟" }
    ]
  },
  {
    id: "habits",
    question: "Which habits describe you?",
    options: [
      { label: "Exercise", icon: "🏃" },
      { label: "Late nights", icon: "🌙" },
      { label: "High screen time", icon: "📱" },
      { label: "Busy schedule", icon: "📅" }
    ]
  },
  {
    id: "tone",
    question: "How should AI talk to you?",
    options: [
      { label: "Friendly", icon: "😊" },
      { label: "Professional", icon: "🧠" },
      { label: "Motivational", icon: "🔥" },
      { label: "Calm", icon: "🌿" }
    ]
  },
  {
    id: "support",
    question: "What kind of support do you prefer?",
    options: [
      { label: "Quick tips", icon: "⚡" },
      { label: "Deep chats", icon: "💬" },
      { label: "Structured plans", icon: "📝" }
    ]
  }
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("onboarding")
    if (saved) setAnswers(JSON.parse(saved))
  }, [])

  const handleSelect = async (option: string) => {
    const updated = { ...answers, [steps[step].id]: option }
    setAnswers(updated)
    localStorage.setItem("onboarding", JSON.stringify(updated))

    if (step < steps.length - 1) {
      setTimeout(() => setStep(step + 1), 250)
    } else {
        try {
            const payload = {
                goal: answers.goal,
                feeling: answers.feeling,
                habits: [answers.habits], 
                aiTone: answers.tone,
                supportType: answers.support
            }

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/users/onboarding/save`,payload,{
                withCredentials: true
            });

            if(response.data.success){
                ToastFunction('success', response.data.message);
                router.push('/student/dashboard');

            }
        } catch (err) {
            ToastFunction('error', err);
        } finally {
            setLoading(false)
        }
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const progress = ((step + 1) / steps.length) * 100

  return (
    <div className="h-fit flex items-center justify-center bg-linear-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-2">
      <Card className="w-full max-w-xl rounded-2xl shadow-xl">
        <CardContent className="p-4 space-y-6">

          {/* Progress */}
          <div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-right">
              Step {step + 1} of {steps.length}
            </p>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-center mb-6">
                {steps[step].question}
              </h2>

              <div className="grid gap-3">
                {steps[step].options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSelect(opt.label)}
                    className={`w-full flex items-center justify-center gap-3 border rounded-xl px-4 py-4 text-base font-medium transition
                    hover:border-primary hover:bg-primary/5 hover:shadow-md
                    ${answers[steps[step].id] === opt.label ? "border-primary bg-primary/10 shadow" : "bg-white"}`}
                  >
                    <span className="text-lg">{opt.icon}</span>
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
              Back
            </Button>

            {step === steps.length - 1 && (
              <Button disabled={loading}>
                {loading ? "Saving..." : "Finish"}
              </Button>
            )}
          </div>

          {/* Skip */}
          {/* <div className="text-center">
            <button
              onClick={() => setStep(steps.length - 1)}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Skip for now →
            </button>
          </div> */}

        </CardContent>
      </Card>
    </div>
  )
}
