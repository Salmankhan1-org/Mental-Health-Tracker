
import { LoginForm } from '@/components/accounts/auth/login-form'
import { Heart } from 'lucide-react'

export const metadata = {
  title: 'Login - MindBridge',
  description: 'Sign in to your MindBridge account to continue your wellness journey',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-linear-to-br from-primary/5 to-accent/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-linear-to-tl from-secondary/10 to-primary/5 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo/Branding */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent text-primary-foreground mb-4">
            <Heart className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">MindBridge</h2>
          <p className="text-xs text-muted-foreground mt-1">Mental Health Support for Students</p>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card shadow-lg backdrop-blur-sm px-6 py-8 sm:px-8 sm:py-10">
            <LoginForm />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground max-w-sm">
            In crisis? Call{' '}
            <a
              href="tel:988"
              className="font-medium text-primary hover:text-primary/90 transition-colors underline"
            >
              988
            </a>
            {' '}(Suicide & Crisis Lifeline) or text "HELLO" to 741741
          </p>
        </div>
      </div>
    </div>
  )
}
