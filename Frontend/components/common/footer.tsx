import Link from "next/link"
import { Heart } from "lucide-react"

const footerLinks = {
  Platform: [
    { label: "Dashboard", href: "/student/dashboard" },
    { label: "AI Support Chat", href: "/student/chat" },
    { label: "Wellness Resources", href: "/student/resources" },
    { label: "Find Counselors", href: "/student/counselors" },
  ],
  Resources: [
    { label: "Crisis Helplines", href: "/student/resources" },
    { label: "Self-Care Guides", href: "/student/resources" },
    { label: "Coping Strategies", href: "/student/resources" },
    { label: "Student Stories", href: "/student/resources" },
  ],
  Support: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Accessibility", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-5 w-5 text-primary-foreground" />
              </div>
              <span
                className="text-lg font-semibold text-foreground"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                MindBridge
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Supporting student mental health through accessible, AI-powered
              psychological care.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-3 text-sm font-semibold text-foreground">{category}</h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            2026 MindBridge. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with care for student wellbeing.
          </p>
        </div>
      </div>
    </footer>
  )
}
