'use client'

import { Calendar, Clock, Video, Phone, MapPin } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import axios from 'axios'
import TodayAppointmentsSkeleton from './today-appointments-skeleton'

const todayAppointments = [
  {
    id: 1,
    studentName: 'Alex Johnson',
    time: '10:00 AM',
    duration: '60 min',
    mode: 'Google Meet',
    modeIcon: Video,
    topic: 'Anxiety Management',
  },
  {
    id: 2,
    studentName: 'Emma Wilson',
    time: '11:30 AM',
    duration: '45 min',
    mode: 'Phone',
    modeIcon: Phone,
    topic: 'Career Stress',
  },
  {
    id: 3,
    studentName: 'Michael Brown',
    time: '2:00 PM',
    duration: '60 min',
    mode: 'In-person',
    modeIcon: MapPin,
    topic: 'Academic Pressure',
  },
]

// export function TodayAppointments() {
//   return (
//     <Card className="border-border">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Calendar className="h-5 w-5 text-primary" />
//           Today's Appointments
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {todayAppointments.length > 0 ? (
//           todayAppointments.map((apt) => {
//             const ModeIcon = apt.modeIcon
//             return (
//               <div
//                 key={apt.id}
//                 className="space-y-2 rounded-lg border border-border bg-secondary/30 p-4 hover:bg-secondary/50 transition-colors"
//               >
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <h3 className="font-semibold text-foreground">{apt.studentName}</h3>
//                     <p className="text-sm text-muted-foreground">{apt.topic}</p>
//                   </div>
//                   <Badge variant="outline" className="ml-2">
//                     Scheduled
//                   </Badge>
//                 </div>
//                 <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                   <div className="flex items-center gap-1">
//                     <Clock className="h-4 w-4" />
//                     <span>{apt.time}</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <ModeIcon className="h-4 w-4" />
//                     <span>{apt.mode}</span>
//                   </div>
//                 </div>
//               </div>
//             )
//           })
//         ) : (
//           <div className="text-center text-muted-foreground">No appointments today</div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }

export function TodayAppointments() {
	const [todaysAppointments, setTodaysAppointments] = useState([]);
	const [loading, setLoading] = useState(false);
	

	const fetchTodaysAppointments = async()=>{
		try {
			setLoading(true);
			const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/appointment/today`,{
				withCredentials: true
			});

			if(response.data.success){
				setTodaysAppointments(response.data.data);
			}
		} catch (error) {
			console.log(error);
		}finally{
			setLoading(false);
		}
	}

	useEffect(()=>{
		fetchTodaysAppointments();
	},[]);

	if(loading) return <TodayAppointmentsSkeleton/>
	return (
		<Card className="border-none shadow-sm gap-0! bg-white overflow-hidden h-fit">
		<CardHeader className=" border-b border-slate-50">
			<CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
			<Calendar className="h-5 w-5 text-blue-500" />
			Today's Schedule
			</CardTitle>
		</CardHeader>
		<CardContent className="p-0">
			<div className="divide-y divide-slate-50">
			{todayAppointments.length > 0 ? (
				todayAppointments.map((apt) => {
				const ModeIcon = apt.modeIcon;
				return (
					<div
					key={apt.id}
					className="p-4 hover:bg-slate-50/50 transition-all cursor-pointer group"
					>
					<div className="flex items-center justify-between mb-1">
						<h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
						{apt.studentName}
						</h3>
						<div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
						<span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
						Live
						</div>
					</div>
					{/* <p className="text-xs text-slate-500 mb-3 line-clamp-1">{apt.topic}</p> */}
					
					<div className="flex items-center gap-4 text-[13px] text-slate-400">
						<div className="flex items-center gap-1.5">
						<Clock className="h-3.5 w-3.5" />
						<span>{apt.time}</span>
						</div>
						<div className="flex items-center gap-1.5">
						<ModeIcon className="h-3.5 w-3.5" />
						<span>{apt.mode}</span>
						</div>
					</div>
					</div>
				);
				})
			) : (
				<div className="py-12 text-center text-slate-400 text-sm italic">
				Clear schedule for today
				</div>
			)}
			</div>
		</CardContent>
		</Card>
	);
}
