import { Navbar } from "@/components/common/navbar"
import { Footer } from "@/components/common/footer"
import dynamic from "next/dynamic"

const HeroSection = dynamic(()=>import('@/components/student/landing/hero-section'))
const HowItWorksSection = dynamic(()=>import('@/components/student/landing/how-it-works-section'))
const FeaturesSection = dynamic(()=>import('@/components/student/landing/features-section'))
const CtaSection = dynamic(()=>import('@/components/student/landing/cta-section'))
const UserFeedBackSection = dynamic(()=>import('@/components/student/landing/user-feedback-section'))
const FeedbackMarquee = dynamic(()=>import('@/components/student/landing/user-reviews'))

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
