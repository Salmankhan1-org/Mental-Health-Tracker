'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { X, Star, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { ApiErrorResponse } from '@/types/types'
import axios from 'axios'
import { toast } from 'sonner'

interface FeedbackFormProps {
  counsellorId: string
  counselorName : string
  onClose: () => void
  fetchReviewStats: ()=>void
  handleFetchAllReviews: ()=>void
  handleFetchCounselorData: ()=>void
}

export function FeedbackForm({ counsellorId,counselorName, onClose, fetchReviewStats, handleFetchAllReviews , handleFetchCounselorData}: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
		setIsSubmitting(true);
        const payload = {
            rating,
            review: feedback
        }
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/counsellors/${counsellorId}/review/new`,payload,{
            withCredentials: true
        });

        if(response.data.success){
            setSubmitted(true)
			handleFetchCounselorData();
            fetchReviewStats();
            handleFetchAllReviews();
            toast.success(response.data.message);
        }
    } catch (error) {
        if (axios.isAxiosError<ApiErrorResponse>(error)) {
            const apiError = error.response?.data
            toast.error(apiError?.error[0].message)
        }
    }finally{
		setIsSubmitting(false);
	}
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-8">
      <Card className="w-full max-w-2xl ">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Share Your Feedback</CardTitle>
            <CardDescription>Help us improve the experience for future students</CardDescription>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>

        <CardContent>
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Star className="h-8 w-8 fill-primary text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Thank You!</h3>
              <p className="text-sm text-muted-foreground">
                Your feedback has been received. We appreciate your insights.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Counselor Info */}
              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-sm font-medium text-muted-foreground">Feedback for</p>
                <p className="text-lg font-semibold text-foreground">{counselorName}</p>
              </div>

              {/* Rating */}
              <div>
                <Label className="mb-3 block text-base font-semibold">How would you rate this counselor?</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= (hoverRating || rating)
                            ? 'fill-accent text-accent'
                            : 'text-border'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </p>
                )}
              </div>

              {/* Feedback Text */}
              <div>
                <Label htmlFor="feedback" className="mb-2 block font-medium">
                  Share your detailed feedback (optional)
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="Tell us about your experience. What went well? Any suggestions for improvement?"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-32"
                />
                <p className="mt-2 text-xs text-muted-foreground">{feedback.length}/500</p>
              </div>


              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
					type="submit"
					disabled={rating === 0 || isSubmitting}
					className="flex-1 gap-2"
					>
					{isSubmitting ? (
						<>
						<Loader2 className="h-4 w-4 animate-spin" />
						Submitting...
						</>
					) : (
						<>
						<Star className="h-4 w-4" />
						Submit Feedback
						</>
					)}
				</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
