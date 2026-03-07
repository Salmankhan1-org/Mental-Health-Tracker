"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Feedback } from "@/types/types"



export default function FeedbackMarquee() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])

  const fetchFeedbacks = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_HOST}/feedback/all`,
      { withCredentials: true }
    )

    if (res.data.success) {
      setFeedbacks(res.data.data)
    }
  }

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  return (
    <section className="py-16 overflow-hidden">
      <h2 className="text-center text-3xl font-bold mb-10">
        What Students Say About Us
      </h2>

      <div className="relative w-full overflow-hidden">
        <div className="flex gap-6 animate-marquee">
          {[...feedbacks, ...feedbacks, ...feedbacks, ...feedbacks, ...feedbacks, ...feedbacks].map((item, i) => (
            <Card key={i} className="min-w-75 max-w-[320px]">
              <CardContent className="p-3 flex flex-col items-center gap-4">

                <div className="flex flex-col items-center gap-3">
                  <Avatar>
                    <AvatarImage src={item.user.avatar} />
                    <AvatarFallback>
                      {item.user.name[0]}
                    </AvatarFallback>
                  </Avatar>

                    <p className="text-sm font-semibold">
                      {item.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {item.user.role}
                    </p>
                  </div>
              
                <p className="text-sm text-muted-foreground text-center">
                  "{item.feedback}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}