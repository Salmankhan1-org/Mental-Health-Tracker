import { Globe, Phone, Users, Video } from "lucide-react";


export const appointmentsData = {
  upcoming: [
    {
      id: 1,
      studentName: 'Alex Johnson',
      date: '2024-03-10',
      time: '10:00 AM',
      duration: '60 min',
      mode: 'Google Meet' as const,
      topic: 'Anxiety Management',
      status: 'upcoming' as const,
    },
    {
      id: 2,
      studentName: 'Emma Wilson',
      date: '2024-03-10',
      time: '11:30 AM',
      duration: '45 min',
      mode: 'Phone' as const,
      topic: 'Career Stress',
      status: 'upcoming' as const,
    },
    {
      id: 3,
      studentName: 'Michael Brown',
      date: '2024-03-11',
      time: '2:00 PM',
      duration: '60 min',
      mode: 'In-person' as const,
      topic: 'Academic Pressure',
      status: 'upcoming' as const,
    },
    {
      id: 4,
      studentName: 'Jessica Lee',
      date: '2024-03-12',
      time: '9:00 AM',
      duration: '45 min',
      mode: 'Google Meet' as const,
      topic: 'Sleep Issues',
      status: 'upcoming' as const,
    },
  ],
  pending: [
    {
      id: 5,
      studentName: 'David Martinez',
      date: '2024-03-15',
      time: '3:00 PM',
      duration: '60 min',
      mode: 'Google Meet' as const,
      topic: 'Depression Support',
      status: 'pending' as const,
    },
    {
      id: 6,
      studentName: 'Lisa Anderson',
      date: '2024-03-16',
      time: '10:30 AM',
      duration: '45 min',
      mode: 'Phone' as const,
      topic: 'Social Anxiety',
      status: 'pending' as const,
    },
  ],
  completed: [
    {
      id: 7,
      studentName: 'Robert Taylor',
      date: '2024-03-08',
      time: '2:00 PM',
      duration: '60 min',
      mode: 'In-person' as const,
      topic: 'Stress Management',
      status: 'completed' as const,
    },
    {
      id: 8,
      studentName: 'Sarah White',
      date: '2024-03-07',
      time: '11:00 AM',
      duration: '45 min',
      mode: 'Google Meet' as const,
      topic: 'Confidence Building',
      status: 'completed' as const,
    },
    {
      id: 9,
      studentName: 'James Harris',
      date: '2024-03-06',
      time: '1:30 PM',
      duration: '60 min',
      mode: 'Phone' as const,
      topic: 'Relationship Issues',
      status: 'completed' as const,
    },
  ],
  cancelled: [
    {
      id: 10,
      studentName: 'Patricia Garcia',
      date: '2024-03-05',
      time: '4:00 PM',
      duration: '60 min',
      mode: 'Google Meet' as const,
      topic: 'Grief Counseling',
      status: 'cancelled' as const,
    },
  ],
}

export const METHOD_THEMES: Record<string, { label: string; icon: any; className: string }> = {
  'google-meet': { 
    label: "Google Meet", 
    icon: Video, 
    className: "text-emerald-700 bg-emerald-50 border-emerald-200" 
  },
  'phone': { 
    label: "Phone Call", 
    icon: Phone, 
    className: "text-blue-700 bg-blue-50 border-blue-200" 
  },
  'in-person': { 
    label: "In-Person", 
    icon: Users, 
    className: "text-slate-700 bg-slate-50 border-slate-200" 
  },
  // Add this to prevent "undefined" errors
  'default': {
    label: "Not Specified",
    icon: Globe,
    className: "text-slate-400 bg-slate-50 border-slate-100"
  }
}
