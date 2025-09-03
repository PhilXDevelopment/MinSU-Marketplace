"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import Link from "next/link"
import {
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  Bell,
  Search,
  Plus,
  ChevronRight,
  Clock,
  Tag,
  ThumbsUp,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  useEffect(() => {
    // Fetch dashboard data from API
    async function fetchDashboardData() {
      if (!user) return;
      
      try {
        const res = await fetch(`/api/dashboard?userId=${user.id}`)
        const json = await res.json()
        if (json.success) {
          setDashboardData(json.data)
        }
      } catch (err) {
        // Optionally handle error
      }
      setIsLoading(false)
    }
    fetchDashboardData()
  }, [user])

  if (!user) {
    return null
  }

  // Show loading state
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 relative">
        <div className="container mx-auto px-4 relative">
          {/* Welcome Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user.name.split(" ")[0]}</h1>
                <p className="text-gray-600 mt-1">Here's what's happening in your MinSU world today</p>
              </div>
              <div>
                <Button className="rounded-full bg-green-600 hover:bg-green-700 text-white">
                  <Bell className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Notifications</span>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatsCard
              title="Your Points"
              value={user.points.toString()}
              description={`${user.rank} Rank`}
              icon={<TrendingUp className="h-5 w-5 text-green-600" />}
              footer={
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress to next rank</span>
                    <span className="font-medium">
                      {user.rank === "Newbie"
                        ? `${user.points}/50`
                        : user.rank === "Helper"
                          ? `${user.points}/150`
                          : `${user.points}/300`}
                    </span>
                  </div>
                  <Progress
                    value={
                      user.rank === "Newbie"
                        ? (user.points / 50) * 100
                        : user.rank === "Helper"
                          ? (user.points / 150) * 100
                          : (user.points / 300) * 100
                    }
                    className="h-1.5 bg-gray-100"
                  />
                </div>
              }
            />
            <StatsCard
              title="Marketplace"
              value={dashboardData?.statistics.products?.toString() || "0"}
              description="Active listings"
              icon={<ShoppingBag className="h-5 w-5 text-amber-600" />}
              footer={<div className="mt-3 text-xs text-gray-500">Total products in marketplace</div>}
            />
            <StatsCard
              title="Forum Activity"
              value={dashboardData?.statistics.orders?.toString() || "0"}
              description="Orders placed"
              icon={<MessageSquare className="h-5 w-5 text-green-600" />}
              footer={<div className="mt-3 text-xs text-gray-500">Total orders</div>}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left and Center */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <motion.div
                className="bg-gradient-to-r from-green-600 to-amber-600 rounded-xl overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="p-6 text-white">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <QuickActionButton
                      icon={<ShoppingBag className="h-5 w-5" />}
                      label="Sell Item"
                      href="/marketplace/sell"
                    />
                    <QuickActionButton
                      icon={<MessageSquare className="h-5 w-5" />}
                      label="Ask Question"
                      href="/forum/ask"
                    />
                    <QuickActionButton icon={<Search className="h-5 w-5" />} label="Browse Items" href="/marketplace" />
                    <QuickActionButton icon={<User className="h-5 w-5" />} label="My Profile" href="/user/me" />
                  </div>
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                  <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                    View All <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <div className="divide-y divide-gray-100">
                  {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
                    dashboardData.recentActivities.map((activity: any) => {
                      const getActivityIcon = () => {
                        switch (activity.type) {
                          case 'forum_answer':
                            return <MessageSquare className="h-4 w-4 text-blue-500" />;
                          case 'product_listing':
                            return <ShoppingBag className="h-4 w-4 text-green-500" />;
                          case 'forum_upvote':
                            return <ThumbsUp className="h-4 w-4 text-orange-500" />;
                          default:
                            return <MessageSquare className="h-4 w-4 text-blue-500" />;
                        }
                      };

                      const getActivityColor = () => {
                        switch (activity.type) {
                          case 'forum_answer':
                            return 'bg-blue-50';
                          case 'product_listing':
                            return 'bg-green-50';
                          case 'forum_upvote':
                            return 'bg-orange-50';
                          default:
                            return 'bg-blue-50';
                        }
                      };

                      const formatTimeAgo = (date: string) => {
                        const now = new Date();
                        const activityDate = new Date(date);
                        const diffInSeconds = Math.floor((now.getTime() - activityDate.getTime()) / 1000);

                        if (diffInSeconds < 60) return 'just now';
                        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
                        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
                        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
                        return activityDate.toLocaleDateString();
                      };

                      return (
                        <div key={activity.id} className="px-6 py-4 flex items-start">
                          <div className={`p-2 rounded-full mr-3 ${getActivityColor()}`}>
                            {getActivityIcon()}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-800 text-sm font-medium">
                              <Link href={`/user/${activity.user_id}`} className="hover:underline text-[#004D40]">
                                {activity.username}
                              </Link>{' '}
                              {activity.title}
                            </p>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3 w-3 text-gray-400 mr-1" />
                              <p className="text-xs text-gray-500">{formatTimeAgo(activity.created_at)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-6 py-8 text-center text-gray-500">
                      No recent activities found. Start participating in the community!
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Marketplace Preview */}
              <motion.div
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Your Marketplace</h2>
                  <Link href="/marketplace">
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                      View All <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dashboardData?.recentProducts && dashboardData.recentProducts.length > 0 ? (
                      dashboardData.recentProducts.map((item: any, index: number) => (
                        <div
                          key={item.id}
                          className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-all"
                        >
                          <div className="flex">
                            <div className="w-20 h-20 relative">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                fill
                                style={{ objectFit: "cover" }}
                              />
                            </div>
                            <div className="p-3 flex-1">
                              <h3 className="font-medium text-gray-800 line-clamp-1">{item.name}</h3>
                              <p className="text-green-600 font-bold text-sm">₱{item.price}</p>
                              <div className="flex items-center mt-1 justify-between">
                                <span className="text-xs text-gray-500">Seller: {item.seller_name}</span>
                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                                  Active
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-500 py-8">
                        No products found. Start selling by listing a new item!
                      </div>
                    )}
                    <Link href="/marketplace/sell" className="col-span-full">
                      <Button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200">
                        <Plus className="h-4 w-4 mr-2" /> List New Item
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Right */}
            <div className="space-y-6">
              {/* User Profile Card */}
              <motion.div
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="h-24 bg-gradient-to-r from-green-600 to-amber-600"></div>
                <div className="px-6 pb-6 -mt-12">
                  <div className="flex justify-center">
                    <Link href="/user/me">
                      <Avatar className="h-24 w-24 border-4 border-white bg-green-600 text-white text-xl cursor-pointer hover:shadow-lg transition-all">
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                  </div>
                  <div className="text-center mt-3">
                    <Link href="/user/me">
                      <h3 className="font-bold text-gray-800 text-lg hover:text-[#004D40] transition-colors">
                        {user.name}
                      </h3>
                    </Link>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                      {user.rank}
                    </div>
                    <div className="mt-4">
                      <Link href="/user/me">
                        <Button
                          variant="outline"
                          className="w-full border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                        >
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Hot Forum Topics */}
              <motion.div
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Hot Topics</h2>
                  <Link href="/forum">
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                      View All <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {dashboardData?.hotTopics && dashboardData.hotTopics.length > 0 ? (
                    dashboardData.hotTopics.map((topic: any) => (
                      <div key={topic.id} className="px-6 py-4">
                        <Link href={`/forum/question/${topic.id}`}>
                          <h3 className="font-medium text-gray-800 hover:text-green-600 transition-colors line-clamp-1">
                            {topic.title}
                          </h3>
                        </Link>
                        <div className="flex mt-2 gap-2">
                          {topic.tags?.split(',').map((tag: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {tag.trim()}
                            </div>
                          ))}
                        </div>
                        <div className="flex mt-2 text-xs text-gray-500 justify-between">
                          <div>
                            <span className="mr-4">{topic.answer_count} replies</span>
                            <span>{topic.upvote_count} upvotes</span>
                          </div>
                          <Link href={`/user/${topic.user_id}`} className="text-[#004D40] hover:underline">
                            View author
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-6 py-8 text-center text-gray-500">
                      No hot topics found. Be the first to start a discussion!
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function StatsCard({
  title,
  value,
  description,
  icon,
  footer,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold">{value}</p>
              <CardDescription className="ml-2">{description}</CardDescription>
            </div>
          </div>
          <div className="p-2 rounded-full bg-green-50">{icon}</div>
        </div>
      </CardHeader>
      {footer && <CardContent>{footer}</CardContent>}
    </Card>
  )
}

function QuickActionButton({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode
  label: string
  href: string
}) {
  return (
    <Link href={href}>
      <div className="bg-white/10 hover:bg-white/20 rounded-lg p-4 text-center transition-all cursor-pointer">
        <div className="flex justify-center mb-2">{icon}</div>
        <p className="text-sm font-medium">{label}</p>
      </div>
    </Link>
  )
}
