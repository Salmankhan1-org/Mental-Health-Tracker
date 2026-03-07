import { MessageSquare, BarChart3, Sparkles, Users } from "lucide-react"

const steps = [
  {
    number: "01",
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Express Yourself",
    description:
      "Chat with our AI companion about your feelings, stressors, or anything on your mind. Our NLP engine understands context and emotion.",
  },
  {
    number: "02",
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Track & Analyze",
    description:
      "Our system monitors emotional patterns through sentiment analysis and behavioral data, detecting early signs of stress or distress.",
  },
  {
    number: "03",
    icon: <Sparkles className="h-6 w-6" />,
    title: "Personalized Guidance",
    description:
      "Receive tailored wellness recommendations, coping mechanisms, and self-care routines based on your unique emotional profile.",
  },
  {
    number: "04",
    icon: <Users className="h-6 w-6" />,
    title: "Professional Connect",
    description:
      "When severity levels indicate the need, seamlessly connect with licensed counselors for professional psychological support.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2
            className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            From conversation to care in four simple steps
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <span className="mb-4 text-4xl font-bold text-primary/15" style={{ fontFamily: 'var(--font-display)' }}>
                {step.number}
              </span>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {step.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
