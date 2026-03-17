import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  MessageCircleHeart,
  BookOpen,
  Users,
  Phone,
  Wind,
  Headphones,
} from "lucide-react"

const actions = [
  {
    icon: <MessageCircleHeart className="h-5 w-5" />,
    label: "Talk to AI",
    href: "/student/chat",
    description: "Chat support",
  },
  {
    icon: <Wind className="h-5 w-5" />,
    label: "Breathe",
    href: "/student/resources",
    description: "Breathing exercise",
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    label: "Resources",
    href: "/student/resources",
    description: "Self-care guides",
  },
  {
    icon: <Users className="h-5 w-5" />,
    label: "Counselors",
    href: "/student/counselors",
    description: "Find support",
  },
  {
    icon: <Headphones className="h-5 w-5" />,
    label: "Calm Audio",
    href: "/student/resources",
    description: "Relax & unwind",
  },
  {
    icon: <Phone className="h-5 w-5" />,
    label: "Crisis Line",
    href: "/student/counselors",
    description: "Immediate help",
  },
]

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-4 text-center transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {action.icon}
              </div>
              <span className="text-sm font-medium text-foreground">
                {action.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {action.description}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
