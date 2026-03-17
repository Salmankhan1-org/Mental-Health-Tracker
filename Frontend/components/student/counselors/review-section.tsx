'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ThumbsUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { CounsellorReview } from '@/types/types'
import {FormatDateDistance} from '@/helper/formatDateDistance';
import { formatDistanceToNow } from 'date-fns'

interface Review {
  id: number
  author: string
  initials: string
  rating: number
  date: string
  title: string
  text: string
  helpful: number
}

const mockReviews: Review[] = [
  {
    id: 1,
    author: 'Alex Johnson',
    initials: 'AJ',
    rating: 5,
    date: '2 weeks ago',
    title: 'Incredibly helpful and compassionate',
    text: 'Dr. Chen helped me work through my anxiety about finals in just a few sessions. Her CBT techniques are practical and easy to apply. Highly recommend!',
    helpful: 45,
  },
  {
    id: 2,
    author: 'Jordan Martinez',
    initials: 'JM',
    rating: 5,
    date: '1 month ago',
    title: 'Life-changing therapy',
    text: 'I came in feeling overwhelmed and lost. Dr. Chen provided a safe space to explore my feelings and gave me concrete tools to manage stress. I feel so much better now.',
    helpful: 32,
  },
  {
    id: 3,
    author: 'Casey Lee',
    initials: 'CL',
    rating: 4,
    date: '1 month ago',
    title: 'Very professional and knowledgeable',
    text: 'Great experience overall. Dr. Chen is very knowledgeable about academic stress. Only minor thing is scheduling could be a bit more flexible.',
    helpful: 18,
  },
  {
    id: 4,
    author: 'Morgan Williams',
    initials: 'MW',
    rating: 5,
    date: '2 months ago',
    title: 'Exactly what I needed',
    text: 'As a first-generation student, I struggled with imposter syndrome. Dr. Chen understood my unique challenges and helped me build confidence. Thank you!',
    helpful: 52,
  },
]

interface ReviewsSectionProps {
  reviews: CounsellorReview[]
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-accent text-accent' : 'fill-muted text-muted'}`}
        viewBox="0 0 20 20"
      >
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    ))
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Student Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-border pb-4 last:border-0 last:pb-0">
            {/* Review Header */}
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {review.user.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{review.user.name}</p>
                    <span className="text-xs text-muted-foreground">{formatDistanceToNow(review.createdAt,{addSuffix:true})}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex gap-0.5">{renderStars(review.rating)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="ml-13 space-y-2">
              <p className="text-sm text-foreground leading-relaxed">{review.comment}</p>

             
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
