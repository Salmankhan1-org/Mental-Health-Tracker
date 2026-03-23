"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Clock, Star, MapPin, Video } from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { ApiErrorResponse, Counsellor } from "@/types/types"
import CounselorCardSkeleton from "./counselor-card-skeleton"
import { toast } from "sonner"
import { LoadingButton } from "@/components/common/button"
import BookAppointmentDialog from "./book-appointment"

export default function CounselorList() {
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFetchAllCounselors =  async()=>{
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/counsellors/all`,{
        withCredentials: true
      });

      if(response?.data.success){
        setCounsellors(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    handleFetchAllCounselors();
  },[]);

  if (loading) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <CounselorCardSkeleton key={i} />
      ))}
    </div>
  )
}
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {counsellors.map((counselor:any) => (
       
          <CounselorCard key={counselor._id}  counselor={counselor} />
    
      ))}
    </div>
  )
}

function CounselorCard({
  counselor,
}:{counselor:Counsellor}) {

	const [openDialog, setOpenDialog] = useState(false);

  return (
    <Card className="flex flex-col transition-all hover:border-primary/30 hover:shadow-md">
      <CardContent className="flex flex-1 flex-col p-6">
        <Link href={`/student/counselors/${counselor._id}`}>

          <div className="mb-4 flex items-start gap-4">
          <Avatar className="h-14 w-14 border-2 border-primary/20">
            {counselor?.user?.profileImage ? (
              <img
                src={counselor.user.profileImage}
                alt={counselor.user.name[0]}
                className="w-full h-full object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
              {counselor?.user.name[0]}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground">{counselor?.user.name}</h3>
            <p className="text-sm text-muted-foreground">{counselor.title}</p>
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" />
              <span className="text-sm font-medium text-foreground">
                {counselor.rating?.average?.toFixed(1) || "0"}
              </span>
              <span className="text-xs text-muted-foreground">
                ({counselor.rating.count || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {counselor?.expertiseTags.map((spec:string) => (
            <Badge key={spec} variant="secondary" className="text-xs">
              {spec}
            </Badge>
          ))}
        </div>

        <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-6">
          {counselor.bio}
        </p>

        <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
          {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span
              className={
                counselor?.availability?.includes("Today")
                  ? "font-medium text-primary"
                  : ""
              }
            >
              {counselor.availability || "Available"}
            </span>
          </div> */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{counselor.location}</span>
          </div>
          {counselor?.virtualSessions && (
            <div className="flex items-center gap-2 text-sm text-primary">
              <Video className="h-3.5 w-3.5" />
              <span>Virtual sessions available</span>
            </div>
          )}
        </div>
        </Link>

         <Button onClick={()=>setOpenDialog(true)} className="mt-4 w-full gap-2">
          <Calendar className="h-4 w-4" />
          	Book Appointment
        </Button>
      </CardContent>
	  <BookAppointmentDialog 
	  	counsellorId={counselor?.user?._id}
		counsellorName={counselor?.user?.name}
		open={openDialog}
		onOpenChange={setOpenDialog}
		 />
    </Card>
  )
}
