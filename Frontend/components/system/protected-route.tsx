"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter()

  const {loading, isAuthenticated } = useSelector((state:RootState)=>state?.auth);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/auth")
    }
  }, [loading, isAuthenticated, router])

  // Prevent UI flicker while checking auth
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Checking authentication...
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}