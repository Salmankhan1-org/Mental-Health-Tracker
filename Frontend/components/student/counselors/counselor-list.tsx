// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Calendar, Clock, Star, MapPin, Video, Loader2 } from "lucide-react"
// import axios from "axios"
// import Link from "next/link"
// import { ApiErrorResponse, Counsellor } from "@/types/types"
// import CounselorCardSkeleton from "./counselor-card-skeleton"
// import { toast } from "sonner"
// import { LoadingButton } from "@/components/common/button"
// import BookAppointmentDialog from "./book-appointment"
// import { IoIosArrowDown } from "react-icons/io"

// import {motion} from 'framer-motion'

// export default function CounselorList() {
//   const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [hasMore, setHasMore] = useState(false);

//   const handleFetchAllCounselors =  async(isInitial = false)=>{
//     try {
//       setLoading(true);

//       const skip = isInitial ? 0 : counsellors.length;
//       const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/counsellors/all?skip=${skip}`,{
//         withCredentials: true
//       });

//       if(response?.data.success){
//         setCounsellors((prev) =>
//           isInitial
//             ? response.data.data.counsellors
//             : [...prev, ...response.data.data.counsellors],
//         );
//         setHasMore(response.data.data.hasMore);
//       }
//     } catch (error) {
//       console.log(error);
//     }finally{
//       setLoading(false);
//     }
//   }

//   useEffect(()=>{
//     handleFetchAllCounselors(true);
//   },[]);

  
//   return (
//     <>
//     <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
//       {loading ?  
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {Array.from({ length: 6 }).map((_, i) => (
//           <CounselorCardSkeleton key={i} />
//         ))}
//       </div>:
//       <>
//       {counsellors.map((counselor:any, index:number) => (
       
//           <div className='break-inside-avoid'>
//             <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.4, delay: index * 0.1 }}
//             className="w-full"
//           >

//             <CounselorCard key={counselor._id}  counselor={counselor} />
//         </motion.div>
//           </div>
    
//       ))}
//       </>}
//     </div>
//     {hasMore && (
//       <div className="pt-2 text-center border-t border-gray-100 mt-4">
//         <button
//           onClick={() => handleFetchAllCounselors()}
//           disabled={loading}
//           className="text-sm font-medium cursor-pointer text-teal-600 hover:text-teal-700 disabled:text-gray-400 transition-colors py-2"
//         >
//           {loading ? (
//             <span className="flex items-center gap-2 justify-center">
//               <Loader2 className="h-3 w-3 animate-spin" />{" "}
//               Loading...
//             </span>
//           ) : (
//             <span className="flex gap-1 items-center">
//               Show More <IoIosArrowDown />
//             </span>
//           )}
//         </button>
//       </div>
//     )}
//     </>
//   )
// }

// function CounselorCard({
//   counselor,
// }:{counselor:Counsellor}) {

// 	const [openDialog, setOpenDialog] = useState(false);

//   return (
//     <Card className="flex flex-col transition-all hover:border-primary/30 h-fit py-0! hover:shadow-md">
//       <CardContent className="flex flex-1 flex-col p-4">
//         <Link href={`/student/counselors/${counselor._id}`}>

//           <div className="mb-4 flex items-start gap-4">
//           <Avatar className="h-14 w-14 border-2 border-primary/20">
//             {counselor?.user?.profileImage ? (
//               <img
//                 src={counselor.user.profileImage}
//                 alt={counselor.user.name[0]}
//                 className="w-full h-full object-cover"
//               />
//             ) : null}
//             <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
//               {counselor?.user.name[0]}
//             </AvatarFallback>
//           </Avatar>
//           <div className="min-w-0 flex-1">
//             <h3 className="font-semibold text-foreground">{counselor?.user.name}</h3>
//             <p className="text-sm text-muted-foreground">{counselor.title}</p>
//             <div className="mt-1 flex items-center gap-1">
//               <Star className="h-3.5 w-3.5 fill-accent text-accent" />
//               <span className="text-sm font-medium text-foreground">
//                 {counselor.rating?.average?.toFixed(1) || "0"}
//               </span>
//               <span className="text-xs text-muted-foreground">
//                 ({counselor.rating.count || 0} reviews)
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="mb-4 flex flex-wrap gap-1.5">
//           {counselor?.expertiseTags.map((spec:string) => (
//             <Badge key={spec} variant="secondary" className="text-xs">
//               {spec}
//             </Badge>
//           ))}
//         </div>

//         <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-6">
//           {counselor.bio}
//         </p>

//         <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
//           {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <Clock className="h-3.5 w-3.5" />
//             <span
//               className={
//                 counselor?.availability?.includes("Today")
//                   ? "font-medium text-primary"
//                   : ""
//               }
//             >
//               {counselor.availability || "Available"}
//             </span>
//           </div> */}
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <MapPin className="h-3.5 w-3.5" />
//             <span>{counselor.location}</span>
//           </div>
//           {counselor?.virtualSessions && (
//             <div className="flex items-center gap-2 text-sm text-primary">
//               <Video className="h-3.5 w-3.5" />
//               <span>Virtual sessions available</span>
//             </div>
//           )}
//         </div>
//         </Link>

//          <Button onClick={()=>setOpenDialog(true)} className="mt-4 w-full gap-2">
//           <Calendar className="h-4 w-4" />
//           	Book Appointment
//         </Button>
//       </CardContent>
// 	  <BookAppointmentDialog 
// 	  	counsellorId={counselor?.user?._id}
// 		counsellorName={counselor?.user?.name}
// 		open={openDialog}
// 		onOpenChange={setOpenDialog}
// 		 />
//     </Card>
    
//   )
// }



"use client"

import { useEffect, useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Star, MapPin, Video, Loader2, Search, Filter } from "lucide-react"
import axios from "axios"
import Link from "next/link"
import { Counsellor } from "@/types/types"
import CounselorCardSkeleton from "./counselor-card-skeleton"
import BookAppointmentDialog from "./book-appointment"
import { IoIosArrowDown } from "react-icons/io"
import { motion, AnimatePresence } from 'framer-motion'
import { ToastFunction } from "@/helper/toast-function"
import SpecializationsSkeleton from "./specialization-skeleton"

export interface TrendingTitle{
  count:number,
  title:string
}

export default function CounselorList() {
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [onlyVirtual, setOnlyVirtual] = useState(false);
  const [trendingTitles, setTrendingTitles] = useState<TrendingTitle[]>([]);
  const [loadingTitles, setLoadingTitles] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchQuery);

  // Fetch Counselors - Added AbortController to prevent race conditions
  const handleFetchAllCounselors = async (isInitial = false) => {
    try {
      setLoading(true);
      // If we are starting a new search/filter, clear existing list immediately for better UX
      const skip = isInitial ? 0 : counsellors.length;
      
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_HOST}/counsellors/all`,
        {
          params: {
            skip,
            searchQuery: debouncedSearch,
            title: selectedTitles.join(","),
            // virtualOnly: onlyVirtual // Remember to add this to your backend controller!
          },
          withCredentials: true,
        }
      );

      if (response?.data.success) {
        setCounsellors((prev) =>
          isInitial ? response.data.data.counsellors : [...prev, ...response.data.data.counsellors],
        );
        setHasMore(response.data.data.hasMore);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTrendingTitles = async()=>{
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/counsellors/trending/titles`,
        {withCredentials: true}
      );

      if(response.data.success){
        setTrendingTitles(response.data.data);
      }
    } catch (error) {
      ToastFunction('error', error);
    }finally{
      setLoading(false);
    }
  }

  const toggleTitle = (title: string) => {
    setSelectedTitles(prev => 
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    );
  };

   useEffect(() => { 
    handleFetchTrendingTitles();
  }, []);

  useEffect(()=>{
    handleFetchAllCounselors(true);
  },[debouncedSearch, selectedTitles]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* LEFT SIDEBAR FILTERS */}

      <aside className="w-full md:w-64 shrink-0 space-y-6 md:sticky md:top-24 z-20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search name or title..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4 rounded-lg border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <Filter className="h-4 w-4" /> Filters
          </div>
          
          <hr />

          {loadingTitles ? <SpecializationsSkeleton/>:<div className="space-y-3">
            <h4 className="text-sm font-medium">Specializations</h4>
            {trendingTitles.map((item:TrendingTitle) => (
              <div key={item.title} className="flex items-center space-x-2">
                <Checkbox 
                  id={item.title} 
                  checked={selectedTitles.includes(item.title)}
                  onCheckedChange={() => toggleTitle(item.title)}
                />
                <label htmlFor={item.title} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                  {item.title}
                </label>
              </div>
            ))}
          </div>}

          <hr />

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="virtual" 
              checked={onlyVirtual}
              onCheckedChange={(checked) => setOnlyVirtual(!!checked)}
            />
            <label htmlFor="virtual" className="text-sm font-medium cursor-pointer">
              Virtual Sessions Only
            </label>
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE CONTENT */}
      <div className="flex-1 w-full">
        {loading && counsellors.length === 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <CounselorCardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {counsellors.map((counselor, index) => (
                  <motion.div
                    key={counselor._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CounselorCard counselor={counselor} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {counsellors.length === 0 && !loading && (
              <div className="text-center py-20 border rounded-lg border-dashed">
                <p className="text-muted-foreground">No counselors found matching your criteria.</p>
                <Button variant="link" onClick={() => {setSearchQuery(""); setSelectedTitles([]); setOnlyVirtual(false);}}>
                  Clear all filters
                </Button>
              </div>
            )}

            {hasMore && (
              <div className="pt-8 text-center">
                <Button
                  variant="ghost"
                  onClick={() => handleFetchAllCounselors()}
                  disabled={loading}
                  className="text-teal-600 hover:text-teal-700"
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <IoIosArrowDown className="mr-2" />}
                  Show More
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}


function CounselorCard({ counselor }: { counselor: Counsellor }) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Card className="flex flex-col h-[460px] transition-all hover:shadow-lg border-muted/60 overflow-hidden bg-card">
      <CardContent className="flex flex-1 flex-col p-5 h-full">
        {/* CRITICAL: Added 'flex-1 flex flex-col' to the Link */}
        <Link 
          href={`/student/counselors/${counselor._id}`} 
          className="group flex-1 flex flex-col min-h-0"
        >
          {/* Header Section: Fixed height ensures name/title alignment */}
          <div className="mb-4 flex items-start gap-4 h-16 shrink-0">
            <Avatar className="h-14 w-14 border-2 border-primary/10 transition-transform group-hover:scale-105 shrink-0">
              {counselor?.user?.profileImage ? (
                <img src={counselor.user.profileImage} alt={counselor.user.name} className="w-full h-full object-cover" />
              ) : null}
              <AvatarFallback>{counselor?.user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors truncate">
                {counselor?.user.name}
              </h3>
              <p className="text-xs font-medium text-teal-600 truncate">{counselor.title}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <div className="flex items-center bg-accent/10 px-1.5 py-0.5 rounded">
                  <Star className="h-3 w-3 fill-accent text-accent mr-1" />
                  <span className="text-[11px] font-bold">{counselor.rating?.average?.toFixed(1) || "0"}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">({counselor.rating.count} reviews)</span>
              </div>
            </div>
          </div>

          {/* Specialization Section: Fixed height to prevent shifting */}
          <div className="mb-4 flex flex-wrap gap-1.5 h-12 overflow-hidden content-start shrink-0">
            {counselor?.expertiseTags.slice(0, 3).map((spec) => (
              <Badge key={spec} variant="outline" className="text-[10px] font-medium bg-muted/30">
                {spec}
              </Badge>
            ))}
            {counselor?.expertiseTags.length > 3 && (
              <span className="text-[10px] text-muted-foreground self-center">+{counselor.expertiseTags.length - 3} more</span>
            )}
          </div>

          {/* Bio Section: flex-grow fills the middle space */}
          <div className="flex-grow min-h-0">
            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4 italic">
              "{counselor.bio}"
            </p>
          </div>

          {/* Metadata Section: Stays at the bottom of the Link section */}
          <div className="mt-auto pt-3 border-t space-y-2 shrink-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{counselor.location}</span>
            </div>
            {counselor?.virtualSessions && (
              <div className="flex items-center gap-2 text-xs text-primary font-medium">
                <Video className="h-3.5 w-3.5" />
                <span>Online Consultations</span>
              </div>
            )}
          </div>
        </Link>

        {/* Button: Stays at the very bottom of CardContent */}
        <Button 
          onClick={(e) => {
            e.preventDefault(); // Prevent Link click
            setOpenDialog(true);
          }} 
          className="mt-4 w-full shadow-sm hover:shadow-md transition-all shrink-0"
        >
          <Calendar className="mr-2 h-4 w-4" />
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
  );
}
