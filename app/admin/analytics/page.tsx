"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  BarChart2,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("month")

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl text-gray-500">Loading analytics data...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics & Reports</h1>
          <p className="text-gray-600">Platform performance and statistics</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value="1,248"
          change="+12%"
          trend="up"
          description="vs. previous period"
          icon={<Users className="h-5 w-5 text-blue-500" />}
          color="bg-blue-50"
        />
        <StatsCard
          title="New Signups"
          value="156"
          change="+8%"
          trend="up"
          description="vs. previous period"
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          color="bg-green-50"
        />
        <StatsCard
          title="Total Orders"
          value="3,427"
          change="+15%"
          trend="up"
          description="vs. previous period"
          icon={<ShoppingCart className="h-5 w-5 text-purple-500" />}
          color="bg-purple-50"
        />
        <StatsCard
          title="Total Revenue"
          value="₱245,890"
          change="-5%"
          trend="down"
          description="vs. previous period"
          icon={<DollarSign className="h-5 w-5 text-amber-500" />}
          color="bg-amber-50"
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <TabsList className="mb-4 md:mb-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Range
            </Button>
            <Button variant="outline" size="sm">
              <ChevronDown className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="mt-0">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>Key metrics across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                <div className="text-center">
                  <BarChart2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Chart visualization would appear here</p>
                  <p className="text-sm text-gray-400">
                    Showing data for {timeRange === "day" ? "today" : `this ${timeRange}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-0">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>User Analytics</CardTitle>
              <CardDescription>User growth and engagement metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                <div className="text-center">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">User analytics visualization would appear here</p>
                  <p className="text-sm text-gray-400">
                    Showing data for {timeRange === "day" ? "today" : `this ${timeRange}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="mt-0">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Revenue and order metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                <div className="text-center">
                  <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Sales analytics visualization would appear here</p>
                  <p className="text-sm text-gray-400">
                    Showing data for {timeRange === "day" ? "today" : `this ${timeRange}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="mt-0">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Engagement Analytics</CardTitle>
              <CardDescription>User activity and interaction metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Engagement analytics visualization would appear here</p>
                  <p className="text-sm text-gray-400">
                    Showing data for {timeRange === "day" ? "today" : `this ${timeRange}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Top Sellers</CardTitle>
            <CardDescription>Best performing sellers by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Tech Haven", revenue: "₱45,890", orders: 124, growth: "+15%" },
                { name: "Book Nook", revenue: "₱32,450", orders: 98, growth: "+8%" },
                { name: "Campus Essentials", revenue: "₱28,760", orders: 87, growth: "+12%" },
                { name: "Furniture Plus", revenue: "₱21,340", orders: 65, growth: "-3%" },
                { name: "Electronics Hub", revenue: "₱18,920", orders: 54, growth: "+5%" },
              ].map((seller, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{seller.name}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{seller.orders} orders</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{seller.revenue}</p>
                    <div className="flex items-center justify-end text-sm">
                      {seller.growth.startsWith("+") ? (
                        <div className="flex items-center text-green-600">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          {seller.growth}
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600">
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                          {seller.growth}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle>Popular Products</CardTitle>
            <CardDescription>Most sold products by quantity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Scientific Calculator", category: "Electronics", sold: 87, revenue: "₱82,650" },
                { name: "Calculus Textbook", category: "Books", sold: 65, revenue: "₱78,000" },
                { name: "Wireless Headphones", category: "Electronics", sold: 54, revenue: "₱97,200" },
                { name: "Study Desk", category: "Furniture", sold: 42, revenue: "₱105,000" },
                { name: "Chemistry Lab Kit", category: "Lab Equipment", sold: 38, revenue: "₱17,100" },
              ].map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{product.revenue}</p>
                    <p className="text-sm text-gray-500">{product.sold} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  description: string
  icon: React.ReactNode
  color: string
}

function StatsCard({ title, value, change, trend, description, icon, color }: StatsCardProps) {
  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <div className="flex items-center mt-1">
              {trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {change}
              </span>
              <span className="text-xs text-gray-500 ml-1">{description}</span>
            </div>
          </div>
          <div className={`p-3 rounded-full ${color}`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}
