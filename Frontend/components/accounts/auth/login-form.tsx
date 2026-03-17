'use client'

import { useState } from 'react'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import GoogleLogin from './google-login'
import { toast } from 'sonner'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ApiErrorResponse } from '@/types/types'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import { setUser } from '@/features/users/authSlice'

interface Payload{
    email : string,
    password: string
}

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
        const payload : Payload = {
            email,password
        }
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/users/login`,payload,{
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        })

        if(response?.data?.success){
            const userData = response.data.data;
            dispatch(setUser(userData))
            if (userData.role === "student") {
              router.push("/student/dashboard")
            } else if (userData.role === "counsellor") {
              router.push("/counsellor/dashboard")
            } else if (userData.role === "admin") {
              router.push("/admin/dashboard")
            }
            toast.success(response?.data?.message);
        }
    }catch(error : unknown){
        
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiError = error.response?.data
            setError(apiError?.error[0]?.message || "Error occured during login");

            console.log(apiError?.statusCode)
            console.log(apiError?.error[0].message)
        }
    }finally{
        setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Your mental health matters. Let's continue your wellness journey.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Email/Password Form */}
      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="pl-10 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-input bg-background accent-primary"
              disabled={isLoading}
            />
            <span className="text-sm text-muted-foreground">Remember me</span>
          </label>
          {/* <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:text-primary/90 transition-colors"
          >
            Forgot password?
          </Link> */}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs ">
          <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Google Login */}
      <GoogleLogin/>

      {/* Confidentiality Notice */}
      <div className="rounded-lg border border-border/50 bg-card/50 px-4 py-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="block font-medium text-foreground mb-1">Your privacy matters.</span>
          All conversations and data are encrypted and confidential. We never share your information.
        </p>
      </div>
    </div>
  )
}
