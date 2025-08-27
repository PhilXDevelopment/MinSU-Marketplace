"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function ProfileRedirect() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Redirect to the new user profile page
      router.push("/user/me")
    } else {
      router.push("/auth/login")
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-16 flex items-center justify-center">
      <div className="animate-pulse text-xl text-gray-500">Redirecting to profile...</div>
    </div>
  )
}
