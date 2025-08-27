"use client"

import { useState } from "react"
import { Save, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export default function SettingsPage() {
  const { toast } = useToast()

  // General Settings
  const [siteName, setSiteName] = useState("MinSU Marketplace")
  const [siteDescription, setSiteDescription] = useState("Buy and sell items within the MinSU community")
  const [contactEmail, setContactEmail] = useState("support@minsu.edu.ph")
  const [supportPhone, setSupportPhone] = useState("+63 912 345 6789")
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [registrationEnabled, setRegistrationEnabled] = useState(true)
  const [currency, setCurrency] = useState("₱")

  // Payment Settings
  const [paymentMethods, setPaymentMethods] = useState({
    cash: true,
    gcash: true,
  })

  // Shipping Settings
  const [pickupLocations, setPickupLocations] = useState([
    "Main Campus, Oriental Mindoro",
    "Calapan Campus, Oriental Mindoro",
    "Bongabong Campus, Oriental Mindoro",
    "Victoria Campus, Oriental Mindoro",
    "Naujan Campus, Oriental Mindoro",
    "Admin Building, Main Campus",
    "Canteen, Main Campus",
    "IT Building, Main Campus",
    "CAAF Building, Main Campus",
    "IABE Building, Main Campus",
    "CTE Building, Main Campus",
    "CME Building, Main Campus",
    "CAS Building, Main Campus",
    "CCJE Building, Main Campus",
    "IF Building, Main Campus",
  ])
  const [selectedPickupLocations, setSelectedPickupLocations] = useState([
    "Main Campus, Oriental Mindoro",
    "Calapan Campus, Oriental Mindoro",
    "Bongabong Campus, Oriental Mindoro",
  ])

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [adminAlerts, setAdminAlerts] = useState(true)
  const [userSignupNotifications, setUserSignupNotifications] = useState(true)
  const [newListingNotifications, setNewListingNotifications] = useState(true)
  const [disputeNotifications, setDisputeNotifications] = useState(true)

  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [loginAttempts, setLoginAttempts] = useState("5")
  const [sessionTimeout, setSessionTimeout] = useState("60")
  const [passwordPolicy, setPasswordPolicy] = useState("medium")

  // Loading states
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const handleSaveSettings = (tab: string) => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)

      toast({
        title: "Settings saved",
        description: `Your ${tab} settings have been updated successfully.`,
      })
    }, 1000)
  }

  const handleTogglePickupLocation = (location: string) => {
    if (selectedPickupLocations.includes(location)) {
      // Remove if already selected
      setSelectedPickupLocations(selectedPickupLocations.filter((loc) => loc !== location))
    } else {
      // Add if not selected
      setSelectedPickupLocations([...selectedPickupLocations, location])
    }
  }

  const handleResetSettings = () => {
    // Reset settings based on active tab
    switch (activeTab) {
      case "general":
        setSiteName("MinSU Marketplace")
        setSiteDescription("Buy and sell items within the MinSU community")
        setContactEmail("support@minsu.edu.ph")
        setSupportPhone("+63 912 345 6789")
        setMaintenanceMode(false)
        setRegistrationEnabled(true)
        setCurrency("₱")
        break
      case "payment":
        setPaymentMethods({
          cash: true,
          gcash: true,
        })
        break
      case "shipping":
        setSelectedPickupLocations([
          "Main Campus, Oriental Mindoro",
          "Calapan Campus, Oriental Mindoro",
          "Bongabong Campus, Oriental Mindoro",
        ])
        break
      case "notifications":
        setEmailNotifications(true)
        setAdminAlerts(true)
        setUserSignupNotifications(true)
        setNewListingNotifications(true)
        setDisputeNotifications(true)
        break
      case "security":
        setTwoFactorAuth(false)
        setLoginAttempts("5")
        setSessionTimeout("60")
        setPasswordPolicy("medium")
        break
    }

    toast({
      title: "Settings reset",
      description: `Your ${activeTab} settings have been reset to defaults.`,
    })
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Platform Settings</h1>
          <p className="text-gray-600">Configure your marketplace settings</p>
        </div>
      </div>

      <Tabs defaultValue="general" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="shipping">Pickup</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic marketplace settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-description">Site Description</Label>
                <Textarea
                  id="site-description"
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-phone">Support Phone</Label>
                  <Input id="support-phone" value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="₱">Philippine Peso (₱)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">
                      When enabled, the site will be inaccessible to regular users
                    </p>
                  </div>
                  <Switch id="maintenance-mode" checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="registration">User Registration</Label>
                    <p className="text-sm text-gray-500">Allow new users to register on the platform</p>
                  </div>
                  <Switch id="registration" checked={registrationEnabled} onCheckedChange={setRegistrationEnabled} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Reset to Defaults</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all general settings to their default values. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleResetSettings()}>Reset Settings</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button onClick={() => handleSaveSettings("general")} disabled={isSaving}>
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

        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>Configure payment methods and options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Payment Methods</h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                      <span className="text-lg font-bold">₱</span>
                    </div>
                    <div>
                      <p className="font-medium">Cash</p>
                      <p className="text-sm text-gray-500">Accept cash payments</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.cash}
                    onCheckedChange={(checked) => setPaymentMethods({ ...paymentMethods, cash: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">G</span>
                    </div>
                    <div>
                      <p className="font-medium">GCash</p>
                      <p className="text-sm text-gray-500">Accept GCash payments</p>
                    </div>
                  </div>
                  <Switch
                    checked={paymentMethods.gcash}
                    onCheckedChange={(checked) => setPaymentMethods({ ...paymentMethods, gcash: checked })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Reset to Defaults</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all payment settings to their default values. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleResetSettings()}>Reset Settings</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button onClick={() => handleSaveSettings("payment")} disabled={isSaving}>
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

        {/* Shipping Settings */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Pickup Settings</CardTitle>
              <CardDescription>Configure pickup locations and options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pickup Method</Label>
                    <p className="text-sm text-gray-500">Allow buyers to pick up items at designated locations</p>
                  </div>
                  <Switch checked={true} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Available Pickup Locations</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {pickupLocations.map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Switch
                          checked={selectedPickupLocations.includes(location)}
                          onCheckedChange={() => handleTogglePickupLocation(location)}
                          id={`location-${location}`}
                        />
                        <Label htmlFor={`location-${location}`}>{location}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Reset to Defaults</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all pickup settings to their default values. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleResetSettings()}>Reset Settings</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button onClick={() => handleSaveSettings("shipping")} disabled={isSaving}>
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

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system and email notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Send email notifications to users and administrators</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="admin-alerts">Admin Alerts</Label>
                    <p className="text-sm text-gray-500">Receive alerts for important system events</p>
                  </div>
                  <Switch id="admin-alerts" checked={adminAlerts} onCheckedChange={setAdminAlerts} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="user-signup">User Signup Notifications</Label>
                    <p className="text-sm text-gray-500">Get notified when new users register</p>
                  </div>
                  <Switch
                    id="user-signup"
                    checked={userSignupNotifications}
                    onCheckedChange={setUserSignupNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-listing">New Listing Notifications</Label>
                    <p className="text-sm text-gray-500">Get notified when new items are listed</p>
                  </div>
                  <Switch
                    id="new-listing"
                    checked={newListingNotifications}
                    onCheckedChange={setNewListingNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="disputes">Dispute Notifications</Label>
                    <p className="text-sm text-gray-500">Get notified when disputes are opened</p>
                  </div>
                  <Switch id="disputes" checked={disputeNotifications} onCheckedChange={setDisputeNotifications} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Reset to Defaults</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all notification settings to their default values. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleResetSettings()}>Reset Settings</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button onClick={() => handleSaveSettings("notifications")} disabled={isSaving}>
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

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">Require two-factor authentication for admin accounts</p>
                </div>
                <Switch id="two-factor" checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="login-attempts">Max Login Attempts</Label>
                  <Input
                    id="login-attempts"
                    type="number"
                    min="1"
                    max="10"
                    value={loginAttempts}
                    onChange={(e) => setLoginAttempts(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Number of failed login attempts before account lockout</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    min="5"
                    max="1440"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Time before inactive users are automatically logged out</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-policy">Password Policy</Label>
                <Select value={passwordPolicy} onValueChange={setPasswordPolicy}>
                  <SelectTrigger id="password-policy">
                    <SelectValue placeholder="Select password policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (8+ characters)</SelectItem>
                    <SelectItem value="medium">Medium (8+ chars, letters & numbers)</SelectItem>
                    <SelectItem value="high">High (12+ chars, letters, numbers & symbols)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Password requirements for user accounts</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">Security Warning</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Changing security settings may affect user access. Make sure to communicate changes to your team.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Reset to Defaults</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will reset all security settings to their default values. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleResetSettings()}>Reset Settings</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button onClick={() => handleSaveSettings("security")} disabled={isSaving}>
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
      </Tabs>
    </div>
  )
}
