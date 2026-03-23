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
    <div className="flex h-screen w-full overflow-hidden bg-background fixed inset-0">
      
      <CounsellorSidebar open={sidebarOpen} />

      <div className="flex flex-1 flex-col h-full transition-all duration-300 min-w-0">
        <CounsellorTopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

    
        <main className="flex-1 overflow-y-auto p-2 md:p-2">
          {children}
        </main>
      </div>
    </div>
  )
}