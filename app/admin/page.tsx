"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminRedirectPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if admin is authenticated
    const isAuth = localStorage.getItem("minsu-admin-auth") === "true"

    if (isAuth) {
      // If authenticated, redirect to dashboard
      router.push("/admin/dashboard")
    } else {
      // If not authenticated, redirect to login
      router.push("/auth/admin")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin h-8 w-8 border-4 border-amber-600 rounded-full border-t-transparent"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
