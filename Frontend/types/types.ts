export interface ApiFieldError {
  field: string
  message: string
}

export interface ApiErrorResponse {
  statusCode: number
  success: boolean
  error: ApiFieldError[]
  message: string
}

export interface ApiSuccessResponse {
    statusCode : number,
    success: boolean,
    error: [],
    message: string,
    data: []
}

export interface SentimentData {
  name: string,
  value: number,
  color: string
}


export type ActivityStatus = "success" | "failed" 

export interface RecentActivity {
  _id: string
  email: string
  relation: string
  ipAddress: string
  status: ActivityStatus
  message: string
  createdAt: string
  updatedAt: string
}


export interface Appointment {
  id: number
  studentName: string
  date: string
  time: string
  duration: string
  mode: 'Google Meet' | 'Phone' | 'In-person'
  topic: string
  status: 'upcoming' | 'pending' | 'completed' | 'cancelled'
}


export interface Feedback {
  feedback: string
  rate: number
  user: {
    name: string
    role: string
    avatar: string
  }
}

export interface Counsellor {
  _id: string
  title: string
  bio: string
  location: string
  virtualSessions: boolean
  expertiseTags: string[]
  rating: {
    average: number
    count: number
  }
  user: {
    _id: string,
    name: string
    profileImage?: string
  },
  yearsOfExperience: number
}


export interface CounsellorReview{
  _id: string
   user: {
    _id: string
    name: string
    profileImage?: string
  },
  comment: string,
  rating: number,
  createdAt: string
}

export interface ReviewDistribution{
  rating : number,
  count : number,
  percentage : number
}


export interface CounsellorReviewStats{
  averageRating : number,
  totalReviews : number,
  distribution: ReviewDistribution[]
}