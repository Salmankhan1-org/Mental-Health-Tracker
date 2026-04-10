'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import axios, { Axios } from 'axios'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { ToastFunction } from '@/helper/toast-function'

export interface QuestionAnswers{
    question: string
    answer: string
    options: string[]
}


export default function MoodSessionPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const {moodEntryId} =useParams<{moodEntryId:string}>() ;

  const [gettingData, setGettingData] = useState(false);

  const [questions, setQuestions] = useState<QuestionAnswers[]>([]);

  const router = useRouter()

  const handleQuestionsAnswers = async()=>{
    try {
        setGettingData(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/mood/${moodEntryId}/questions`,{
            withCredentials: true
        });

        if(response.data.success){
            console.log(response.data);
            setQuestions(response.data.data);
        }
    } catch (error) {
        ToastFunction('error',error);
    }finally{
        setGettingData(false);
    }
  }

  const handleAnswer = async (option: string) => {
    if (selected) return // prevent double click

    setSelected(option)

    // Smooth delay for UX
    setTimeout(async () => {
      const updatedAnswers = [...answers, option]
      setAnswers(updatedAnswers)
      setSelected(null)

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1)
        return
      }

      // 🔥 Submit final
      try {
        setLoading(true)

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_HOST}/mood/check-in/complete`,
          {
            moodEntryId,
            answers: updatedAnswers
          },
          { withCredentials: true }
        )

        ToastFunction('success',"You're all set 🎯");

        router.push(`/student/dashboard`);

      } catch (error: any) {
        ToastFunction('error',error);
      } finally {
        setLoading(false)
      }
    }, 400) // animation delay
  }

  useEffect(()=>{
    handleQuestionsAnswers();
  },[moodEntryId]);

    if (gettingData || questions.length === 0) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading Questions...</span>
            </div>
        )
    }

    const currentQuestion = questions[currentIndex]
    const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">

      <div className="w-full max-w-xl space-y-6">

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-xs text-muted-foreground text-center">
            Step {currentIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Animated Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="rounded-2xl border bg-card p-6 shadow-sm space-y-6"
          >
            <h2 className="text-xl font-semibold text-foreground">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="grid gap-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selected === option

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={loading}
                    className={`
                      w-full rounded-xl border px-4 py-3 text-left text-sm transition-all
                      ${isSelected
                        ? "bg-primary text-primary-foreground border-primary scale-[0.98]"
                        : "bg-background hover:border-primary hover:bg-primary/5"
                      }
                      disabled:opacity-50
                    `}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <p className="text-sm text-muted-foreground">
              Analyzing your responses...
            </p>
          </div>
        )}

      </div>
    </div>
  )
}