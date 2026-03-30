'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ToastFunction } from '@/helper/toast-function'
import { mockReports } from '@/lib/admin-mock-data'
import axios from 'axios'
import { AlertTriangle, CheckCircle, Clock, FileCheck } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { CriticalReportsSkeleton } from './critical-reports-skeleton'
import { REASON_LABELS } from '@/app/admin/reports/page'

const AdminCriticalReports = () => {
    const [criticalReports, setCriticalReports] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCriticalReports = async()=>{
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/users/admin/critical/reports`,
                {withCredentials: true}
            )

            if(response.data.success){
                setCriticalReports(response.data.data);
            }
        } catch (error) {
            ToastFunction('error',error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchCriticalReports();
    },[]);

    if(loading) return <CriticalReportsSkeleton/>
  return (
    < >
        {/* Critical Alerts */}
        {criticalReports.length > 0 && (
          <Card className="lg:col-span-2 border-destructive/50 bg-destructive/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <h3 className="text-lg font-bold text-foreground">
                  Critical Alerts ({criticalReports?.length})
                </h3>
              </div>
              <Link href="/admin/reports?severity=critical">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {criticalReports.map((report:any) => (
                <div
                  key={report._id}
                  className="rounded-lg border border-destructive/20 bg-background p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                     <span className="text-sm font-medium text-slate-700 truncate max-w-[250px]">
                            {/* Map the key to the label, fallback to the original string if not found */}
                            {REASON_LABELS[report.reason] || report.reason || "No reason specified"}
                        </span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {report?.reportedBy.name} reported {report?.against?.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {report?.description}
                      </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/admin/reports`}>
                        Review
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </>
  )
}

export default AdminCriticalReports