import { Navbar } from "@/components/common/navbar"
import { Footer } from "@/components/common/footer"
import { BreathingExercise } from "@/components/student/resources/breathing-exercise"
import { ResourceCards } from "@/components/student/resources/resource-cards"
import { Phone } from "lucide-react"
import DailyWellnessTip from "@/components/student/resources/daily-wellness-tip"

export const metadata = {
  title: "Wellness Resources - MindBridge",
  description:
    "Evidence-based self-care guides, coping strategies, and wellness tools for students.",
}

export default function ResourcesPage() {
  


  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              Wellness Resources
            </p>
            <h1
              className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Tools & Guides for Your Wellbeing
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Explore evidence-based techniques and practical strategies designed
              to help students thrive mentally and emotionally.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              <ResourceCards />
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              <BreathingExercise />

              {/* Crisis card */}
              <div className="rounded-2xl border border-wellness-alert/20 bg-wellness-alert/5 p-6">
                <div className="mb-3 flex items-center gap-2 text-foreground">
                  <Phone className="h-5 w-5 text-wellness-alert" />
                  <h3 className="font-semibold">Need Immediate Help?</h3>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  If you or someone you know is in crisis, these resources are
                  available 24/7:
                </p>
                <ul className="flex flex-col gap-2">
                  <li className="text-sm text-foreground">
                    <strong>988 Suicide & Crisis Lifeline:</strong>{" "}
                    <span className="text-primary">Call or text 988</span>
                  </li>
                  <li className="text-sm text-foreground">
                    <strong>Crisis Text Line:</strong>{" "}
                    <span className="text-primary">Text HOME to 741741</span>
                  </li>
                  <li className="text-sm text-foreground">
                    <strong>Campus Security:</strong>{" "}
                    <span className="text-primary">911</span>
                  </li>
                </ul>
              </div>

              {/* Daily tip */}
              <DailyWellnessTip />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
