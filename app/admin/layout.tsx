"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  MessageSquare,
  Shield,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Mock notifications data
const initialNotifications = [
  {
    id: "1",
    title: "New user registered",
    description: "John Doe has created a new account",
    timestamp: "2025-03-21T14:30:00Z",
    read: false,
    type: "user",
  },
  {
    id: "2",
    title: "New product listed",
    description: "MacBook Pro 2024 was listed by Tech Haven",
    timestamp: "2025-03-21T13:15:00Z",
    read: false,
    type: "product",
  },
  {
    id: "3",
    title: "Dispute opened",
    description: "A new dispute has been opened for order #12345",
    timestamp: "2025-03-21T11:45:00Z",
    read: false,
    type: "dispute",
  },
  {
    id: "4",
    title: "System update completed",
    description: "The system has been updated to version 2.1.0",
    timestamp: "2025-03-20T09:30:00Z",
    read: true,
    type: "system",
  },
  {
    id: "5",
    title: "Seller verification request",
    description: "Sarah Garcia has requested seller verification",
    timestamp: "2025-03-19T16:20:00Z",
    read: true,
    type: "seller",
  },
]

// Navigation items
const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Sellers",
    href: "/admin/sellers",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Moderation",
    href: "/admin/moderation",
    icon: <Shield className="h-5 w-5" />,
  },
  {
    title: "Disputes",
    href: "/admin/disputes",
    icon: <MessageSquare className="h-5 w-5" />,
    badge: "5",
  },
  {
    title: "Settings",
    icon: <Settings className="h-5 w-5" />,
    submenu: [
      {
        title: "General",
        href: "/admin/settings",
      },
      {
        title: "Profile",
        href: "/admin/settings/profile",
      },
      {
        title: "Security",
        href: "/admin/security",
      },
    ],
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [adminUser, setAdminUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Check if admin is logged in
    const checkAuth = () => {
      try {
        console.log("Checking admin authentication...")

        // Check if admin is authenticated
        const isAuth = localStorage.getItem("minsu-admin-auth") === "true"
        console.log("Authentication status:", isAuth)

        setIsAuthenticated(isAuth)

        if (!isAuth) {
          console.log("Not authenticated, redirecting to login...")
          // Redirect to login if not authenticated
          router.push("/auth/admin")
          return
        }

        console.log("Authentication successful, loading admin panel...")
        setIsLoading(false)
      } catch (error) {
        console.error("Error checking auth:", error)
        setIsLoading(false)
        // On error, redirect to login
        router.push("/auth/admin")
      }
    }

    checkAuth()
  }, [router])

  // If still loading or not authenticated, show loading state
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-amber-600 rounded-full border-t-transparent"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Count unread notifications
  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="h-4 w-4 text-blue-500" />
      case "product":
        return <ShoppingBag className="h-4 w-4 text-green-500" />
      case "dispute":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "system":
        return <CheckCircle className="h-4 w-4 text-purple-500" />
      case "seller":
        return <ShoppingBag className="h-4 w-4 text-amber-500" />
      case "security":
        return <Lock className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "just now"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? "day" : "days"} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  // Toggle submenu
  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null)
    } else {
      setOpenSubmenu(title)
    }
  }

  // Check if a nav item or its children are active
  const isActive = (item: any) => {
    if (item.href && pathname === item.href) {
      return true
    }
    if (item.submenu) {
      return item.submenu.some((subItem: any) => pathname === subItem.href)
    }
    return false
  }

  // Handle logout
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem("minsu-admin-user")
    localStorage.removeItem("minsu-admin-auth")

    toast({
      title: "Logged out",
      description: "You have been logged out of the admin dashboard",
    })

    // Redirect to admin login
    router.push("/auth/admin")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-10">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <Link href="/admin/dashboard" className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-[#004D40] flex items-center justify-center text-white font-bold mr-2">
                M
              </div>
              <span className="text-lg font-bold">MinSU Admin</span>
            </Link>
          </div>
          <div className="flex-grow flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.title}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md group ${
                          isActive(item) ? "bg-[#E7F2F0] text-[#004D40]" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.title}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openSubmenu === item.title ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openSubmenu === item.title && (
                        <div className="pl-10 pr-2 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                pathname === subItem.href
                                  ? "bg-[#E7F2F0] text-[#004D40]"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                        isActive(item) ? "bg-[#E7F2F0] text-[#004D40]" : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </div>
                      {item.badge && <Badge className="bg-red-500 text-white">{item.badge}</Badge>}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#004D40] text-white">{adminUser?.avatar || "A"}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{adminUser?.name || "Admin User"}</p>
                  <p className="text-xs text-gray-500">{adminUser?.email || "admin@minsu.edu.ph"}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-auto">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/settings/profile" className="w-full">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/settings" className="w-full">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/admin/dashboard" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#004D40] flex items-center justify-center text-white font-bold mr-2">
              M
            </div>
            <span className="text-lg font-bold">MinSU Admin</span>
          </Link>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
                      Mark all as read
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`flex items-start p-3 cursor-pointer ${!notification.read ? "bg-gray-50" : ""}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="mr-3 mt-0.5">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 space-y-1">
                          <p className={`text-sm ${!notification.read ? "font-medium" : ""}`}>{notification.title}</p>
                          <p className="text-xs text-gray-500">{notification.description}</p>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatRelativeTime(notification.timestamp)}
                          </div>
                        </div>
                        {!notification.read && <div className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-1"></div>}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center" asChild>
                  <Link href="/admin/notifications" className="w-full text-center text-sm text-blue-600">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu size={20} />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-20 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 bottom-0 w-64 bg-white">
            <div className="flex items-center h-16 px-4 border-b border-gray-200">
              <Link href="/admin/dashboard" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="w-8 h-8 rounded-full bg-[#004D40] flex items-center justify-center text-white font-bold mr-2">
                  M
                </div>
                <span className="text-lg font-bold">MinSU Admin</span>
              </Link>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileMenuOpen(false)}>
                <Menu size={20} />
              </Button>
            </div>
            <div className="py-4 px-2 space-y-1">
              {navItems.map((item) => (
                <div key={item.title}>
                  {item.submenu ? (
                    <>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md group ${
                          isActive(item) ? "bg-[#E7F2F0] text-[#004D40]" : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center">
                          {item.icon}
                          <span className="ml-3">{item.title}</span>
                        </div>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openSubmenu === item.title ? "transform rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openSubmenu === item.title && (
                        <div className="pl-10 pr-2 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link
                              key={subItem.title}
                              href={subItem.href}
                              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                                pathname === subItem.href
                                  ? "bg-[#E7F2F0] text-[#004D40]"
                                  : "text-gray-700 hover:bg-gray-50"
                              }`}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {subItem.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                        isActive(item) ? "bg-[#E7F2F0] text-[#004D40]" : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.title}</span>
                      </div>
                      {item.badge && <Badge className="bg-red-500 text-white">{item.badge}</Badge>}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
              <div className="flex items-center">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#004D40] text-white">{adminUser?.avatar || "A"}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{adminUser?.name || "Admin User"}</p>
                  <p className="text-xs text-gray-500">{adminUser?.email || "admin@minsu.edu.ph"}</p>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        <div className="hidden md:flex md:h-16 md:items-center md:justify-between md:border-b md:border-gray-200 md:bg-white md:px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">
              {navItems.find((item) => item.href === pathname)?.title ||
                navItems
                  .filter((item) => item.submenu)
                  .flatMap((item) => item.submenu)
                  .find((item) => item.href === pathname)?.title ||
                "Dashboard"}
            </h1>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={markAllAsRead}>
                      Mark all as read
                    </Button>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className={`flex items-start p-3 cursor-pointer ${!notification.read ? "bg-gray-50" : ""}`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="mr-3 mt-0.5">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 space-y-1">
                          <p className={`text-sm ${!notification.read ? "font-medium" : ""}`}>{notification.title}</p>
                          <p className="text-xs text-gray-500">{notification.description}</p>
                          <div className="flex items-center text-xs text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatRelativeTime(notification.timestamp)}
                          </div>
                        </div>
                        {!notification.read && <div className="h-2 w-2 bg-blue-500 rounded-full ml-2 mt-1"></div>}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p>No notifications</p>
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center" asChild>
                  <Link href="/admin/notifications" className="w-full text-center text-sm text-blue-600">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#004D40] text-white">{adminUser?.avatar || "A"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings/profile" className="w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <main className="pt-16 md:pt-0">{children}</main>
      </div>
    </div>
  )
}
