export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical'
export type ReportStatus = 'open' | 'in_review' | 'resolved' | 'rejected'
export type UserRole = 'student' | 'counsellor' | 'admin'
export type UserStatus = 'active' | 'suspended' | 'inactive'
export type AppointmentStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled' | 'completed_by_counsellor'
export type ConsultationMode = 'video' | 'text' | 'phone'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  joinedDate: string
  lastActive: string
  avatar?: string
  sessionCount: number
}

export interface Report {
  id: string
  reportedBy: string
  reportedByName: string
  againstName: string
  againstId: string
  reason: string
  severity: ReportSeverity
  status: ReportStatus
  description: string
  appointmentId?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  notes?: string
}

export interface CounsellorRequest {
  id: string
  name: string
  email: string
  specialization: string[]
  yearsExperience: number
  bio: string
  credentials: string[]
  status: 'pending' | 'approved' | 'rejected'
  appliedAt: string
  avatar?: string
}

export interface AdminAppointment {
  id: string
  studentId: string
  studentName: string
  counsellorId: string
  counsellorName: string
  scheduledAt: string
  duration: number
  status: AppointmentStatus
  mode: ConsultationMode
  reason: string
  notes?: string
}

export interface AdminMetrics {
  totalUsers: number
  activeCounsellors: number
  pendingApprovals: number
  totalAppointments: number
  openReports: number
  criticalReports: number
}

export interface PlatformSettings {
  appointmentAutoCancelMinutes: number
  reminderTimings: {
    oneHourBefore: boolean
    tenMinutesBefore: boolean
  }
  emailNotifications: {
    newReports: boolean
    appointmentReminders: boolean
    counsellorRequests: boolean
  }
}

export interface ReportTimeline {
  created: {
    date: string
    by: string
  }
  reviewed?: {
    date: string
    by: string
  }
  resolved?: {
    date: string
    by: string
    resolution: string
  }
}

export interface AdminCounsellor {
  id: string
  name: string
  email: string
  specialization: string[]
  yearsExperience: number
  avatar?: string
  status: 'active' | 'inactive' | 'on_leave'
  rating: number
  totalSessions: number
  completedSessions: number
  sessionCount:number
  joinedDate: string
  bio: string
  sessionFee: number
  availability: 'available' | 'busy' | 'offline'
  credentials: string[]
}
