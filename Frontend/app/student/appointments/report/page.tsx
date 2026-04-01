import ReportCounsellor from "@/components/student/appointment/report.counsellor";
import { Suspense } from "react";


export default function ReportPage() {
   
    return (
       <Suspense fallback={<div>Loading...</div>}>
            <ReportCounsellor />
          </Suspense>
    )
}
