"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AdminAuthRedirect() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if admin is logged in
    const adminUser = localStorage.getItem("minsu-admin-user")

    if (adminUser) {
      // Redirect to dashboard
      router.push("/admin/dashboard")
    } else {
      // Redirect to admin login
      router.push("/auth/admin")
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 text-amber-600 animate-spin" />
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
