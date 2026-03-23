'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ConfirmCompletionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const token = searchParams.get('token')

  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'success' | 'error' | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const confirmCompletion = async () => {
      if (!token) {
        setStatus('error')
        setMessage('Invalid or missing token')
        setLoading(false)
        return
      }

      try {
        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_API_HOST}/appointment/complete/confirm?token=${token}`,
          {  },
          {withCredentials: true}
        )

        if (res.data.success) {
          setStatus('success')
          setMessage('Your session has been successfully confirmed 🎉')
        } else {
          throw new Error()
        }
      } catch (error: any) {
        setStatus('error')
        setMessage(
          error?.response?.data?.error?.[0]?.message ||
          'Something went wrong. Please try again later.'
        )
      } finally {
        setLoading(false)
      }
    }

    confirmCompletion()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      
      <div className="max-w-md w-full bg-background border rounded-2xl shadow-lg p-8 text-center space-y-6">

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Confirming your session...
            </p>
          </div>
        )}

        {/* Success */}
        {!loading && status === 'success' && (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            <h2 className="text-lg font-semibold">
              Session Confirmed
            </h2>
            <p className="text-sm text-muted-foreground">
              {message}
            </p>

            <Button
              className="mt-4"
              onClick={() => router.push('/student/dashboard')}
            >
              Go to Dashboard
            </Button>
          </div>
        )}

        {/* Error */}
        {!loading && status === 'error' && (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="w-12 h-12 text-red-500" />
            <h2 className="text-lg font-semibold">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground">
              {message}
            </p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push('/student')}
            >
              Go Home
            </Button>
          </div>
        )}

      </div>
    </div>
  )
}