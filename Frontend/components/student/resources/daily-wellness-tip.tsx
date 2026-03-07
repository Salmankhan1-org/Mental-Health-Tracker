"use client"
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

const DailyWellnessTip = () => {
    const [dailyWellnessTip, setDailyWellnessTIp] = useState('');
    const [isLoadingTip, setIsLoadingTip] = useState(false);

    const generateDailyWellnessTip = async () => {
        try {
            setIsLoadingTip(true);
            const today = new Date().toISOString().split("T")[0];

            const storedDate = localStorage.getItem("wellnessTipDate");
            const storedTip = localStorage.getItem("wellnessTipData");

            // If already fetched today → use cached value
            if (storedDate === today && storedTip) {
            setDailyWellnessTIp(storedTip);
            return;
            }

            // Otherwise call API
            const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_HOST}/wellness/daily-tip/new`,
            { withCredentials: true }
            );

            if (response.data.success) {
            const tip = response.data.data.tip;

            setDailyWellnessTIp(tip);

            // Store in localStorage
            localStorage.setItem("wellnessTipDate", today);
            localStorage.setItem("wellnessTipData", tip);
            }

        } catch (error) {
            console.log(error);
        }finally{
            setIsLoadingTip(false);
        }
    };

    useEffect(()=>{
        generateDailyWellnessTip();
    },[]);
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Daily Wellness Tip
        </p>

        {isLoadingTip ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
                <Skeleton className="h-4 w-3/6" />
            </div>
            )  : (
            <p className="text-sm font-medium leading-relaxed text-foreground">
            "{dailyWellnessTip ||
                `Take a 5-minute break every hour during study sessions.
                Step outside, stretch, or simply close your eyes and breathe
                deeply. Small pauses make a big difference in sustaining focus
                and managing stress.`}"
            </p>
        )}
    </div>
  )
}

export default DailyWellnessTip