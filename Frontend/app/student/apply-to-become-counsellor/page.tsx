import { ApplyCounsellorForm } from '@/components/student/counselors/apply-for-counsellor-form'
import { Heart } from 'lucide-react'
import React from 'react'

const ApplyForCounsellor = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-linear-to-br from-primary/5 to-accent/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-linear-to-tl from-secondary/10 to-primary/5 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center  min-h-screen px-4 py-6">
        {/* Logo/Branding */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent text-primary-foreground mb-4">
            <Heart className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">MindBridge</h2>
          <p className="text-xs text-muted-foreground mt-1">Mental Health Support for Students</p>
        </div>

        <ApplyCounsellorForm/>
        </div>
    </div>
  )
}

export default ApplyForCounsellor