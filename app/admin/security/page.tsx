"use client"

import { useState } from "react"
import { Download, Filter, ArrowUpDown, Shield, Calendar, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

// Mock admin activity logs
const mockActivityLogs = [
  {
    id: "LOG-1001",
    admin: {
      id: "1",
      name: "Admin User",
      email: "admin@minsu.edu.ph",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "User Blocked",
    details: "Blocked user Robert Johnson (ID: 3) for policy violations",
    ip: "192.168.1.1",
    timestamp: "2023-03-21T10:15:00",
    location: "Calapan, Oriental Mindoro",
  },
  {
    id: "LOG-1002",
    admin: {
      id: "1",
      name: "Admin User",
      email: "admin@minsu.edu.ph",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Product Approved",
    details: "Approved 5 new product listings",
    ip: "192.168.1.1",
    timestamp: "2023-03-21T10:30:00",
    location: "Calapan, Oriental Mindoro",
  },
  {
    id: "LOG-1003",
    admin: {
      id: "2",
      name: "Moderator User",
      email: "moderator@minsu.edu.ph",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Dispute Resolved",
    details: "Resolved dispute DSP-1002 between Michael Wilson and Jennifer Martinez",
    ip: "192.168.1.2",
    timestamp: "2023-03-20T14:45:00",
    location: "Bongabong, Oriental Mindoro",
  },
  {
    id: "LOG-1004",
    admin: {
      id: "1",
      name: "Admin User",
      email: "admin@minsu.edu.ph",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Settings Updated",
    details: "Updated platform payment settings",
    ip: "192.168.1.1",
    timestamp: "2023-03-20T11:20:00",
    location: "Calapan, Oriental Mindoro",
  },
  {
    id: "LOG-1005",
    admin: {
      id: "2",
      name: "Moderator User",
      email: "moderator@minsu.edu.ph",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Forum Post Removed",
    details: "Removed inappropriate post in 'Biology' forum",
    ip: "192.168.1.2",
    timestamp: "2023-03-19T16:30:00",
    location: "Bongabong, Oriental Mindoro",
  },
  {
    id: "LOG-1006",
    admin: {
      id: "1",
      name: "Admin User",
      email: "admin@minsu.edu.ph",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "User Role Updated",
    details: "Granted moderator privileges to Jane Smith (ID: 2)",
    ip: "192.168.1.1",
    timestamp: "2023-03-19T10:45:00",
    location: "Calapan, Oriental Mindoro",
  },
  {
    id: "LOG-1007",
    admin: {
      id: "3",
      name: "Support User",
      email: "support@minsu.edu.ph",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Login",
    details: "Admin login successful",
    ip: "192.168.1.3",
    timestamp: "2023-03-19T09:15:00",
    location: "Victoria, Oriental Mindoro",
  },
  {
    id: "LOG-1008",
    admin: {
      id: "1",
      name: "Admin User",
      email: "admin@minsu.edu.ph",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Login",
    details: "Admin login successful",
    ip: "192.168.1.1",
    timestamp: "2023-03-19T08:30:00",
    location: "Calapan, Oriental Mindoro",
  },
  {
    id: "LOG-1009",
    admin: {
      id: "1",
      name: "Admin User",
      email: "admin@minsu.edu.ph",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Backup Created",
    details: "Created platform data backup",
    ip: "192.168.1.1",
    timestamp: "2023-03-18T16:20:00",
    location: "Calapan, Oriental Mindoro",
  },
  {
    id: "LOG-1010",
    admin: {
      id: "3",
      name: "Support User",
      email: "support@minsu.edu.ph",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "Email Template Updated",
    details: "Updated welcome email template",
    ip: "192.168.1.3",
    timestamp: "2023-03-18T14:10:00",
    location: "Victoria, Oriental Mindoro",
  },
]

// Mock security alerts
const mockSecurityAlerts = [
  {
    id: "ALERT-1001",
    type: "Failed Login Attempts",
    details: "Multiple failed login attempts for admin account 'admin@example.com'",
    severity: "high",
    timestamp: "2023-03-21T08:45:00",
    status: "active",
  },
  {
    id: "ALERT-1002",
    type: "Suspicious Activity",
    details: "Unusual number of product approvals from admin Emily Davis",
    severity: "medium",
    timestamp: "2023-03-20T15:30:00",
    status: "investigating",
  },
  {
    id: "ALERT-1003",
    type: "API Rate Limit",
    details: "API rate limit exceeded from IP 203.0.113.1",
    severity: "low",
    timestamp: "2023-03-20T12:15:00",
    status: "resolved",
  },
  {
    id: "ALERT-1004",
    type: "Database Access",
    details: "Unauthorized attempt to access database from unknown IP",
    severity: "high",
    timestamp: "2023-03-19T23:10:00",
    status: "resolved",
  },
  {
    id: "ALERT-1005",
    type: "New Admin Created",
    details: "New admin account created for 'newadmin@example.com'",
    severity: "medium",
    timestamp: "2023-03-19T14:20:00",
    status: "resolved",
  },
]

export default function SecurityPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [adminFilter, setAdminFilter] = useState("all")

  // Filter activity logs based on search term and filters
  const filteredLogs = mockActivityLogs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesAction = actionFilter === "all" || log.action.toLowerCase().includes(actionFilter.toLowerCase())
    const matchesAdmin = adminFilter === "all" || log.admin.id === adminFilter

    return matchesSearch && matchesAction && matchesAdmin
  })

  const handleExportLogs = () => {
    toast({
      title: "Logs exported",
      description: "Activity logs have been exported successfully.",
    })
  }

  const handleDismissAlert = (alertId: string) => {
    toast({
      title: "Alert dismissed",
      description: `Security alert ${alertId} has been dismissed.`,
    })
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "medium":
        return (
          <Badge variant="default" className="bg-yellow-500">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="default" className="bg-green-500">
            Low
          </Badge>
        )
      default:
        return <Badge variant="outline">{severity}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="destructive">Active</Badge>
      case "investigating":
        return (
          <Badge variant="default" className="bg-yellow-500">
            Investigating
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-500">
            Resolved
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Security & Logs</h1>
          <p className="text-gray-500">Monitor platform security and admin activity</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleExportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Alerts</CardTitle>
            <CardDescription>Security alerts requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {mockSecurityAlerts.filter((alert) => alert.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Admin Logins (24h)</CardTitle>
            <CardDescription>Recent admin login activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Failed Login Attempts (24h)</CardTitle>
            <CardDescription>Recent failed login attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="activity">
        <TabsList className="mb-6">
          <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
        </TabsList>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Admin Activity Logs</CardTitle>
              <CardDescription>Track actions taken by administrators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search logs..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-40">
                    <Select value={actionFilter} onValueChange={setActionFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="login">Login</SelectItem>
                        <SelectItem value="user">User Management</SelectItem>
                        <SelectItem value="product">Product Management</SelectItem>
                        <SelectItem value="dispute">Dispute Resolution</SelectItem>
                        <SelectItem value="settings">Settings Changes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-40">
                    <Select value={adminFilter} onValueChange={setAdminFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Admin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Admins</SelectItem>
                        <SelectItem value="1">Admin User</SelectItem>
                        <SelectItem value="2">Moderator User</SelectItem>
                        <SelectItem value="3">Support User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Log ID</TableHead>
                      <TableHead>Admin</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Action
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Timestamp
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={log.admin.avatar} alt={log.admin.name} />
                                <AvatarFallback>{log.admin.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{log.admin.name}</div>
                                <div className="text-xs text-gray-500">{log.admin.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate" title={log.details}>
                              {log.details}
                            </div>
                          </TableCell>
                          <TableCell>{log.ip}</TableCell>
                          <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                          <TableCell>{log.location}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No logs found matching your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>Monitor and respond to security threats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSecurityAlerts.map((alert) => (
                  <Card
                    key={alert.id}
                    className={`border-l-4 ${
                      alert.severity === "high"
                        ? "border-l-red-500"
                        : alert.severity === "medium"
                          ? "border-l-yellow-500"
                          : "border-l-green-500"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <Shield
                              className={`h-5 w-5 ${
                                alert.severity === "high"
                                  ? "text-red-500"
                                  : alert.severity === "medium"
                                    ? "text-yellow-500"
                                    : "text-green-500"
                              }`}
                            />
                            <h3 className="font-medium">{alert.type}</h3>
                            {getSeverityBadge(alert.severity)}
                            {getStatusBadge(alert.status)}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{alert.details}</p>
                          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(alert.timestamp).toLocaleString()}</span>
                            <span>•</span>
                            <span>Alert ID: {alert.id}</span>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-2">
                          {alert.status !== "resolved" && (
                            <>
                              <Button variant="outline" size="sm">
                                Investigate
                              </Button>
                              <Button variant="default" size="sm" onClick={() => handleDismissAlert(alert.id)}>
                                {alert.status === "active" ? "Dismiss" : "Resolve"}
                              </Button>
                            </>
                          )}
                          {alert.status === "resolved" && (
                            <Badge variant="outline" className="text-green-500 border-green-500">
                              Resolved
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Recovery</CardTitle>
              <CardDescription>Manage platform data backups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Backup Schedule</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Daily Backup</h4>
                            <p className="text-sm text-gray-500">Runs at 2:00 AM UTC</p>
                          </div>
                          <Badge variant="outline" className="text-green-500 border-green-500">
                            Active
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Weekly Backup</h4>
                            <p className="text-sm text-gray-500">Runs every Sunday at 3:00 AM UTC</p>
                          </div>
                          <Badge variant="outline" className="text-green-500 border-green-500">
                            Active
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Recent Backups</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Backup ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Created At</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">BKP-20230321</TableCell>
                          <TableCell>Daily</TableCell>
                          <TableCell>1.2 GB</TableCell>
                          <TableCell>Mar 21, 2023, 2:00 AM</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-green-500 border-green-500">
                              Completed
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">BKP-20230320</TableCell>
                          <TableCell>Daily</TableCell>
                          <TableCell>1.2 GB</TableCell>
                          <TableCell>Mar 20, 2023, 2:00 AM</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-green-500 border-green-500">
                              Completed
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">BKP-20230319</TableCell>
                          <TableCell>Weekly</TableCell>
                          <TableCell>1.5 GB</TableCell>
                          <TableCell>Mar 19, 2023, 3:00 AM</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-green-500 border-green-500">
                              Completed
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">BKP-20230318</TableCell>
                          <TableCell>Daily</TableCell>
                          <TableCell>1.2 GB</TableCell>
                          <TableCell>Mar 18, 2023, 2:00 AM</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-green-500 border-green-500">
                              Completed
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Create Manual Backup
                  </Button>
                  <Button variant="outline">Restore from Backup</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
