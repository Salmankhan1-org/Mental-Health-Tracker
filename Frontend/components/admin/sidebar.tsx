'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutGrid,
  Users,
  Stethoscope,
  FileCheck,
  Calendar,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useLogout } from '@/hooks/use-logout'

interface AdminSidebarProps {
  open: boolean
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutGrid,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Counsellors',
    href: '/admin/counsellors',
    icon: Stethoscope,
  },
  {
    label: 'Counsellor Requests',
    href: '/admin/counsellor-requests',
    icon: FileCheck,
  },
  {
    label: 'Appointments',
    href: '/admin/appointments',
    icon: Calendar,
  },
  {
    label: 'Reports',
    href: '/admin/reports',
    icon: AlertTriangle,
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
]

export function AdminSidebar({ open }: AdminSidebarProps) {
  const pathname = usePathname()
  const logout = useLogout();

  return (
    <aside
      className={cn(
        'hidden md:flex md:flex-col h-screen border-r border-border bg-sidebar transition-all duration-300 ease-in-out flex-shrink-0',
        open ? 'w-64' : 'w-20'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-border p-4">
        <div className="rounded-lg bg-primary p-2 shrink-0">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        {open && (
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">MindBridge</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-secondary'
              )}
              title={!open ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {open && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t border-border p-4">
        <Button
            onClick={logout}
            variant="outline"
            size={open ? 'sm' : 'icon'}
            className={cn('w-full', !open && 'px-0')}
            >
            <LogOut className="h-4 w-4" />
            {open && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  )
}
