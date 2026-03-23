'use client'

import { useEffect, useState } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { MapPin, Video, Phone, Calendar, Clock, Award } from 'lucide-react'
import { FeedbackForm } from '@/components/student/counselors/feedback-form'
import { ReviewsSection } from '@/components/student/counselors/review-section'
import { RatingsOverview } from '@/components/student/counselors/rating-overview'
import { Counsellor, CounsellorReview, CounsellorReviewStats } from '@/types/types'
import axios from 'axios'
import { useParams } from 'next/navigation'
import PageLoader from '@/components/common/page-loader'
import BookAppointmentDialog from '@/components/student/counselors/book-appointment'

// Mock counselor data
const counselorData = {
  id: 1,
  name: 'Dr. Sarah Chen',
  initials: 'SC',
  title: 'Licensed Clinical Psychologist',
  specializations: ['Anxiety', 'Academic Stress', 'CBT'],
  rating: 4.9,
  reviews: 128,
  availability: 'Available Today',
  location: 'Student Health Center, Rm 204',
  virtual: true,
  bio: 'Specializing in anxiety disorders and academic performance stress with over 12 years of experience working with university students. I use evidence-based approaches including Cognitive Behavioral Therapy to help students manage stress, build resilience, and achieve their academic and personal goals.',
  experience: '12+ years',
  responseTime: 'Usually responds within 2 hours',
  sessionFee: '$80 per session',
  consultationModes: ['Google Meet', 'Phone', 'In-person'],
  credentials: [
    'PhD in Clinical Psychology - Stanford University',
    'Licensed Clinical Psychologist (CA License #12345)',
    'Certified CBT Practitioner',
  ],
}

export default function CounselorDetailsPage() {
	const [showFeedback, setShowFeedback] = useState(false)
	const [data, setData] = useState<Counsellor | null>(null);
	const {id} =useParams<{id:string}>() ;
	const [reviewStats, setReviewStats] = useState<CounsellorReviewStats | null>(null);
	const [loading , setLoading] = useState(false);
	const [reviews, setReviews] = useState<CounsellorReview[]>([]);
	const [openAppointmentDialog, setOpenAppointmentDialog] = useState<boolean>(false);
	
	const handleFetchAllReviews = async()=>{
		try {
			const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/counsellors/${id}/reviews/all`,{
				withCredentials: true
			});
			if(response.data.success){
				setReviews(response.data.data);
			}
		} catch (error) {
			console.log(error);
		}
	}

	const fetchReviewStats = async()=>{
		try {
		const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/counsellors/${id}/reviews/stats`,{
			withCredentials: true
		});

		if(response.data.success){
			setReviewStats(response.data.data);
		}
		} catch (error) {
		console.log(error);
		}
	}

	const handleFetchCounselorData = async()=>{
		try {
			const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/counsellors/${id}`,{
				withCredentials: true
			});

			if(response.data.success){
				setData(response.data.data);
			}
		} catch (error) {
			console.log(error);
		}
	}


  	useEffect(() => {
		const fetchData = async () => {
			try {
			setLoading(true);

			await Promise.all([
				handleFetchCounselorData(),
				fetchReviewStats(),
				handleFetchAllReviews(),
			]);

			} catch (error) {
			console.error(error);
			} finally {
			setLoading(false);
			}
		};

		fetchData();
	}, []);

	if(loading) return <PageLoader/>

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="bg-linear-to-b from-secondary to-background">
          <div className="mx-auto max-w-4xl px-4 py-8 md:py-12 md:px-6">
            {/* Counselor Header */}
            <div className="mb-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex gap-6">
                  <Avatar className="h-24 w-24 border-2 border-primary/20">
                    {data?.user?.profileImage ? (
                      <img
                        src={data?.user.profileImage}
                        alt={data?.user.name[0]}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                      {data?.user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="mb-2 text-3xl font-bold text-foreground">{data?.user.name}</h1>
                    <p className="mb-3 text-lg text-muted-foreground">{data?.title}</p>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {data?.expertiseTags.map((spec) => (
                        <Badge key={spec} variant="secondary" className="bg-primary/10 text-primary">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(Number(data?.rating.average)) ? 'fill-accent text-accent' : 'fill-muted text-muted'}`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                      <span className="font-semibold text-foreground">{data?.rating.average}</span>
                      <span className="text-sm text-muted-foreground">({data?.rating.count} reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={()=>setOpenAppointmentDialog(true)} className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Book Session
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => setShowFeedback(true)}
                  >
                    Give Feedback
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Left Column - Details */}
              <div className="md:col-span-2 space-y-6">
                {/* About Section */}
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-foreground leading-relaxed">{data?.bio}</p>
                    <div className="space-y-3 border-t border-border pt-4">
                      <div className="flex gap-4">
                        <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Response Time</p>
                          <p className="text-sm text-muted-foreground">{counselorData.responseTime}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-foreground">Experience</p>
                          <p className="text-sm text-muted-foreground">{data?.yearsOfExperience} Years</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Ratings & Reviews */}
                <RatingsOverview reviewStats={reviewStats} />
                <ReviewsSection reviews={reviews} />
              </div>

              {/* Right Column - Quick Info */}
              <div className="space-y-6">
                {/* Contact Card */}
                <Card className="border-border/50 sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Consultation Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Session Fee</p>
                      <p className="text-lg font-bold text-primary">{data?.sessionFee} $</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Consultation Modes</p>
                      <div className="space-y-2">
                        {data?.consultationModes.map((mode:string) => (
                          <div key={mode} className="flex items-center gap-2 text-sm">
                            {mode === 'google-meet' && <Video className="h-4 w-4 text-primary" />}
                            {mode === 'phone' && <Phone className="h-4 w-4 text-primary" />}
                            {mode === 'in-person' && <MapPin className="h-4 w-4 text-primary" />}
                            <span className="text-foreground capitalize">{mode}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Location</p>
                      <p className="text-sm text-foreground">{data?.location}</p>
                    </div>
                    <div className="border-t border-border pt-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Availability</p>
                      <Badge variant="outline" className="border-primary/50 text-primary">
                        {counselorData.availability}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>

	   <BookAppointmentDialog 
			counsellorId={data?.user?._id!}
			counsellorName={data?.user?.name!}
			open={openAppointmentDialog}
			onOpenChange={setOpenAppointmentDialog}
		 />


      {/* Feedback Modal */}
      {showFeedback && 
	  		<FeedbackForm 
	  			counsellorId={'69b11bb36b1e9a1a7c66d30e'} 
				counselorName={counselorData.name} 
				onClose={() => setShowFeedback(false)} 
				fetchReviewStats={fetchReviewStats}
				handleFetchAllReviews={handleFetchAllReviews}
				handleFetchCounselorData={handleFetchCounselorData}
				/>}
    </div>
  )
}
