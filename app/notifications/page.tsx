"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Bell, ShoppingBag, MessageSquare, ThumbsUp, Clock, Check, X, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function NotificationsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [notifications, setNotifications] = useState([])
  const [selectedTab, setSelectedTab] = useState("all")
  const [filteredNotifications, setFilteredNotifications] = useState([])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  // Filter notifications based on selected tab
  useEffect(() => {
    if (selectedTab === "all") {
      setFilteredNotifications(notifications)
    } else if (selectedTab === "unread") {
      setFilteredNotifications(notifications.filter((notification) => !notification.isRead))
    } else {
      setFilteredNotifications(notifications.filter((notification) => notification.type === selectedTab))
    }
  }, [selectedTab, notifications])

  const handleMarkAsRead = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    )

    toast({
      title: "Notification marked as read",
      description: "This notification has been marked as read",
    })
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, isRead: true })),
    )

    toast({
      title: "All notifications marked as read",
      description: "All notifications have been marked as read",
    })
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id))

    toast({
      title: "Notification deleted",
      description: "This notification has been deleted",
    })
  }

  const handleClearAll = () => {
    setNotifications([])

    toast({
      title: "All notifications cleared",
      description: "All notifications have been cleared",
    })
  }

  const getUnreadCount = (type: string) => {
    if (type === "all") {
      return notifications.filter((notification) => !notification.isRead).length
    } else {
      return notifications.filter((notification) => notification.type === type && !notification.isRead).length
    }
  }

  if (!user) {
    return null // Don't render anything if redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="text-gray-600"
                  onClick={handleMarkAllAsRead}
                  disabled={!notifications.some((notification) => !notification.isRead)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-gray-600" disabled={notifications.length === 0}>
                      <X className="h-4 w-4 mr-2" />
                      Clear all
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. All notifications will be permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearAll} className="bg-red-600 hover:bg-red-700 text-white">
                        Clear all
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <Tabs defaultValue="all" onValueChange={setSelectedTab}>
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="all" className="relative">
                    All
                    {getUnreadCount("all") > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-green-600 text-white">
                        {getUnreadCount("all")}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="message" className="relative">
                    Messages
                    {getUnreadCount("message") > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-green-600 text-white">
                        {getUnreadCount("message")}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="marketplace" className="relative">
                    Marketplace
                    {getUnreadCount("marketplace") > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-green-600 text-white">
                        {getUnreadCount("marketplace")}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="forum" className="relative">
                    Forum
                    {getUnreadCount("forum") > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-green-600 text-white">
                        {getUnreadCount("forum")}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="relative">
                    Unread
                    {getUnreadCount("all") > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-green-600 text-white">
                        {getUnreadCount("all")}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="all" className="mt-0">
                <NotificationsList
                  notifications={filteredNotifications}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              </TabsContent>

              <TabsContent value="message" className="mt-0">
                <NotificationsList
                  notifications={filteredNotifications}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              </TabsContent>

              <TabsContent value="marketplace" className="mt-0">
                <NotificationsList
                  notifications={filteredNotifications}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              </TabsContent>

              <TabsContent value="forum" className="mt-0">
                <NotificationsList
                  notifications={filteredNotifications}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              </TabsContent>

              <TabsContent value="unread" className="mt-0">
                <NotificationsList
                  notifications={filteredNotifications}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function NotificationsList({
  notifications,
  onMarkAsRead,
  onDelete,
}: {
  notifications: typeof notificationsData
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Bell className="h-8 w-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-medium text-gray-800 mb-2">No notifications</h2>
        <p className="text-gray-500">You don't have any notifications at the moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <motion.div
          key={notification.id}
          className={`bg-white rounded-xl shadow-sm overflow-hidden transition-colors ${
            !notification.isRead ? "border-l-4 border-green-500" : ""
          }`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 flex">
            <div className={`p-2 rounded-full mr-4 ${getNotificationBgColor(notification.type)}`}>
              {getNotificationIcon(notification.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={`font-medium text-gray-900 ${!notification.isRead ? "font-semibold" : ""}`}>
                    {notification.title}
                  </h3>
                  <p className="text-gray-600 mt-1">{notification.description}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatRelativeTime(notification.timestamp)}</span>

                    <div className="flex items-center ml-4">
                      <Avatar className="h-4 w-4 mr-1">
                        <AvatarFallback className="text-[8px]">{notification.user.avatar}</AvatarFallback>
                      </Avatar>
                      <span>{notification.user.name}</span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!notification.isRead && (
                      <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                        <Check className="h-4 w-4 mr-2" />
                        Mark as read
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onDelete(notification.id)}>
                      <X className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-2 flex justify-end">
            <Link href={notification.actionUrl}>
              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50">
                View Details
              </Button>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
