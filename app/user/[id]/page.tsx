"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  User,
  Calendar,
  MapPin,
  Mail,
  LinkIcon,
  MessageSquare,
  ShoppingBag,
  TrendingUp,
  Star,
  Award,
  ThumbsUp,
} from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getUserById, type UserProfile } from "@/data/users"

export default function UserProfilePage() {
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const [profileUser, setProfileUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Fetch user data based on the ID parameter
    const userId = params.id as string

    if (userId === "me") {
      // If the ID is "me", show the current user's profile
      // In a real app, this would be the actual logged-in user data
      setProfileUser({
        id: "current_user",
        name: user.name,
        email: user.email,
        avatar: user.name.charAt(0),
        rank: user.rank,
        points: user.points,
        joinedDate: "February 2025",
        campus: "Main Campus",
        department: "Computer Science",
        github: "github.com/username",
        isOnline: true,
        lastSeen: null,
        forumAnswers: 12,
        itemsListed: 5,
        itemsPurchased: 3,
        badges: [
          { name: "Helpful Answer", icon: "🏆", color: "bg-yellow-100" },
          { name: "Quick Responder", icon: "⚡", color: "bg-blue-100" },
          { name: "Top Seller", icon: "💰", color: "bg-green-100" },
          { name: "Community Builder", icon: "🤝", color: "bg-purple-100" },
        ],
        activities: [
          { type: "forum", title: "You answered a question about Calculus", time: "2 days ago" },
          { type: "marketplace", title: "You listed 'Scientific Calculator' for sale", time: "4 days ago" },
          { type: "marketplace", title: "You purchased 'Chemistry Textbook'", time: "1 week ago" },
          { type: "forum", title: "Your answer received 5 upvotes", time: "1 week ago" },
          { type: "achievement", title: "You earned the 'Helpful Answer' badge", time: "2 weeks ago" },
        ],
      })
    } else {
      // Find user by ID
      const foundUser = getUserById(userId)

      if (foundUser) {
        setProfileUser(foundUser)
      } else {
        // If user not found, redirect to dashboard
        router.push("/dashboard")
        return
      }
    }

    setIsLoading(false)
  }, [user, router, params.id])

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-24 pb-16 flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-500">Loading profile...</div>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-[#f8fafc] pt-24 pb-16 flex items-center justify-center">
        <div className="text-xl text-gray-500">User not found</div>
      </div>
    )
  }

  const isOwnProfile = profileUser.id === "current_user" || profileUser.email === user.email

  return (
    <div className="min-h-screen bg-[#f8fafc] pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Sidebar */}
          <motion.div
            className="w-full lg:w-1/4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-none shadow-sm overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-[#004D40] to-[#00695C]"></div>
              <div className="px-6 pb-6 -mt-16">
                <div className="flex justify-center">
                  <Avatar className="h-32 w-32 border-4 border-white bg-[#004D40] text-white text-4xl">
                    <AvatarFallback>{profileUser.avatar}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center mt-4">
                  <h2 className="text-2xl font-bold text-gray-800">{profileUser.name}</h2>
                  <p className="text-gray-500 text-sm">{profileUser.email}</p>
                  <div className="mt-3 inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                    {profileUser.rank}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Points</span>
                    <span className="font-medium">{profileUser.points}</span>
                  </div>
                  <Progress
                    value={
                      profileUser.rank === "Newbie"
                        ? (profileUser.points / 50) * 100
                        : profileUser.rank === "Helper"
                          ? (profileUser.points / 150) * 100
                          : (profileUser.points / 300) * 100
                    }
                    className="h-2"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {profileUser.rank === "Newbie"
                      ? `${50 - profileUser.points} more points to become a Helper`
                      : profileUser.rank === "Helper"
                        ? `${150 - profileUser.points} more points to become an Expert`
                        : "Highest rank achieved!"}
                  </p>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-3 text-gray-400" />
                    <span>Joined {profileUser.joinedDate}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{profileUser.campus}</span>
                  </div>
                  {profileUser.department && (
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-3 text-gray-400" />
                      <span>{profileUser.department}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                    <span>{profileUser.email}</span>
                  </div>
                  {profileUser.github && (
                    <div className="flex items-center text-sm text-gray-600">
                      <LinkIcon className="h-4 w-4 mr-3 text-gray-400" />
                      <a href="#" className="text-[#004D40] hover:underline">
                        {profileUser.github}
                      </a>
                    </div>
                  )}
                </div>

                {!isOwnProfile && (
                  <div className="mt-6 space-y-2">
                    <Link href={`/messages/${profileUser.id}`}>
                      <Button className="w-full bg-[#004D40] hover:bg-[#00352C] text-white">
                        <MessageSquare className="h-4 w-4 mr-2" /> Message
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>

            {isOwnProfile && (
              <Card className="border-none shadow-sm mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <nav className="space-y-1">
                    <ProfileNavItem icon={<User size={18} />} label="My Profile" href="/user/me" isActive />
                    <ProfileNavItem icon={<MessageSquare size={18} />} label="Messages" href="/messages" />
                    <ProfileNavItem icon={<ShoppingBag size={18} />} label="My Listings" href="/profile/listings" />
                    <ProfileNavItem icon={<Award size={18} />} label="Achievements" href="/profile/achievements" />
                  </nav>
                </CardContent>
              </Card>
            )}
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="overview" className="w-full">
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <TabsList className="grid grid-cols-3 w-full max-w-md">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Forum Answers",
                      value: profileUser.forumAnswers.toString(),
                      icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
                      color: "bg-blue-50",
                    },
                    {
                      title: "Items Listed",
                      value: profileUser.itemsListed.toString(),
                      icon: <ShoppingBag className="h-5 w-5 text-green-500" />,
                      color: "bg-green-50",
                    },
                    {
                      title: "Items Purchased",
                      value: profileUser.itemsPurchased.toString(),
                      icon: <TrendingUp className="h-5 w-5 text-purple-500" />,
                      color: "bg-purple-50",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      className={`${stat.color} p-6 rounded-xl`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-600 text-sm">{stat.title}</p>
                          <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        </div>
                        <div className="p-3 rounded-full bg-white">{stat.icon}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Badges & Achievements */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle>Badges & Achievements</CardTitle>
                    <CardDescription>Rewards earned through contributions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      {profileUser.badges.map((badge, index) => (
                        <motion.div
                          key={index}
                          className={`${badge.color} p-4 rounded-xl text-center w-24`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <div className="text-2xl mb-2">{badge.icon}</div>
                          <p className="text-xs font-medium">{badge.name}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest interactions on Rumie</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {profileUser.activities.map((activity, index) => (
                        <motion.div
                          key={index}
                          className="flex items-start"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        >
                          <div
                            className={`p-2 rounded-full mr-4 ${
                              activity.type === "forum"
                                ? "bg-blue-100"
                                : activity.type === "marketplace"
                                  ? "bg-green-100"
                                  : "bg-yellow-100"
                            }`}
                          >
                            {activity.type === "forum" ? (
                              <MessageSquare className="h-5 w-5 text-blue-500" />
                            ) : activity.type === "marketplace" ? (
                              <ShoppingBag className="h-5 w-5 text-green-500" />
                            ) : (
                              <Star className="h-5 w-5 text-yellow-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-gray-800">{activity.title}</p>
                            <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="mt-0">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                    <CardDescription>A detailed history of interactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Activity Timeline */}
                      <div className="relative border-l-2 border-gray-200 pl-6 ml-3">
                        {profileUser.activities.map((activity, index) => {
                          let icon, iconBg, title, description

                          if (activity.type === "forum" && activity.title.includes("upvotes")) {
                            icon = <ThumbsUp className="h-5 w-5 text-white" />
                            iconBg = "bg-orange-500"
                            title = "Received upvotes"
                            description = activity.title
                          } else if (activity.type === "forum") {
                            icon = <MessageSquare className="h-5 w-5 text-white" />
                            iconBg = "bg-blue-500"
                            title = "Forum activity"
                            description = activity.title
                          } else if (activity.type === "marketplace" && activity.title.includes("purchased")) {
                            icon = <TrendingUp className="h-5 w-5 text-white" />
                            iconBg = "bg-purple-500"
                            title = "Purchased an item"
                            description = activity.title
                          } else if (activity.type === "marketplace") {
                            icon = <ShoppingBag className="h-5 w-5 text-white" />
                            iconBg = "bg-green-500"
                            title = "Listed an item"
                            description = activity.title
                          } else {
                            icon = <Award className="h-5 w-5 text-white" />
                            iconBg = "bg-yellow-500"
                            title = "Earned a badge"
                            description = activity.title
                          }

                          return (
                            <div key={index} className="mb-8 relative">
                              <div className={`absolute -left-10 p-2 rounded-full ${iconBg}`}>{icon}</div>
                              <div className="mb-1">
                                <h3 className="text-lg font-medium">{title}</h3>
                                <p className="text-gray-600">{description}</p>
                              </div>
                              <span className="text-sm text-gray-500">{activity.time}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stats" className="mt-0">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>User Stats</CardTitle>
                    <CardDescription>Detailed statistics about activity</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Forum Activity</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Questions Asked</span>
                            <span className="font-medium">{Math.floor(profileUser.forumAnswers * 0.7)}</span>
                          </div>
                          <Progress value={40} className="h-2" />

                          <div className="flex justify-between mt-3">
                            <span className="text-gray-600">Answers Provided</span>
                            <span className="font-medium">{profileUser.forumAnswers}</span>
                          </div>
                          <Progress value={60} className="h-2" />

                          <div className="flex justify-between mt-3">
                            <span className="text-gray-600">Upvotes Received</span>
                            <span className="font-medium">{Math.floor(profileUser.forumAnswers * 3.5)}</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Marketplace Activity</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Items Listed</span>
                            <span className="font-medium">{profileUser.itemsListed}</span>
                          </div>
                          <Progress value={50} className="h-2" />

                          <div className="flex justify-between mt-3">
                            <span className="text-gray-600">Items Sold</span>
                            <span className="font-medium">{Math.floor(profileUser.itemsListed * 0.6)}</span>
                          </div>
                          <Progress value={60} className="h-2" />

                          <div className="flex justify-between mt-3">
                            <span className="text-gray-600">Items Purchased</span>
                            <span className="font-medium">{profileUser.itemsPurchased}</span>
                          </div>
                          <Progress value={40} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function ProfileNavItem({
  icon,
  label,
  href,
  isActive = false,
}: {
  icon: React.ReactNode
  label: string
  href: string
  isActive?: boolean
}) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center px-4 py-2 rounded-md cursor-pointer transition-colors ${
          isActive ? "bg-[#004D40] text-white" : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <span className="mr-3">{icon}</span>
        <span>{label}</span>
      </div>
    </Link>
  )
}
