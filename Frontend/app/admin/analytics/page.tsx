'use client'

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import { Users, Calendar, TrendingUp, Heart } from 'lucide-react'
import { StatsCard } from '@/components/admin/stat-card'

const userGrowthData = [
  { month: 'Jan', users: 400, sessions: 240 },
  { month: 'Feb', users: 520, sessions: 290 },
  { month: 'Mar', users: 680, sessions: 380 },
  { month: 'Apr', users: 850, sessions: 450 },
  { month: 'May', users: 1020, sessions: 580 },
  { month: 'Jun', users: 1250, sessions: 720 },
]

const sentimentData = [
  { name: 'Positive', value: 45, color: '#3d9b8f' },
  { name: 'Neutral', value: 35, color: '#65b9a8' },
  { name: 'Negative', value: 15, color: '#d4a574' },
  { name: 'Critical', value: 5, color: '#d9534f' },
]

const counsellorPerformance = [
  { counsellor: 'Dr. Sarah', rating: 4.8, sessions: 45 },
  { counsellor: 'Dr. John', rating: 4.6, sessions: 38 },
  { counsellor: 'Dr. Emma', rating: 4.7, sessions: 42 },
  { counsellor: 'Dr. Mike', rating: 4.5, sessions: 35 },
  { counsellor: 'Dr. Lisa', rating: 4.9, sessions: 48 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">Platform performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title={"Total Users"}
          value="1,250"
          icon={Users}
          trend={
            {value:5, isPositive:true}
          }
          highlight={false}
        />
        <StatsCard
          title="Active Sessions"
          value="847"
          icon={Calendar}
          trend={
            {value:18, isPositive:true}
          }
          highlight={false}
        />
        <StatsCard
          title="Avg. Rating"
          value="4.7"
          icon={TrendingUp}
          trend={
            {value:-5, isPositive:false}
          }
          highlight={false}
        />
        <StatsCard
          title="Well-being Score"
          value="78%"
          icon={Heart}
          trend={
            {value:8, isPositive:true}
          }
          highlight={false}
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Growth Chart */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">User Growth & Sessions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="var(--color-wellness-calm)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-wellness-calm)' }}
              />
              <Line 
                type="monotone" 
                dataKey="sessions" 
                stroke="var(--color-wellness-warm)" 
                strokeWidth={2}
                dot={{ fill: 'var(--color-wellness-warm)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sentiment Distribution */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Student Sentiment</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sentimentData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Counsellor Performance */}
        <div className="rounded-lg border border-border bg-card p-6 md:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Counsellor Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={counsellorPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="counsellor" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar 
                dataKey="rating" 
                fill="var(--color-wellness-calm)" 
                name="Avg Rating"
                radius={[8, 8, 0, 0]}
              />
              <Bar 
                dataKey="sessions" 
                fill="var(--color-wellness-warm)" 
                name="Sessions"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
