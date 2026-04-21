import { Navbar } from "@/components/common/navbar"
import { Footer } from "@/components/common/footer"
import { Phone, Shield, Clock } from "lucide-react"
import dynamic from "next/dynamic"

export const metadata = {
  title: "Find Counselors - MindBridge",
  description:
    "Connect with licensed campus counselors and access professional mental health support.",
}

const CounselorList = dynamic(()=>import('@/components/student/counselors/counselor-list'));
const SeverityAssessment = dynamic(()=>import("@/components/student/counselors/severity-assessment"));

export default function CounselorsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-10">
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">
              Professional Support
            </p>
            <h1
              className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Connect with Campus Counselors
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Our licensed professionals are here to support you. All sessions are
              confidential, and many are covered by student health plans.
            </p>
          </div>

          {/* Trust badges */}
          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  100% Confidential
                </p>
                <p className="text-xs text-muted-foreground">
                  HIPAA compliant & encrypted
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Same-Day Availability
                </p>
                <p className="text-xs text-muted-foreground">
                  Emergency slots always open
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  In-Person & Virtual
                </p>
                <p className="text-xs text-muted-foreground">
                  Choose what works for you
                </p>
              </div>
            </div>
          </div>

          {/* Main content */}
        
          <div  id="counselors">
            <h2 className="mb-4 text-xl font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              Available Counselors
            </h2>
            <CounselorList />
          </div>

            {/* <div className="flex flex-col gap-6">
              <SeverityAssessment />

             
              <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
                <h3 className="mb-2 text-lg font-semibold">
                  Crisis Support
                </h3>
                <p className="mb-4 text-sm text-primary-foreground/80">
                  If you are experiencing a mental health emergency, please reach
                  out immediately:
                </p>
                <div className="flex flex-col gap-3">
                  <div className="rounded-lg bg-primary-foreground/10 px-4 py-2.5">
                    <p className="text-xs text-primary-foreground/70">
                      Suicide & Crisis Lifeline
                    </p>
                    <p className="text-lg font-bold">988</p>
                  </div>
                  <div className="rounded-lg bg-primary-foreground/10 px-4 py-2.5">
                    <p className="text-xs text-primary-foreground/70">
                      Campus Emergency
                    </p>
                    <p className="text-lg font-bold">911</p>
                  </div>
                  <div className="rounded-lg bg-primary-foreground/10 px-4 py-2.5">
                    <p className="text-xs text-primary-foreground/70">
                      Crisis Text Line
                    </p>
                    <p className="text-lg font-bold">
                      Text HOME to 741741
                    </p>
                  </div>
                </div>
              </div>
            </div> */}
     
        </div>
      </main>
      <Footer />
    </div>
  )
}
