"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function AdminDebugPage() {
  const [authStatus, setAuthStatus] = useState<string>("Checking...")
  const [adminUser, setAdminUser] = useState<any>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check authentication status
    try {
      const isAuth = localStorage.getItem("minsu-admin-auth") === "true"
      setAuthStatus(isAuth ? "Authenticated" : "Not authenticated")

      const userData = localStorage.getItem("minsu-admin-user")
      if (userData) {
        setAdminUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error checking auth:", error)
      setAuthStatus("Error checking authentication")
    }
  }, [])

  const handleLogin = () => {
    // Set authentication
    localStorage.setItem("minsu-admin-auth", "true")
    localStorage.setItem(
      "minsu-admin-user",
      JSON.stringify({
        email: "admin@minsu.edu.ph",
        name: "Admin User",
        role: "Admin",
        avatar: "A",
      }),
    )

    toast({
      title: "Debug Login",
      description: "Admin authentication set successfully",
    })

    // Refresh the page
    window.location.reload()
  }

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem("minsu-admin-auth")
    localStorage.removeItem("minsu-admin-user")

    toast({
      title: "Debug Logout",
      description: "Admin authentication cleared successfully",
    })

    // Refresh the page
    window.location.reload()
  }

  const goToDashboard = () => {
    router.push("/admin/dashboard")
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Admin Authentication Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p>
              <strong>Authentication Status:</strong> {authStatus}
            </p>
            {adminUser && (
              <div className="mt-4">
                <p>
                  <strong>Admin User:</strong>
                </p>
                <pre className="bg-gray-100 p-4 rounded mt-2">{JSON.stringify(adminUser, null, 2)}</pre>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <Button onClick={handleLogin} variant="default">
              Set Admin Auth
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              Clear Admin Auth
            </Button>
            <Button onClick={goToDashboard} variant="outline">
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
