"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import {fetchCurrentUser} from '../../features/users/authThunk'

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCurrentUser() as any)
  }, [dispatch])

  return <>{children}</>
}