"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, ShoppingBag, Activity, AlertTriangle, CheckCircle, Clock, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { toast } = useToast()
  const router = useRouter()

  // Function to handle approving items
  const handleApprove = (itemType: string, itemId: number) => {
    toast({
      title: `${itemType} Approved`,
      description: `${itemType} #${itemId} has been approved successfully.`,
    })
  }

  // Function to handle rejecting items
  const handleReject = (itemType: string, itemId: number) => {
    toast({
      title: `${itemType} Rejected`,
      description: `${itemType} #${itemId} has been rejected.`,
      variant: "destructive",
    })
  }

  // Function to handle reviewing items
  const handleReview = (itemType: string, itemId: number) => {
    toast({
      title: "Reviewing Content",
      description: `Now reviewing ${itemType} #${itemId}.`,
    })
  }

  // Function to navigate to moderation page
  const navigateToModeration = () => {
    router.push("/admin/moderation")
  }

  return (
    <div className="p-6">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the MinSU Marketplace admin dashboard.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <StatsCard
          title="Total Users"
          value="0"
          description="0 this week"
          icon={<Users className="h-5 w-5 text-blue-600" />}
          trend="neutral"
          onClick={() => router.push("/admin/users")}
        />
        <StatsCard
          title="Active Listings"
          value="0"
          description="0 new today"
          icon={<ShoppingBag className="h-5 w-5 text-green-600" />}
          trend="neutral"
          onClick={() => router.push("/admin/moderation?tab=products")}
        />
        <StatsCard
          title="Active Disputes"
          value="0"
          description="0 resolved today"
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
          trend="neutral"
          onClick={() => router.push("/admin/disputes")}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="approvals">Pending Approvals</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.2%</div>
                <p className="text-xs text-muted-foreground">Uptime in the last 30 days</p>
                <div className="mt-4 h-4 w-full rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "98.2%" }}></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Engagement</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+12.5%</div>
                <p className="text-xs text-muted-foreground">Increase in active users this month</p>
                <div className="mt-4 grid grid-cols-7 gap-1">
                  {[30, 45, 28, 50, 40, 60, 65].map((height, i) => (
                    <div key={i} className="bg-blue-500 rounded-md" style={{ height: `${height}px` }}></div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Categories</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Electronics</span>
                        <span className="text-sm font-medium">32%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "32%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Books</span>
                        <span className="text-sm font-medium">28%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: "28%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Furniture</span>
                        <span className="text-sm font-medium">18%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: "18%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Items waiting for admin approval</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="products">
                <TabsList className="mb-4">
                  <TabsTrigger value="products">Products (8)</TabsTrigger>
                  <TabsTrigger value="sellers">Sellers (3)</TabsTrigger>
                  <TabsTrigger value="reports">Reports (5)</TabsTrigger>
                </TabsList>

                <TabsContent value="products">
                  <div className="space-y-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                          <div>
                            <h4 className="font-medium">Product Name #{item}</h4>
                            <p className="text-sm text-gray-500">Listed by: Seller #{item}</p>
                            <p className="text-sm font-medium text-green-600">
                              ₱{(Math.floor(Math.random() * 5000) + 500).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                            onClick={() => handleApprove("Product", item)}
                          >
                            Approve
                          </Button>
                          <Button
                            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                            onClick={() => handleReject("Product", item)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end mt-4">
                      <Button onClick={navigateToModeration}>View All Pending Products</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sellers">
                  <div className="space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                          <div>
                            <h4 className="font-medium">Seller Name #{item}</h4>
                            <p className="text-sm text-gray-500">Joined: March {item + 10}, 2023</p>
                            <p className="text-sm text-gray-500">
                              Location: {["Calapan", "Bongabong", "Victoria"][item % 3]}, Oriental Mindoro
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                            onClick={() => handleApprove("Seller", item)}
                          >
                            Approve
                          </Button>
                          <Button
                            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                            onClick={() => handleReject("Seller", item)}
                          >
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end mt-4">
                      <Button onClick={() => router.push("/admin/sellers")}>View All Sellers</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reports">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-800 rounded-md">
                            <AlertTriangle size={20} />
                          </div>
                          <div>
                            <h4 className="font-medium">Reported Content #{item}</h4>
                            <p className="text-sm text-gray-500">Reported by: User #{item * 3}</p>
                            <p className="text-sm text-gray-500">
                              Campus: {["Main Campus", "Calapan Campus", "Bongabong Campus"][item % 3]}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                            onClick={() => handleReview("Report", item)}
                          >
                            Review
                          </Button>
                          <Button
                            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                            onClick={() => handleReject("Report", item)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-end mt-4">
                      <Button onClick={navigateToModeration}>View All Reports</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <ActivityItem
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                  title="New product approved"
                  description="MacBook Pro 2023 was approved by Admin"
                  timestamp="2 minutes ago"
                  onClick={() =>
                    toast({
                      title: "Activity Details",
                      description: "Viewing details for MacBook Pro 2023 approval.",
                    })
                  }
                />
                <ActivityItem
                  icon={<Users className="h-5 w-5 text-blue-500" />}
                  title="New user registered"
                  description="John Doe created a new account"
                  timestamp="15 minutes ago"
                  onClick={() => router.push("/admin/users/john-doe")}
                />
                <ActivityItem
                  icon={<AlertTriangle className="h-5 w-5 text-yellow-500" />}
                  title="Dispute opened"
                  description="Order #12345 has a new dispute"
                  timestamp="1 hour ago"
                  onClick={() => router.push("/admin/disputes")}
                />
                <ActivityItem
                  icon={<ShoppingBag className="h-5 w-5 text-purple-500" />}
                  title="New order placed"
                  description="Order #12346 was placed for ₱3,499"
                  timestamp="3 hours ago"
                  onClick={() =>
                    toast({
                      title: "Order Details",
                      description: "Viewing details for Order #12346.",
                    })
                  }
                />
                <ActivityItem
                  icon={<CheckCircle className="h-5 w-5 text-green-500" />}
                  title="Payment processed"
                  description="Payment for order #12340 was processed"
                  timestamp="5 hours ago"
                  onClick={() =>
                    toast({
                      title: "Payment Details",
                      description: "Viewing payment details for Order #12340.",
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend: "up" | "down" | "neutral"
  onClick?: () => void
}

function StatsCard({ title, value, description, icon, trend, onClick }: StatsCardProps) {
  return (
    <Card className={onClick ? "cursor-pointer transition-all hover:shadow-md" : ""} onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <span className="text-2xl font-bold">{value}</span>
          </div>
          <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          {trend === "up" ? (
            <span className="text-green-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                <path
                  fillRule="evenodd"
                  d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                  clipRule="evenodd"
                />
              </svg>
              {description}
            </span>
          ) : trend === "down" ? (
            <span className="text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1">
                <path
                  fillRule="evenodd"
                  d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-.916.384l-4.573-1.435a.75.75 0 01.45-1.43l3.317 1.041a19.422 19.422 0 00-3.058-6.024l-3.428 3.428a.75.75 0 01-1.06 0L1.22 6.282a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
              {description}
            </span>
          ) : (
            <span className="text-gray-600">{description}</span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

interface ActivityItemProps {
  icon: React.ReactNode
  title: string
  description: string
  timestamp: string
  onClick?: () => void
}

function ActivityItem({ icon, title, description, timestamp, onClick }: ActivityItemProps) {
  return (
    <div className={`flex ${onClick ? "cursor-pointer hover:bg-gray-50 p-2 rounded-md -mx-2" : ""}`} onClick={onClick}>
      <div className="mr-4">{icon}</div>
      <div className="space-y-1">
        <p className="text-sm font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          {timestamp}
        </p>
      </div>
    </div>
  )
}
