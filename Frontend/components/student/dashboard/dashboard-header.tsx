"use client"
import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'

const DashBoardHeader = () => {
    const {user} = useSelector((state:RootState)=>state.auth);
  return (
    <div className="mb-8">
        <h1
        className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl"
        style={{ fontFamily: 'var(--font-display)' }}
        >
        Welcome back, {user?.name}
        </h1>
        <p className="mt-1 text-muted-foreground">
        Here is a snapshot of your emotional wellbeing this week.
        </p>
    </div>
  )
}

export default DashBoardHeader