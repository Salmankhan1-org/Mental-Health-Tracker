"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ApiErrorResponse } from '@/types/types'
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'sonner'

const UserFeedBackSection = () => {

    const [loading, setLoading] = useState(false)
    const [rating, setRating] = useState<number | null>(null)
    const [feedback, setFeedback] = useState("")

    const handleSubmit = async () => {
        if (!rating || !feedback) return

        try {
            setLoading(true)

            const payload = {
                rating,
                feedback
            }

            const response =  await axios.post(`${process.env.NEXT_PUBLIC_API_HOST}/feedback/new`, payload,{
                headers: {'Content-Type':'application/json'},
                withCredentials: true
            });

            if(response.data.success){
                setRating(null);
                setFeedback('');
                toast.success(response.data.message);
            }

        } catch (error: any) {
           if (axios.isAxiosError<ApiErrorResponse>(error)) {
                const apiError = error.response?.data
                toast.error(apiError?.error[0].message)
            }
        } finally {
            setLoading(false)
        }
    }

    const handleResetInfo = ()=>{
        setRating(null);
        setFeedback('');
    }

    return (
        <section className="px-4 py-12 lg:px-8 lg:py-18"> 
            <div className="mx-auto max-w-7xl">

                <div className="mb-16 text-center">
                    <h2
                        className="mx-auto max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground lg:text-4xl"
                        style={{ fontFamily: 'var(--font-display)' }}
                    >
                        Tell Us About Your Experience With Us
                    </h2>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            What you think about our platform
                        </CardTitle>
                    </CardHeader>

                    <CardContent className='flex flex-col space-y-6'>

                        {/*  Rating Section */}
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-muted-foreground">
                                Rate your experience
                            </p>

                            <div className="flex gap-2">
                                {[1,2,3,4,5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`text-3xl transition ${
                                            rating && star <= rating
                                                ? "text-yellow-500"
                                                : "text-gray-300"
                                        }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Textarea
                            placeholder="Tell us about your experience so far with us?"
                            className="resize-none text-sm"
                            rows={3}
                            value={feedback}
                            onChange={(e)=>setFeedback(e.target.value)}
                        />

                        <div className='w-full flex justify-end gap-2'>
                            <Button
                            onClick={handleSubmit}
                            disabled={!rating || !feedback || loading}
                            // className="w-[40%]"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        />
                                    </svg>
                                    Submitting...
                                </div>
                            ) : (
                                "Submit"
                            )}
                        </Button>
                        <Button 
                        onClick={handleResetInfo}
                        // className='w-[40%]'
                        >Reset</Button>
                        </div>

                    </CardContent>
                </Card>

            </div>
        </section>
    )
}

export default UserFeedBackSection