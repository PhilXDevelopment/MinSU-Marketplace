"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Trash2,
  Ban,
  CheckCircle,
  User,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Link2,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
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

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
    status: "active",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2023-01-15",
    lastActive: "2023-03-21T14:30:00",
    location: "New York, USA",
    phone: "+1 (555) 123-4567",
    website: "johndoe.com",
    bio: "Computer Science student at NYU. Passionate about web development and AI.",
    isVerified: true,
    isSeller: true,
    isAdmin: false,
    isModerator: false,
    isBlocked: false,
    loginCount: 47,
    postsCount: 12,
    productsCount: 5,
    purchasesCount: 8,
    reportsAgainst: 0,
    reportsSubmitted: 2,
    activityLog: [
      { action: "Login", timestamp: "2023-03-21T14:30:00", details: "Logged in from New York, USA" },
      { action: "Product Listed", timestamp: "2023-03-20T10:15:00", details: "Listed 'MacBook Pro 2019' for $1200" },
      { action: "Forum Post", timestamp: "2023-03-18T16:45:00", details: "Posted in 'Computer Science' forum" },
      { action: "Purchase", timestamp: "2023-03-15T09:30:00", details: "Purchased 'Calculus Textbook' for $45" },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Professor",
    status: "active",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2022-11-05",
    lastActive: "2023-03-20T09:15:00",
    location: "Boston, USA",
    phone: "+1 (555) 987-6543",
    website: "janesmith.edu",
    bio: "Professor of Economics at Boston University. Researcher in behavioral economics.",
    isVerified: true,
    isSeller: false,
    isAdmin: false,
    isModerator: true,
    isBlocked: false,
    loginCount: 32,
    postsCount: 25,
    productsCount: 0,
    purchasesCount: 3,
    reportsAgainst: 0,
    reportsSubmitted: 5,
    activityLog: [
      { action: "Login", timestamp: "2023-03-20T09:15:00", details: "Logged in from Boston, USA" },
      {
        action: "Forum Moderation",
        timestamp: "2023-03-19T11:30:00",
        details: "Removed inappropriate post in 'Economics' forum",
      },
      { action: "Forum Post", timestamp: "2023-03-17T14:20:00", details: "Posted in 'Economics' forum" },
      { action: "Purchase", timestamp: "2023-03-10T16:45:00", details: "Purchased 'Research Methods' for $60" },
    ],
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "Student",
    status: "blocked",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2023-02-10",
    lastActive: "2023-03-15T17:45:00",
    location: "Chicago, USA",
    phone: "+1 (555) 456-7890",
    website: "",
    bio: "Engineering student. Looking to buy and sell textbooks and equipment.",
    isVerified: false,
    isSeller: true,
    isAdmin: false,
    isModerator: false,
    isBlocked: true,
    loginCount: 15,
    postsCount: 8,
    productsCount: 3,
    purchasesCount: 2,
    reportsAgainst: 4,
    reportsSubmitted: 0,
    activityLog: [
      { action: "Account Blocked", timestamp: "2023-03-16T10:00:00", details: "Account blocked for policy violations" },
      { action: "Report", timestamp: "2023-03-15T17:45:00", details: "Reported for listing prohibited items" },
      { action: "Product Listed", timestamp: "2023-03-15T16:30:00", details: "Listed 'Exam Solutions' for $50" },
      { action: "Warning", timestamp: "2023-03-10T09:15:00", details: "Received warning for inappropriate forum post" },
    ],
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "Staff",
    status: "active",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2022-09-20",
    lastActive: "2023-03-21T11:20:00",
    location: "Los Angeles, USA",
    phone: "+1 (555) 789-0123",
    website: "emilydavis.com",
    bio: "University staff member. Here to help students with marketplace issues.",
    isVerified: true,
    isSeller: false,
    isAdmin: true,
    isModerator: true,
    isBlocked: false,
    loginCount: 89,
    postsCount: 30,
    productsCount: 0,
    purchasesCount: 5,
    reportsAgainst: 0,
    reportsSubmitted: 12,
    activityLog: [
      { action: "Login", timestamp: "2023-03-21T11:20:00", details: "Logged in from Los Angeles, USA" },
      { action: "Admin Action", timestamp: "2023-03-21T11:25:00", details: "Approved 5 new product listings" },
      {
        action: "Admin Action",
        timestamp: "2023-03-20T14:30:00",
        details: "Resolved dispute between buyer and seller",
      },
      {
        action: "Forum Post",
        timestamp: "2023-03-19T09:45:00",
        details: "Posted announcement in 'Marketplace Updates' forum",
      },
    ],
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "Student",
    status: "inactive",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2022-10-15",
    lastActive: "2023-02-05T08:30:00",
    location: "Seattle, USA",
    phone: "+1 (555) 234-5678",
    website: "",
    bio: "Computer Engineering student. Interested in electronics and programming books.",
    isVerified: true,
    isSeller: true,
    isAdmin: false,
    isModerator: false,
    isBlocked: false,
    loginCount: 23,
    postsCount: 5,
    productsCount: 7,
    purchasesCount: 4,
    reportsAgainst: 1,
    reportsSubmitted: 0,
    activityLog: [
      { action: "Login", timestamp: "2023-02-05T08:30:00", details: "Logged in from Seattle, USA" },
      { action: "Product Listed", timestamp: "2023-02-05T09:15:00", details: "Listed 'Arduino Starter Kit' for $35" },
      { action: "Purchase", timestamp: "2023-01-20T14:45:00", details: "Purchased 'Python Programming' for $30" },
      { action: "Report", timestamp: "2023-01-15T11:30:00", details: "Reported for delayed shipping" },
    ],
  },
  {
    id: "6",
    name: "Sarah Brown",
    email: "sarah.brown@example.com",
    role: "Student",
    status: "active",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2023-01-05",
    lastActive: "2023-03-20T16:45:00",
    location: "Miami, USA",
    phone: "+1 (555) 876-5432",
    website: "",
    bio: "Psychology major. Looking for textbooks and study materials.",
    isVerified: true,
    isSeller: false,
    isAdmin: false,
    isModerator: false,
    isBlocked: false,
    loginCount: 18,
    postsCount: 3,
    productsCount: 0,
    purchasesCount: 6,
    reportsAgainst: 0,
    reportsSubmitted: 1,
    activityLog: [
      { action: "Login", timestamp: "2023-03-20T16:45:00", details: "Logged in from Miami, USA" },
      { action: "Purchase", timestamp: "2023-03-20T17:00:00", details: "Purchased 'Abnormal Psychology' for $55" },
      { action: "Forum Post", timestamp: "2023-03-15T10:30:00", details: "Posted in 'Psychology' forum" },
      { action: "Report", timestamp: "2023-03-10T14:15:00", details: "Reported seller for misrepresented item" },
    ],
  },
  {
    id: "7",
    name: "David Lee",
    email: "david.lee@example.com",
    role: "Student",
    status: "active",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2022-12-10",
    lastActive: "2023-03-21T10:15:00",
    location: "San Francisco, USA",
    phone: "+1 (555) 345-6789",
    website: "davidlee.dev",
    bio: "Computer Science student specializing in mobile app development.",
    isVerified: true,
    isSeller: true,
    isAdmin: false,
    isModerator: false,
    isBlocked: false,
    loginCount: 35,
    postsCount: 15,
    productsCount: 8,
    purchasesCount: 3,
    reportsAgainst: 0,
    reportsSubmitted: 0,
    activityLog: [
      { action: "Login", timestamp: "2023-03-21T10:15:00", details: "Logged in from San Francisco, USA" },
      { action: "Product Listed", timestamp: "2023-03-21T10:30:00", details: "Listed 'iPhone 11 Pro' for $500" },
      { action: "Forum Post", timestamp: "2023-03-18T14:20:00", details: "Posted in 'Mobile Development' forum" },
      { action: "Purchase", timestamp: "2023-03-10T09:45:00", details: "Purchased 'Swift Programming' for $40" },
    ],
  },
  {
    id: "8",
    name: "Jennifer Martinez",
    email: "jennifer.martinez@example.com",
    role: "Professor",
    status: "active",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2022-08-15",
    lastActive: "2023-03-19T15:30:00",
    location: "Austin, USA",
    phone: "+1 (555) 567-8901",
    website: "jmartinez.edu",
    bio: "Professor of Biology. Selling research papers and textbooks.",
    isVerified: true,
    isSeller: true,
    isAdmin: false,
    isModerator: true,
    isBlocked: false,
    loginCount: 42,
    postsCount: 28,
    productsCount: 12,
    purchasesCount: 5,
    reportsAgainst: 0,
    reportsSubmitted: 3,
    activityLog: [
      { action: "Login", timestamp: "2023-03-19T15:30:00", details: "Logged in from Austin, USA" },
      {
        action: "Product Listed",
        timestamp: "2023-03-19T16:00:00",
        details: "Listed 'Biology Research Papers' for $75",
      },
      { action: "Forum Moderation", timestamp: "2023-03-18T11:45:00", details: "Removed spam in 'Biology' forum" },
      { action: "Purchase", timestamp: "2023-03-15T14:20:00", details: "Purchased 'Lab Equipment' for $150" },
    ],
  },
  {
    id: "9",
    name: "Thomas Anderson",
    email: "thomas.anderson@example.com",
    role: "Student",
    status: "pending",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2023-03-18",
    lastActive: "2023-03-18T09:45:00",
    location: "Denver, USA",
    phone: "+1 (555) 678-9012",
    website: "",
    bio: "New to the platform. Looking to buy and sell engineering textbooks.",
    isVerified: false,
    isSeller: false,
    isAdmin: false,
    isModerator: false,
    isBlocked: false,
    loginCount: 2,
    postsCount: 0,
    productsCount: 0,
    purchasesCount: 0,
    reportsAgainst: 0,
    reportsSubmitted: 0,
    activityLog: [
      { action: "Account Created", timestamp: "2023-03-18T09:30:00", details: "Account created from Denver, USA" },
      { action: "Login", timestamp: "2023-03-18T09:45:00", details: "Logged in from Denver, USA" },
      { action: "Profile Updated", timestamp: "2023-03-18T10:00:00", details: "Updated profile information" },
      { action: "Email Verification", timestamp: "2023-03-18T10:15:00", details: "Email verification sent" },
    ],
  },
  {
    id: "10",
    name: "Olivia Garcia",
    email: "olivia.garcia@example.com",
    role: "Student",
    status: "active",
    avatar: "/placeholder.svg?height=100&width=100",
    joinDate: "2022-11-20",
    lastActive: "2023-03-21T13:15:00",
    location: "Philadelphia, USA",
    phone: "+1 (555) 789-0123",
    website: "",
    bio: "Art student. Selling handmade crafts and art supplies.",
    isVerified: true,
    isSeller: true,
    isAdmin: false,
    isModerator: false,
    isBlocked: false,
    loginCount: 29,
    postsCount: 10,
    productsCount: 15,
    purchasesCount: 7,
    reportsAgainst: 1,
    reportsSubmitted: 2,
    activityLog: [
      { action: "Login", timestamp: "2023-03-21T13:15:00", details: "Logged in from Philadelphia, USA" },
      { action: "Product Listed", timestamp: "2023-03-21T13:45:00", details: "Listed 'Handmade Sketchbook' for $25" },
      { action: "Forum Post", timestamp: "2023-03-20T10:30:00", details: "Posted in 'Art Supplies' forum" },
      { action: "Report", timestamp: "2023-03-15T16:20:00", details: "Reported for item not as described" },
    ],
  },
]

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    // Fetch user data based on ID
    const userData = mockUsers.find((u) => u.id === params.id)

    if (userData) {
      setUser(userData)
      setFormData(userData)
    } else {
      toast({
        title: "User not found",
        description: "The requested user could not be found.",
        variant: "destructive",
      })
      router.push("/admin/users")
    }

    setLoading(false)
  }, [params.id, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSave = () => {
    // In a real app, you would save to the backend here
    setUser(formData)
    setEditMode(false)
    toast({
      title: "Changes saved",
      description: "User information has been updated successfully.",
    })
  }

  const handleBlock = () => {
    const newStatus = user.status === "blocked" ? "active" : "blocked"
    const newUser = { ...user, status: newStatus, isBlocked: newStatus === "blocked" }
    setUser(newUser)
    setFormData(newUser)
    toast({
      title: newStatus === "blocked" ? "User blocked" : "User unblocked",
      description: `${user.name} has been ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully.`,
    })
  }

  const handleDelete = () => {
    // In a real app, you would delete from the backend here
    toast({
      title: "User deleted",
      description: `${user.name} has been deleted successfully.`,
    })
    router.push("/admin/users")
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-7 w-40 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="animate-pulse">
              <CardHeader className="h-40 bg-gray-200"></CardHeader>
              <CardContent className="space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card className="animate-pulse">
              <CardHeader className="h-20 bg-gray-200"></CardHeader>
              <CardContent className="space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">User Not Found</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p>The requested user could not be found. Please return to the user list.</p>
            <Button className="mt-4" onClick={() => router.push("/admin/users")}>
              Back to User List
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin/users")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">User Details</h1>
        </div>
        <div className="flex space-x-2">
          {editMode ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setEditMode(false)
                  setFormData(user)
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEditMode(true)}>
                Edit User
              </Button>
              <Button variant={user.status === "blocked" ? "outline" : "destructive"} onClick={handleBlock}>
                {user.status === "blocked" ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Unblock User
                  </>
                ) : (
                  <>
                    <Ban className="h-4 w-4 mr-2" />
                    Block User
                  </>
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the user account and remove all
                      associated data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Profile Sidebar */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {editMode ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-xl font-bold text-center"
                  />
                ) : (
                  <CardTitle className="text-xl text-center">{user.name}</CardTitle>
                )}
                <div className="flex items-center mt-2 space-x-2">
                  <Badge
                    variant={
                      user.status === "active"
                        ? "default"
                        : user.status === "blocked"
                          ? "destructive"
                          : user.status === "pending"
                            ? "outline"
                            : "secondary"
                    }
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </Badge>
                  {user.isVerified && <Badge variant="secondary">Verified</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  {editMode ? (
                    <Input name="email" value={formData.email} onChange={handleInputChange} className="text-sm" />
                  ) : (
                    <span>{user.email}</span>
                  )}
                </div>
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  {editMode ? (
                    <Select value={formData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Professor">Professor</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                        <SelectItem value="Alumni">Alumni</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span>{user.role}</span>
                  )}
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>Last active {new Date(user.lastActive).toLocaleString()}</span>
                </div>
                {(user.location || editMode) && (
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {editMode ? (
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="text-sm"
                      />
                    ) : (
                      <span>{user.location}</span>
                    )}
                  </div>
                )}
                {(user.phone || editMode) && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    {editMode ? (
                      <Input name="phone" value={formData.phone} onChange={handleInputChange} className="text-sm" />
                    ) : (
                      <span>{user.phone}</span>
                    )}
                  </div>
                )}
                {(user.website || editMode) && (
                  <div className="flex items-center text-sm">
                    <Link2 className="h-4 w-4 mr-2 text-gray-500" />
                    {editMode ? (
                      <Input name="website" value={formData.website} onChange={handleInputChange} className="text-sm" />
                    ) : (
                      <span>{user.website}</span>
                    )}
                  </div>
                )}
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">User Permissions</h3>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isVerified" className="flex items-center space-x-2">
                        <span>Verified User</span>
                      </Label>
                      <Switch
                        id="isVerified"
                        checked={formData.isVerified}
                        onCheckedChange={(checked) => handleSwitchChange("isVerified", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isSeller" className="flex items-center space-x-2">
                        <span>Seller Privileges</span>
                      </Label>
                      <Switch
                        id="isSeller"
                        checked={formData.isSeller}
                        onCheckedChange={(checked) => handleSwitchChange("isSeller", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isAdmin" className="flex items-center space-x-2">
                        <span>Admin Access</span>
                      </Label>
                      <Switch
                        id="isAdmin"
                        checked={formData.isAdmin}
                        onCheckedChange={(checked) => handleSwitchChange("isAdmin", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="isModerator" className="flex items-center space-x-2">
                        <span>Moderator Access</span>
                      </Label>
                      <Switch
                        id="isModerator"
                        checked={formData.isModerator}
                        onCheckedChange={(checked) => handleSwitchChange("isModerator", checked)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Bio</h3>
                    <p className="text-sm text-gray-600">{user.bio}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">User Roles</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.isSeller && <Badge variant="outline">Seller</Badge>}
                      {user.isAdmin && <Badge variant="outline">Admin</Badge>}
                      {user.isModerator && <Badge variant="outline">Moderator</Badge>}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Details Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                  <CardDescription>Overview of user activity and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Logins</p>
                      <p className="text-2xl font-bold">{user.loginCount}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Posts</p>
                      <p className="text-2xl font-bold">{user.postsCount}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Products</p>
                      <p className="text-2xl font-bold">{user.productsCount}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-gray-500">Purchases</p>
                      <p className="text-2xl font-bold">{user.purchasesCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions performed by this user</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.activityLog.map((activity: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <FileText className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.details}</p>
                          <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Detailed history of user actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.activityLog.map((activity: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <FileText className="h-4 w-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.details}</p>
                          <p className="text-xs text-gray-400">{new Date(activity.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Full Activity Log
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Content</CardTitle>
                  <CardDescription>Products, posts, and other content created by this user</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="products">
                    <TabsList className="w-full">
                      <TabsTrigger value="products" className="flex-1">
                        Products ({user.productsCount})
                      </TabsTrigger>
                      <TabsTrigger value="posts" className="flex-1">
                        Forum Posts ({user.postsCount})
                      </TabsTrigger>
                      <TabsTrigger value="purchases" className="flex-1">
                        Purchases ({user.purchasesCount})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="products" className="mt-4">
                      {user.productsCount > 0 ? (
                        <div className="space-y-4">
                          <p>User has {user.productsCount} products listed for sale.</p>
                          <Button variant="outline">View All Products</Button>
                        </div>
                      ) : (
                        <p className="text-gray-500">This user has no products listed.</p>
                      )}
                    </TabsContent>

                    <TabsContent value="posts" className="mt-4">
                      {user.postsCount > 0 ? (
                        <div className="space-y-4">
                          <p>User has created {user.postsCount} forum posts.</p>
                          <Button variant="outline">View All Posts</Button>
                        </div>
                      ) : (
                        <p className="text-gray-500">This user has not created any forum posts.</p>
                      )}
                    </TabsContent>

                    <TabsContent value="purchases" className="mt-4">
                      {user.purchasesCount > 0 ? (
                        <div className="space-y-4">
                          <p>User has made {user.purchasesCount} purchases.</p>
                          <Button variant="outline">View Purchase History</Button>
                        </div>
                      ) : (
                        <p className="text-gray-500">This user has not made any purchases.</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage user account settings and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Account Status</h3>
                    <Select
                      value={user.status}
                      onValueChange={(value) => {
                        setUser({ ...user, status: value, isBlocked: value === "blocked" })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">User Permissions</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isVerified-setting">Verified User</Label>
                        <Switch
                          id="isVerified-setting"
                          checked={user.isVerified}
                          onCheckedChange={(checked) => setUser({ ...user, isVerified: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isSeller-setting">Seller Privileges</Label>
                        <Switch
                          id="isSeller-setting"
                          checked={user.isSeller}
                          onCheckedChange={(checked) => setUser({ ...user, isSeller: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isAdmin-setting">Admin Access</Label>
                        <Switch
                          id="isAdmin-setting"
                          checked={user.isAdmin}
                          onCheckedChange={(checked) => setUser({ ...user, isAdmin: checked })}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="isModerator-setting">Moderator Access</Label>
                        <Switch
                          id="isModerator-setting"
                          checked={user.isModerator}
                          onCheckedChange={(checked) => setUser({ ...user, isModerator: checked })}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Danger Zone</h3>
                    <div className="space-y-2">
                      <Button variant="destructive" className="w-full" onClick={handleBlock}>
                        {user.status === "blocked" ? "Unblock User" : "Block User"}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="w-full">
                            Delete User Account
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the user account and remove all
                              associated data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
