'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Calendar, Clock, User, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLogout } from '@/hooks/use-logout'
import { CiLogout } from 'react-icons/ci'

interface CounsellorSidebarProps {
  open: boolean
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/counsellor/dashboard',
    icon: LayoutGrid,
  },
  {
    label: 'Appointments',
    href: '/counsellor/appointments',
    icon: Calendar,
  },
  {
    label: 'Availability',
    href: '/counsellor/availability',
    icon: Clock,
  },
  {
    label: 'Profile',
    href: '/counsellor/profile',
    icon: User,
  },
]

export function CounsellorSidebar({ open }: CounsellorSidebarProps) {
  const pathname = usePathname();
  const logout = useLogout();

  return (
    <aside
      className={cn(
        'hidden md:flex md:flex-col h-screen border-r border-border bg-sidebar transition-all duration-300 ease-in-out shrink-0',
        open ? 'w-64' : 'w-20'
      )}
    >
      <div className="flex flex-col h-full p-4">
        {/* Logo */}
        <div className="mb-8 flex items-center gap-2">
          <div className="rounded-lg bg-primary p-2">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          {open && (
            <span className="text-lg font-bold text-sidebar-foreground">MindBridge</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {open && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Logout Button */}
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="w-full gap-2"
        >
          <CiLogout className="h-4 w-4" />
          {open && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  )
}
