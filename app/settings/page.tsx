"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, User, Lock, Bell, Shield, Moon, Sun, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [bio, setBio] = useState("")
  const [department, setDepartment] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketplaceNotifications, setMarketplaceNotifications] = useState(true)
  const [forumNotifications, setForumNotifications] = useState(true)
  const [messageNotifications, setMessageNotifications] = useState(true)
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [contactInfoVisibility, setContactInfoVisibility] = useState("connections")
  const [theme, setTheme] = useState("light")
  const [isSaving, setIsSaving] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    } else {
      // Initialize form with user data
      setName(user.name)
      setEmail(user.email)
      setBio("Computer Science student at Mindoro State University. Interested in web development and AI.")
      setDepartment("Computer Science")
    }
  }, [user, router])

  const handleSaveProfile = () => {
    if (!name.trim()) {
      toast({
        title: "Missing name",
        description: "Please provide your name",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    // Simulate saving profile
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })
      setIsSaving(false)
    }, 1000)
  }

  const handleChangePassword = () => {
    if (!currentPassword) {
      toast({
        title: "Missing current password",
        description: "Please enter your current password",
        variant: "destructive",
      })
      return
    }

    if (!newPassword) {
      toast({
        title: "Missing new password",
        description: "Please enter a new password",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation don't match",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 12) {
      toast({
        title: "Password too short",
        description: "Password must be at least 12 characters long",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    // Simulate changing password
    setTimeout(() => {
      toast({
        title: "Password changed",
        description: "Your password has been changed successfully",
      })
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setIsSaving(false)
    }, 1000)
  }

  const handleSaveNotifications = () => {
    setIsSaving(true)

    // Simulate saving notifications
    setTimeout(() => {
      toast({
        title: "Notification preferences updated",
        description: "Your notification preferences have been updated successfully",
      })
      setIsSaving(false)
    }, 1000)
  }

  const handleSavePrivacy = () => {
    setIsSaving(true)

    // Simulate saving privacy settings
    setTimeout(() => {
      toast({
        title: "Privacy settings updated",
        description: "Your privacy settings have been updated successfully",
      })
      setIsSaving(false)
    }, 1000)
  }

  const handleToggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)

    // In a real app, this would update the theme in localStorage and apply it
    document.documentElement.classList.toggle("dark", newTheme === "dark")

    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} theme activated`,
      description: `Your theme has been changed to ${newTheme} mode`,
    })
  }

  const handleDeleteAccount = () => {
    // In a real app, this would delete the user's account
    toast({
      title: "Account deleted",
      description: "Your account has been deleted successfully",
      variant: "destructive",
    })

    // Logout and redirect to home
    logout()
    router.push("/")
  }

  if (!user) {
    return null // Don't render anything if redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-none shadow-sm sticky top-24">
                <CardContent className="p-0">
                  <div className="p-6 flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback className="bg-green-100 text-green-600">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-medium text-gray-900">{user.name}</h2>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <Separator />

                  <nav className="p-2">
                    <Tabs defaultValue="profile" orientation="vertical" className="w-full">
                      <TabsList className="flex flex-col items-stretch h-auto bg-transparent p-0 space-y-1">
                        <TabsTrigger
                          value="profile"
                          className="justify-start px-3 py-2 h-9 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </TabsTrigger>
                        <TabsTrigger
                          value="security"
                          className="justify-start px-3 py-2 h-9 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
                        >
                          <Lock className="h-4 w-4 mr-2" />
                          Security
                        </TabsTrigger>
                        <TabsTrigger
                          value="notifications"
                          className="justify-start px-3 py-2 h-9 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          Notifications
                        </TabsTrigger>
                        <TabsTrigger
                          value="privacy"
                          className="justify-start px-3 py-2 h-9 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Privacy
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </nav>

                  <Separator />

                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {theme === "light" ? (
                          <Sun className="h-4 w-4 mr-2 text-amber-500" />
                        ) : (
                          <Moon className="h-4 w-4 mr-2 text-blue-500" />
                        )}
                        <span className="text-sm font-medium text-gray-700">
                          {theme === "light" ? "Light" : "Dark"} Mode
                        </span>
                      </div>
                      <Switch checked={theme === "dark"} onCheckedChange={handleToggleTheme} />
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data
                            from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile">
                <TabsContent value="profile" className="mt-0">
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your profile information and how it appears to others</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled
                        />
                        <p className="text-xs text-gray-500">
                          Your email address is used for login and cannot be changed
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Tell us about yourself"
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select value={department} onValueChange={setDepartment}>
                          <SelectTrigger id="department">
                            <SelectValue placeholder="Select your department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Chemistry">Chemistry</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Business">Business</SelectItem>
                            <SelectItem value="Arts">Arts</SelectItem>
                            <SelectItem value="Social Sciences">Social Sciences</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-0">
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Manage your password and account security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">Password must be at least 12 characters long</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleChangePassword}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Change Password
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-0">
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Manage how and when you receive notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                            <p className="text-sm text-gray-500">Receive notifications via email</p>
                          </div>
                          <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Marketplace Notifications</h3>
                            <p className="text-sm text-gray-500">
                              Receive notifications about your listings and offers
                            </p>
                          </div>
                          <Switch checked={marketplaceNotifications} onCheckedChange={setMarketplaceNotifications} />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Forum Notifications</h3>
                            <p className="text-sm text-gray-500">
                              Receive notifications about your questions and answers
                            </p>
                          </div>
                          <Switch checked={forumNotifications} onCheckedChange={setForumNotifications} />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">Message Notifications</h3>
                            <p className="text-sm text-gray-500">Receive notifications about new messages</p>
                          </div>
                          <Switch checked={messageNotifications} onCheckedChange={setMessageNotifications} />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleSaveNotifications}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Preferences
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="privacy" className="mt-0">
                  <Card className="border-none shadow-sm">
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>Manage who can see your profile and contact information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="profile-visibility">Profile Visibility</Label>
                        <Select value={profileVisibility} onValueChange={setProfileVisibility}>
                          <SelectTrigger id="profile-visibility">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public (Everyone)</SelectItem>
                            <SelectItem value="minsu">MinSU Students Only</SelectItem>
                            <SelectItem value="connections">Connections Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contact-info-visibility">Contact Information Visibility</Label>
                        <Select value={contactInfoVisibility} onValueChange={setContactInfoVisibility}>
                          <SelectTrigger id="contact-info-visibility">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public (Everyone)</SelectItem>
                            <SelectItem value="minsu">MinSU Students Only</SelectItem>
                            <SelectItem value="connections">Connections Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-4 pt-4">
                        <h3 className="text-sm font-medium text-gray-900">Data Usage</h3>

                        <div className="flex items-center space-x-2">
                          <Switch id="analytics" defaultChecked />
                          <Label htmlFor="analytics">Allow anonymous usage analytics</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch id="personalization" defaultChecked />
                          <Label htmlFor="personalization">Allow personalized recommendations</Label>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={handleSavePrivacy}
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Settings
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
