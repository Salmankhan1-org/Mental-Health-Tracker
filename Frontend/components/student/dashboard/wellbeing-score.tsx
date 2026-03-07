// "use client"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Progress } from "@/components/ui/progress"
// import { TrendingUp, Brain, Moon, Activity } from "lucide-react"

// const metrics = [
//   {
//     label: "Emotional Balance",
//     value: 72,
//     icon: <Brain className="h-4 w-4" />,
//     trend: "+5%",
//   },
//   {
//     label: "Sleep Quality",
//     value: 65,
//     icon: <Moon className="h-4 w-4" />,
//     trend: "+2%",
//   },
//   {
//     label: "Stress Management",
//     value: 58,
//     icon: <Activity className="h-4 w-4" />,
//     trend: "-3%",
//   },
// ]

// export function WellbeingScore() {
//   const overallScore = 68

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="text-lg">Wellbeing Overview</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <div className="mb-6 flex flex-col items-center">
//           <div className="relative flex h-32 w-32 items-center justify-center">
//             <svg className="absolute inset-0" viewBox="0 0 100 100">
//               <circle
//                 cx="50"
//                 cy="50"
//                 r="42"
//                 fill="none"
//                 stroke="var(--color-secondary)"
//                 strokeWidth="8"
//               />
//               <circle
//                 cx="50"
//                 cy="50"
//                 r="42"
//                 fill="none"
//                 stroke="var(--color-primary)"
//                 strokeWidth="8"
//                 strokeLinecap="round"
//                 strokeDasharray={`${overallScore * 2.64} 264`}
//                 transform="rotate(-90 50 50)"
//                 className="transition-all duration-1000"
//               />
//             </svg>
//             <div className="flex flex-col items-center">
//               <span className="text-3xl font-bold text-foreground">{overallScore}</span>
//               <span className="text-xs text-muted-foreground">Overall</span>
//             </div>
//           </div>
//           <div className="mt-2 flex items-center gap-1 text-sm text-primary">
//             <TrendingUp className="h-3.5 w-3.5" />
//             <span className="font-medium">Improving this week</span>
//           </div>
//         </div>

//         <div className="flex flex-col gap-4">
//           {metrics.map((metric) => (
//             <div key={metric.label} className="flex flex-col gap-2">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 text-sm text-foreground">
//                   <span className="text-muted-foreground">{metric.icon}</span>
//                   {metric.label}
//                 </div>
//                 <span
//                   className={`text-xs font-medium ${
//                     metric.trend.startsWith("+")
//                       ? "text-primary"
//                       : "text-destructive"
//                   }`}
//                 >
//                   {metric.trend}
//                 </span>
//               </div>
//               <Progress value={metric.value} className="h-2" />
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Brain, Activity } from "lucide-react"
import { Skeleton } from "../../ui/skeleton"

interface Stats {
  overall: number
  improving: boolean | null
  emotionalBalance: number
  emotionalChange: number | null
  stressChange: number | null
}

export function WellbeingScore() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_HOST}/mood/weekly/status`,
          { withCredentials: true }
        )

        if(res.data.success){
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>

        <CardContent>
          <div className="mb-6 flex flex-col items-center">
            {/* Circle skeleton */}
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="mt-4 h-4 w-32" />
          </div>

          <div className="flex flex-col gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Wellbeing Overview</CardTitle>
      </CardHeader>

      <CardContent>
        {/*  Overall Score Circle */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <svg className="absolute inset-0" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="var(--color-secondary)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${stats.overall * 2.64} 264`}
                transform="rotate(-90 50 50)"
                className="transition-all duration-1000"
              />
            </svg>

            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold">
                {stats.overall}
              </span>
              <span className="text-xs text-muted-foreground">
                Overall
              </span>
            </div>
          </div>

          {/*  Only show if comparison exists */}
          {stats.improving !== null && (
            <div
              className={`mt-2 flex items-center gap-1 text-sm ${
                stats.improving ? "text-primary" : "text-destructive"
              }`}
            >
              {stats.improving ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              <span className="font-medium">
                {stats.improving
                  ? "Improving this week"
                  : "Declining this week"}
              </span>
            </div>
          )}
        </div>

        {/*  Metrics Section */}
        <div className="flex flex-col gap-4">
          {/* Emotional Balance */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Brain className="h-4 w-4 text-muted-foreground" />
                Emotional Balance
              </div>

              {stats.emotionalChange !== null && (
                <span
                  className={`text-xs font-medium ${
                    stats.emotionalChange > 0
                      ? "text-primary"
                      : "text-destructive"
                  }`}
                >
                  {stats.emotionalChange > 0 ? "+" : ""}
                  {stats.emotionalChange}%
                </span>
              )}
            </div>

            <Progress value={stats.emotionalBalance} className="h-2" />
          </div>

          {/* Stress Management */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Activity className="h-4 w-4 text-muted-foreground" />
                Stress Management
              </div>

              {stats.stressChange !== null && (
                <span
                  className={`text-xs font-medium ${
                    stats.stressChange > 0
                      ? "text-primary"
                      : "text-destructive"
                  }`}
                >
                  {stats.stressChange > 0 ? "+" : ""}
                  {stats.stressChange}%
                </span>
              )}
            </div>

            {/* Stress inverse visualization (optional improvement) */}
            <Progress
              value={100 - stats.emotionalBalance}
              className="h-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
