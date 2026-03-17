"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Brain, MessageCircleHeart } from "lucide-react"

function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 lg:px-8 lg:pb-32 lg:pt-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-150 w-150 -translate-x-1/2 -translate-y-1/3 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-100 w-100 translate-x-1/4 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            Confidential & Secure
          </div>

          <h1
            className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your Mental Health Companion for{" "}
            <span className="text-primary">Campus Life</span>
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            An intelligent, confidential platform that helps students manage emotional
            distress, track their wellbeing, and connect with professional support
            — all in one place.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" asChild>
              <Link href="/student/dashboard">
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2 px-8" asChild>
              <Link href="/student/chat">Talk to AI Companion</Link>
            </Button>

            <Button size={'lg'} className="gap-2 px-8" asChild>
              <Link href={'/student/apply-to-become-counsellor'}>Become Counsellor</Link>
            </Button>
          </div>

          {/* Feature pills */}
          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
            <FeaturePill
              icon={<Brain className="h-5 w-5 text-primary" />}
              title="AI Emotion Tracking"
              description="Real-time sentiment analysis to understand your emotional patterns"
            />
            <FeaturePill
              icon={<MessageCircleHeart className="h-5 w-5 text-primary" />}
              title="NLP-Powered Chat"
              description="Empathetic AI companion available 24/7 for confidential support"
            />
            <FeaturePill
              icon={<Shield className="h-5 w-5 text-primary" />}
              title="Professional Support"
              description="Connect with licensed counselors when you need expert guidance"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturePill({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-card-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}



export default HeroSection;
