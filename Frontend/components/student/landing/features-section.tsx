import {
  Brain,
  MessageCircleHeart,
  TrendingUp,
  Lock,
  Clock,
  HeartHandshake,
} from "lucide-react"

const features = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: "AI Emotion Detection",
    description:
      "Advanced NLP algorithms analyze your text for emotional undertones, identifying stress, anxiety, sadness, and more in real-time.",
  },
  {
    icon: <MessageCircleHeart className="h-6 w-6" />,
    title: "Empathetic Chatbot",
    description:
      "Our AI companion provides compassionate, evidence-based responses drawing from cognitive behavioral therapy and mindfulness practices.",
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Mood Tracking Dashboard",
    description:
      "Visualize your emotional trends over time with intuitive charts and identify patterns that may be affecting your wellbeing.",
  },
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Complete Confidentiality",
    description:
      "Your data is encrypted and never shared. We follow strict privacy protocols to ensure your mental health journey stays private.",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "24/7 Availability",
    description:
      "Whether it's late-night exam stress or early-morning anxiety, MindBridge is always here. No appointments needed.",
  },
  {
    icon: <HeartHandshake className="h-6 w-6" />,
    title: "Counselor Referrals",
    description:
      "When the system detects elevated distress levels, it provides direct connections to qualified campus counselors and crisis resources.",
  },
]

function FeaturesSection() {
  return (
    <section className="bg-secondary/50 px-4 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Platform Features
          </p>
          <h2
            className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Everything you need for your mental wellness
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Built specifically for the unique challenges of higher education,
            combining cutting-edge AI with evidence-based psychological practices.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection;