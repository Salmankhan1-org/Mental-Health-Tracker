import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Moon,
  Dumbbell,
  Users,
  Coffee,
  Pencil,
  Music,
  Leaf,
} from "lucide-react"

const resources = [
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: "Mindfulness Meditation",
    category: "Stress Relief",
    description:
      "Learn guided meditation techniques specifically designed for academic stress. Start with just 5 minutes a day.",
    tips: [
      "Find a quiet spot on campus",
      "Focus on your breathing rhythm",
      "Let thoughts pass without judgment",
    ],
  },
  {
    icon: <Moon className="h-5 w-5" />,
    title: "Sleep Hygiene Guide",
    category: "Rest & Recovery",
    description:
      "Improve your sleep quality with evidence-based strategies tailored for the student lifestyle and schedule.",
    tips: [
      "Maintain a consistent sleep schedule",
      "Avoid screens 1 hour before bed",
      "Create a relaxing bedtime routine",
    ],
  },
  {
    icon: <Dumbbell className="h-5 w-5" />,
    title: "Exercise for Wellbeing",
    category: "Physical Health",
    description:
      "Discover how even 20 minutes of physical activity can significantly boost your mood and reduce anxiety.",
    tips: [
      "Start with a 10-minute walk between classes",
      "Join a campus recreation group",
      "Try yoga for combined physical and mental benefits",
    ],
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Building Social Connections",
    category: "Social Wellness",
    description:
      "Combat loneliness and build meaningful relationships during your college years with practical strategies.",
    tips: [
      "Join a club aligned with your interests",
      "Schedule regular study group sessions",
      "Practice active listening in conversations",
    ],
  },
  {
    icon: <Coffee className="h-5 w-5" />,
    title: "Managing Academic Pressure",
    category: "Academic Wellness",
    description:
      "Effective strategies for handling exam stress, deadlines, and the pressure to perform academically.",
    tips: [
      "Break large tasks into smaller chunks",
      "Use the Pomodoro technique for studying",
      "Set realistic expectations for yourself",
    ],
  },
  {
    icon: <Pencil className="h-5 w-5" />,
    title: "Journaling for Clarity",
    category: "Self-Reflection",
    description:
      "Explore therapeutic journaling techniques that help process emotions and gain insights into your mental patterns.",
    tips: [
      "Write for 10 minutes each morning",
      "Use prompts when you feel stuck",
      "Track gratitude to shift perspective",
    ],
  },
  {
    icon: <Music className="h-5 w-5" />,
    title: "Sound & Music Therapy",
    category: "Relaxation",
    description:
      "Harness the power of sound frequencies and calming music to reduce anxiety and improve focus during study sessions.",
    tips: [
      "Try binaural beats for concentration",
      "Create a calming playlist for stress",
      "Use nature sounds for background ambiance",
    ],
  },
  {
    icon: <Leaf className="h-5 w-5" />,
    title: "Nature & Grounding",
    category: "Mindfulness",
    description:
      "Learn grounding techniques and discover how connecting with nature on campus can significantly improve your mental state.",
    tips: [
      "Practice the 5-4-3-2-1 grounding technique",
      "Spend 15 minutes outdoors between classes",
      "Visit green spaces on campus regularly",
    ],
  },
]

export function ResourceCards() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {resources.map((resource) => (
        <Card
          key={resource.title}
          className="transition-all hover:border-primary/30 hover:shadow-md"
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {resource.icon}
              </div>
              <Badge variant="secondary" className="text-xs">
                {resource.category}
              </Badge>
            </div>
            <CardTitle className="text-lg">{resource.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {resource.description}
            </p>
            <div className="rounded-lg bg-secondary/50 p-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Quick Tips
              </p>
              <ul className="flex flex-col gap-1.5">
                {resource.tips.map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
