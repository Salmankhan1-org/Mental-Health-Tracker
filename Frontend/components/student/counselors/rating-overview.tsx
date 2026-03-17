'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CounsellorReviewStats } from '@/types/types'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface RatingsOverviewProps {
  reviewStats: CounsellorReviewStats | null
}



export function RatingsOverview({ reviewStats }: RatingsOverviewProps ) {


  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Rating & Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Rating Summary */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{reviewStats?.averageRating}</div>
            <div className="flex justify-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(Number(reviewStats?.averageRating)) ? 'fill-accent text-accent' : 'fill-muted text-muted'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{reviewStats?.totalReviews} reviews</p>
          </div>

          {/* Distribution Bars */}
          <div className="flex-1 space-y-2">
            {reviewStats?.distribution?.map((item) => (
              <div key={item.rating} className="flex items-center gap-2">
                <span className="w-6 text-right text-sm font-medium text-foreground">{item.rating}</span>
                <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-xs text-muted-foreground">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="mt-6 pt-6 border-t border-border">
          <p className="mb-4 text-sm font-medium text-foreground">Review Distribution</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={reviewStats?.distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="rating"
                stroke="var(--color-foreground)"
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              />
              <YAxis
                stroke="var(--color-foreground)"
                tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                }}
                labelStyle={{ color: 'var(--color-foreground)' }}
              />
              <Bar dataKey="count" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
