import { Navbar } from "@/components/common/navbar"
import { HeroSection } from "@/components/student/landing/hero-section"
import { HowItWorksSection } from "@/components/student/landing/how-it-works-section"
import { FeaturesSection } from "@/components/student/landing/features-section"
import { CtaSection } from "@/components/student/landing/cta-section"
import { Footer } from "@/components/common/footer"
import UserFeedBackSection from "@/components/student/landing/user-feedback-section"
import FeedbackMarquee from "@/components/student/landing/user-reviews"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeedbackMarquee/>
        <HowItWorksSection />
        <FeaturesSection />
        <CtaSection />
        <UserFeedBackSection/>
      </main>
      <Footer />
    </div>
  )
}
