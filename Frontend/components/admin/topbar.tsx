'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bell,
  Menu,
  Settings,
  LogOut,
  LayoutGrid,
  Users,
  Stethoscope,
  FileCheck,
  Calendar,
  AlertTriangle,
  BarChart3,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { useLogout } from '@/hooks/use-logout'

interface AdminTopBarProps {
  onToggleSidebar: () => void
}

const pageNames: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/users': 'Users',
  '/admin/counsellors': 'Counsellors',
  '/admin/counsellor-requests': 'Counsellor Requests',
  '/admin/appointments': 'Appointments',
  '/admin/reports': 'Reports',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings',
}

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutGrid },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Counsellors', href: '/admin/counsellors', icon: Stethoscope },
  { label: 'Counsellor Requests', href: '/admin/counsellor-requests', icon: FileCheck },
  { label: 'Appointments', href: '/admin/appointments', icon: Calendar },
  { label: 'Reports', href: '/admin/reports', icon: AlertTriangle },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminTopBar({ onToggleSidebar }: AdminTopBarProps) {
  const pathname = usePathname()
  const pageTitle = pageNames[pathname] || 'Admin Panel'
    const {user} = useSelector((state:RootState)=>state?.auth);
    const logout = useLogout();

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between p-2 md:px-4">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="flex flex-col h-full p-4">
                {/* Logo */}
                <div className="mb-8 flex items-center gap-2">
                  <div className="rounded-lg bg-primary p-2">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-foreground">MindBridge</span>
                    <p className="text-xs text-muted-foreground">Admin</p>
                  </div>
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
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-secondary'
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </nav>

                {/* Logout Button */}
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg md:text-xl font-bold text-foreground">{pageTitle}</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-2 py-2">
                <p className="text-sm font-semibold text-foreground mb-3">Notifications</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer">
                    <div className="mt-1 h-2 w-2 bg-destructive rounded-full shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">Critical Report Filed</p>
                      <p className="text-xs text-muted-foreground">Breach of confidentiality</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-secondary cursor-pointer">
                    <div className="mt-1 h-2 w-2 bg-accent rounded-full shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">New Counsellor Request</p>
                      <p className="text-xs text-muted-foreground">2 new applications pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
