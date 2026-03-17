'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Bell, Menu, Settings, LogOut, LayoutGrid, Calendar, Clock, User, Sparkles } from 'lucide-react'
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
import { toast } from 'sonner'
import axios from 'axios'
import { ApiErrorResponse } from '@/types/types'
import { clearUser } from '@/features/users/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { CiLogout } from 'react-icons/ci'
import { useLogout } from '@/hooks/use-logout'
import { RootState } from '@/redux/store'

interface CounsellorTopBarProps {
  onToggleSidebar: () => void
}

const pageNames: Record<string, string> = {
  '/counsellor/dashboard': 'Dashboard',
  '/counsellor/appointments': 'Appointments',
  '/counsellor/availability': 'Availability',
  '/counsellor/profile': 'Profile',
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

export function CounsellorTopBar({ onToggleSidebar }: CounsellorTopBarProps) {
  const pathname = usePathname()
  const pageTitle = pageNames[pathname] || 'Dashboard'
  const logout = useLogout();
  const {user} = useSelector((state:RootState)=>state?.auth);

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
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
                  <span className="text-lg font-bold text-foreground">MindBridge</span>
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
                <Button
                  onClick={logout}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="gap-2 flex items-center cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"} />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">{user?.name || "Dr. Sarah Smith"}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profileImage || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"} />
                  <AvatarFallback>DR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user?.name || "Dr. Sarah Smith"}</p>
                  {/* <p className="text-xs text-muted-foreground">Clinical Psychologist</p> */}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer text-destructive">
                <div onClick={logout} className="flex w-full gap-2 px-2 items-center hover:text-white">
                  <CiLogout className="hover:text-white"/>
                  <span>Logout</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
