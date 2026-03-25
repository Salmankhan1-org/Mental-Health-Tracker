'use client'

import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminTopBar } from '@/components/admin/topbar'
import { useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background overflow-hidden">

      <AdminSidebar open={sidebarOpen} />

      <div className="flex flex-1 flex-col overflow-hidden transition-all duration-300">

        <AdminTopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 overflow-y-auto p-2 md:p-4">
          {children}
        </main>

      </div>
    </div>
  )
}