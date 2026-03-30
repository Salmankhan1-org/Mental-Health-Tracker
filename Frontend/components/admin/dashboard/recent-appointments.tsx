'use client'
 import React, { useEffect, useState } from 'react'
 import { Card } from "@/components/ui/card";
import { StatusBadge } from "../status-badge";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ToastFunction } from "@/helper/toast-function";
import axios from "axios";
import { format } from 'date-fns';
import { RecentAppointmentsSkeleton } from './recent-appointments-skeleton';
 
 const RecentAppointments = () => {
    const [recentAppointments, setRecentAppointments] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchRecentAppointments = async()=>{
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/appointment/admin/recent`,{
                withCredentials:true
            });

            if(response.data.success){
                setRecentAppointments(response.data.data);
            }
        } catch (error) {
            ToastFunction('error', error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchRecentAppointments();
    },[]);

    if(loading) return <RecentAppointmentsSkeleton/>


    if (recentAppointments.length === 0) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <p className="text-muted-foreground text-sm">No recent appointments found.</p>
        <Link href="/admin/appointments" className="mt-4">
          <Button variant="outline" size="sm">Go to Appointments</Button>
        </Link>
      </Card>
    );
  }
   

 return (
    <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Recent Appointments</h3>
          <Link href="/admin/appointments">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Counsellor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.map((apt:any) => (
                <tr key={apt._id} className="border-b border-border/50 hover:bg-secondary/50">
                  <td className="px-4 py-3 text-sm text-foreground">{apt.student.name}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{apt.counsellor.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-700">
                            {apt?.date ? format(new Date(apt.date), 'dd MMM, yyyy') : 'N/A'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium italic">
                            {apt.startTime  || 'TBD'} - {apt.endTime || 'TBD'}
                        </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={apt.status}
                      type="appointment-status"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
 )
 }
 
 export default RecentAppointments