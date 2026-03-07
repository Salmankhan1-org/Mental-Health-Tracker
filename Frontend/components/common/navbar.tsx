"use client"

import {  useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, X, Heart } from "lucide-react"
import {  useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CiLogout } from "react-icons/ci";
import { useLogout } from "@/hooks/use-logout"

const navLinks = [
  { href: "/student", label: "Home" },
  { href: "/student/dashboard", label: "Dashboard" },
  { href: "/student/chat", label: "AI Support" },
  { href: "/student/resources", label: "Wellness" },
  { href: "/student/counselors", label: "Counselors" },
]

export function Navbar() {
  const [open, setOpen] = useState(false);
  const {user} = useSelector((state:RootState)=>state?.auth);
  const logout = useLogout();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            MindBridge
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
            {user?.profileImage ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={user?.profileImage}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={logout}>
                  <div className="flex w-full gap-2 px-2 items-center hover:text-white">
                    <CiLogout className="hover:text-white"/>
                    <span>Logout</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                asChild
              >
              <Link href={'/auth'}>
                Sign In
              </Link>
              </Button>
            )}
          <Button size="sm" asChild>
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen} >
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-6 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>
                  MindBridge
                </span>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-2 pt-4 mx-2 border-t border-border">
                  {user?.profileImage ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2 items-center">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <img
                          src={user.profileImage}
                          alt="User Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium">{user.name}</p>
                    </div>

                    <Button
                      size="sm"
                      onClick={logout}
                      className="cursor-pointer bg-red-600 hover:bg-red-500 transition-colors duration-300"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    asChild
                  >
                  <Link href={'/auth'}>
                    Signin
                  </Link>
                  </Button>
                )}
                <Button asChild>
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
