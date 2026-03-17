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

interface Payload{
    name: string,
    email : string,
    password: string,
    picture: string
}

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [picture, setPicture] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
        const payload : Payload = {
            email,password,name,picture
        }
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/users/login`,payload,{
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        })

        if(response?.data?.success){
            router.push('/dashboard');
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
            <label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name
            </label>
            <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
            />
        </div>
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

        <div className="space-y-2">
        <label htmlFor="picture" className="text-sm font-medium text-foreground">
            Profile Picture
        </label>

        <Input
            id="picture"
            type="file"
            accept="image/*"
            disabled={isLoading}
            onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return

            const reader = new FileReader()

            reader.onloadend = () => {
                setPicture(reader.result as string)
            }

            reader.readAsDataURL(file)
            }}
        />
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
              Signing up...
            </>
          ) : (
            'Sign up'
          )}
        </Button>
      </form>
      


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
