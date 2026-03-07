'use client'


import { CounsellorSidebar } from '@/components/counsellor/sidebar'
import { CounsellorTopBar } from '@/components/counsellor/topbar'
import { useState } from 'react'

export default function CounsellorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      <CounsellorSidebar open={sidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden transition-all duration-300">
        <CounsellorTopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}