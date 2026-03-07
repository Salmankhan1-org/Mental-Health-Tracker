"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, Star, MapPin, Video } from "lucide-react"

const counselors = [
  {
    name: "Dr. Sarah Chen",
    initials: "SC",
    title: "Licensed Clinical Psychologist",
    specializations: ["Anxiety", "Academic Stress", "CBT"],
    rating: 4.9,
    reviews: 128,
    availability: "Available Today",
    location: "Student Health Center, Rm 204",
    virtual: true,
    bio: "Specializing in anxiety disorders and academic performance stress with over 12 years of experience working with university students.",
  },
  {
    name: "Dr. Marcus Rivera",
    initials: "MR",
    title: "Counseling Psychologist",
    specializations: ["Depression", "Identity", "Mindfulness"],
    rating: 4.8,
    reviews: 96,
    availability: "Next Available: Tomorrow",
    location: "Wellness Building, Rm 310",
    virtual: true,
    bio: "Focuses on multicultural counseling and identity exploration. Uses integrative approaches combining mindfulness with traditional therapy.",
  },
  {
    name: "Dr. Emily Park",
    initials: "EP",
    title: "Licensed Professional Counselor",
    specializations: ["Trauma", "PTSD", "Grief"],
    rating: 4.9,
    reviews: 112,
    availability: "Available Today",
    location: "Student Health Center, Rm 207",
    virtual: true,
    bio: "Expert in trauma-informed care with specialized training in EMDR and somatic experiencing for college-aged students.",
  },
  {
    name: "Dr. James Thompson",
    initials: "JT",
    title: "Psychiatrist, MD",
    specializations: ["Medication Management", "ADHD", "Insomnia"],
    rating: 4.7,
    reviews: 84,
    availability: "Next Available: Wednesday",
    location: "Medical Center, Rm 102",
    virtual: false,
    bio: "Board-certified psychiatrist providing medication management and psychiatric evaluations for students with complex mental health needs.",
  },
  {
    name: "Dr. Priya Sharma",
    initials: "PS",
    title: "Licensed Clinical Social Worker",
    specializations: ["Relationships", "Self-Esteem", "Group Therapy"],
    rating: 4.8,
    reviews: 74,
    availability: "Available Today",
    location: "Wellness Building, Rm 315",
    virtual: true,
    bio: "Runs group therapy sessions and individual counseling focused on building social skills and healthy relationship patterns.",
  },
  {
    name: "Dr. Alex Kim",
    initials: "AK",
    title: "Licensed Mental Health Counselor",
    specializations: ["Substance Use", "Peer Pressure", "Motivation"],
    rating: 4.6,
    reviews: 62,
    availability: "Next Available: Thursday",
    location: "Student Health Center, Rm 210",
    virtual: true,
    bio: "Specializes in substance use prevention and motivational interviewing techniques, helping students develop healthier coping strategies.",
  },
]

export function CounselorList() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {counselors.map((counselor) => (
        <CounselorCard key={counselor.name} counselor={counselor} />
      ))}
    </div>
  )
}

function CounselorCard({
  counselor,
}: {
  counselor: (typeof counselors)[number]
}) {
  const [bookingOpen, setBookingOpen] = useState(false)

  return (
    <Card className="flex flex-col transition-all hover:border-primary/30 hover:shadow-md">
      <CardContent className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {counselor.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground">{counselor.name}</h3>
            <p className="text-sm text-muted-foreground">{counselor.title}</p>
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <span className="text-sm font-medium text-foreground">
                {counselor.rating}
              </span>
              <span className="text-xs text-muted-foreground">
                ({counselor.reviews} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {counselor.specializations.map((spec) => (
            <Badge key={spec} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {counselor.bio}
        </p>

        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span
              className={
                counselor.availability.includes("Today")
                  ? "font-medium text-primary"
                  : ""
              }
            >
              {counselor.availability}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{counselor.location}</span>
          </div>
          {counselor.virtual && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Video className="h-3.5 w-3.5" />
              <span>Virtual sessions available</span>
            </div>
          )}
        </div>

        <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4 w-full gap-2">
              <Calendar className="h-4 w-4" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Schedule with {counselor.name}
              </DialogTitle>
              <DialogDescription>
                Choose a time that works for you. All sessions are confidential.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="rounded-lg bg-secondary p-4">
                <p className="mb-2 text-sm font-medium text-foreground">
                  Available Time Slots
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM", "5:30 PM"].map((time) => (
                    <button
                      key={time}
                      className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:border-primary hover:bg-primary/5"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={() => setBookingOpen(false)}>
                Confirm Booking
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                You will receive a confirmation email with session details.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
