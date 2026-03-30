'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ToastFunction } from '@/helper/toast-function'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import { Activity  } from 'lucide-react'
import React, {  useEffect, useState } from 'react'

const AdminRecentActivities = () => {
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRecentActivities = async()=>{
        try {
            setLoading(true);
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/users/admin/recent/activities`,
                {withCredentials: true}
            )

            if(response.data.success){
                setRecentActivities(response.data.data);
            }
        } catch (error) {
            ToastFunction('error',error);
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        fetchRecentActivities();
    },[]);
  return (
    <>{/* Recent Activity */}
        <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          {recentActivities && recentActivities?.length > 0 && recentActivities.map((activity:any, index:number) => (
            <div
              key={index}
              className="flex items-start gap-3 border-b border-border py-3 last:border-0 last:pb-0 first:pt-0"
            >
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Activity className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 flex-col gap-2">
                <p className="text-sm font-medium text-foreground">
                  {activity?.relation}
                </p>
                <span className="shrink-0 text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
              </span>
              </div>
              
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
        

    </>
  )
}

export default AdminRecentActivities