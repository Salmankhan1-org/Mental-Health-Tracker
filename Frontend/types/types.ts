import { ReportSeverity, ReportStatus, UserRole, UserStatus } from "@/lib/admin-types"

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
  yearsOfExperience: number,
  sessionFee: number,
  consultationModes:string[]
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

export type AppointmentStatus = 'pending' | 'scheduled' | 'cancelled' | 'completed' | 'completed_by_counsellor';

export type MeetingMethod =  'google-meet' | 'phone' | 'in-person';

export interface IAppointment {
  _id: string;
  counsellor: string; // ObjectId as string
  student: {
    _id: string
    name: string
    email: string
  };     // ObjectId as string
  date: string | Date; // ISO Date string from MongoDB
  startTime: string;   // e.g., "10:00"
  endTime: string;     // e.g., "11:00"
  slotId: string;
  status: AppointmentStatus;
  meetingMethod: MeetingMethod;
  meetingDetails: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AppointmentsResponse {
  statusCode: number
  success: boolean;
  data: {
    appointments: IAppointment[];
    pagination: PaginationData;
  };
  error:[]
}


export interface DashboardAnalytics{
  totalSessionsThisWeek: number
  upcomingSessions: number
  cancelledSession : number
  completionRate: string
}

export type CounsellorStatus = 'active' | 'inactive' | 'on_leave'
export type CounsellorRequestStatus = 'pending' | 'approved' | 'rejected'

export interface AdminUsers{
  _id:string
  name: string
  email: string
  profileImage: string
  sessionsAttained: number
  status:UserStatus
  role: UserRole
  createdAt: string | Date
}



export interface AdminCounsellors{
  _id: string
  title: string,
  expertiseTags:string[] ,
  status: CounsellorRequestStatus,
  averageRating: number,
  totalReviews: number,
  completedSessions: number,
  yearsOfExperience: number,
  name: string,
  email: string,
  userId: string,
  profileImage:string,
  licenseNumber: string
  location: string
  bio:string
}

export interface StudentDetails{
  _id:string,
  name: string,
  email: string,
  profileImage: string
}

export interface CounsellorDetails{
  _id:string,
  name: string,
  email: string,
  profileImage: string
}

export interface AdminAppointments{
  _id: string,
  counsellor:string
  student: string
  studentDetails: StudentDetails
  counsellorDetails: CounsellorDetails
  startTime: string
  endTime:string
  date: string | Date
  status: AppointmentStatus
  meetingMethod: MeetingMethod
  meetingDetails: string
  createdAt: string | Date
  confirmationDeadline: string | Date
  slotId: string
}

export interface UserReports{
  _id: string,
  reportedBy: string,
  against: string,
  studentDetails: StudentDetails
  counsellorDetails: CounsellorDetails
  reason: string,
  severity: ReportSeverity,
  status: ReportStatus,
  createdAt: string | Date
  description: string
}



export interface ThreadUser {
  _id: string;
  name: string;
  avatar?: string;
  isVerified?: boolean;
}

export interface ThreadStats {
  supportCount: number;
  relateCount: number;
  hugCount: number;
  replyCount: number;
  viewCount: number;
}

export interface ThreadAI {
  sentiment: 'positive' | 'neutral' | 'negative';
  emotionTags: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Thread {
  _id: string;
  user: ThreadUser | string; // Can be ID or populated object
  isAnonymous: boolean;
  anonymousIdentity?: string | null;
  moodLabel: string;
  topic: string;
  content: string;
  tags: string[];
  stats: ThreadStats;
  isMine: boolean,
  moderation: {
    isFlagged: boolean;
    isSensitive: boolean;
    flaggedReason?: string | null;
  };
  aiMeta?: ThreadAI;
  status: 'active' | 'hidden' | 'deleted';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface SelectedThread{
  _id: string,
  moodLabel: string,
  topic: string,
  isAnonymous: boolean,
  content: string
}