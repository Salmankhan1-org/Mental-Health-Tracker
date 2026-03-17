import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Phone } from "lucide-react"

function CtaSection() {
  return (
    <section className="px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center lg:px-16 lg:py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/5 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary-foreground/5 blur-3xl" />
          </div>

          <div className="relative">
            <h2
              className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-primary-foreground lg:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Your wellbeing matters. Start your journey today.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-primary-foreground/80">
              Join thousands of students who are taking proactive steps toward better
              mental health. It takes less than a minute to get started.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 px-8"
                asChild
              >
                <Link href="/dashboard">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="gap-2 border-primary-foreground/20 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link href="/counselors">
                  <Phone className="h-4 w-4" />
                  Talk to a Counselor
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Emergency banner */}
        <div className="mt-8 rounded-xl border border-wellness-alert/20 bg-wellness-alert/5 p-4 text-center">
          <p className="text-sm text-foreground">
            <strong>In Crisis?</strong> If you or someone you know is in immediate
            danger, please call your local emergency number or the{" "}
            <strong>988 Suicide & Crisis Lifeline</strong> (call or text 988).
          </p>
        </div>
      </div>
    </section>
  )
}


export default CtaSection;