"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  ShieldAlert, 
  Lightbulb, 
  ChevronRight,
  UserCheck
} from "lucide-react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { GuidanceSkeleton } from "./daily-guidance-skeleton";
import Link from "next/link";

const DailyGuidance = () => {
  const [guidance, setGuidance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const fetchGuidance = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_HOST}/mood/guidance/latest`, {
        withCredentials: true,
      });

      if (response.data.success && response.data.data) {
        setGuidance(response.data.data);
        setLoading(false);
      } else if (retryCount < 5) {
        
        setTimeout(() => setRetryCount((prev) => prev + 1), 5000);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Guidance fetch error:", error);
      setLoading(false);
    }
  }, [retryCount]);

  useEffect(() => {
    fetchGuidance();
  }, [fetchGuidance]);

  if (loading) return <GuidanceSkeleton />;
  if (!guidance) return null;

  const severityColor = {
    low: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
    medium: "bg-amber-500/10 text-amber-600 border-amber-200",
    high: "bg-rose-500/10 text-rose-600 border-rose-200",
  }[guidance.severity as "low" | "medium" | "high"];

  return (
    <Card className={cn(
      "overflow-hidden border-none shadow-lg bg-gradient-to-br from-background to-secondary/20",
      guidance.severity === 'high' && "ring-1 ring-rose-200"
    )}>
      <div className="p-6">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Daily AI Insight</h2>
              <p className="text-sm text-muted-foreground">Tailored for your emotional trend</p>
            </div>
          </div>
          <Badge variant="outline" className={cn("px-3 py-1 capitalize font-medium", severityColor)}>
            {guidance.severity} Priority
          </Badge>
        </div>

        {/* AI Analysis Header */}
        <p className="text-lg font-medium leading-relaxed mb-6 text-foreground/90 italic">
          "{guidance.analysisHeader}"
        </p>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Action Items */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-primary" />
              Suggested Actions
            </h3>
            <div className="space-y-3">
              {guidance.microActions.map((action: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{action.task}</span>
                    <span className="text-xs text-muted-foreground capitalize">{action.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 px-2 py-1 rounded-md">
                    <Clock className="w-3 h-3" />
                    {action.duration}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Educational Insight & Referral */}
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                The Science Behind It
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {guidance.educationalInsight}
              </p>
            </div>

            {guidance.referral?.recommended && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex items-start gap-4">
                <ShieldAlert className="w-5 h-5 text-rose-500 mt-1 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-rose-900">Professional Support Recommended</h4>
                  <p className="text-xs text-rose-700/80 mt-1 mb-3">{guidance.referral.reason}</p>
                  <Link href={'/student/counselors'}>
                    <Button size="sm" className="bg-rose-600 hover:bg-rose-700 h-8 text-xs gap-2">
                        <UserCheck className="w-3 h-3" /> Connect with Counselor
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};


export default DailyGuidance;
