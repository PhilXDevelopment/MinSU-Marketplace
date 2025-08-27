"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Download,
  Lock,
  Unlock,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Mock user data with updated roles
const mockUsers = []

export default function UserManagement() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter users based on search term, role, and status
  useEffect(() => {
    let results = mockUsers

    // Filter by search term
    if (searchTerm) {
      results = results.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by role
    if (roleFilter !== "all") {
      results = results.filter((user) => user.role.toLowerCase() === roleFilter.toLowerCase())
    }

    // Filter by status
    if (statusFilter !== "all") {
      results = results.filter((user) => user.status.toLowerCase() === statusFilter.toLowerCase())
    }

    setFilteredUsers(results)
  }, [searchTerm, roleFilter, statusFilter])

  const handleBlockUser = () => {
    if (!selectedUser) return

    // Update user status in the mock data
    const updatedUsers = mockUsers.map((user) => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          status: user.status === "Blocked" ? "Active" : "Blocked",
        }
      }
      return user
    })

    // Update filtered users
    const updatedFilteredUsers = filteredUsers.map((user) => {
      if (user.id === selectedUser.id) {
        return {
          ...user,
          status: user.status === "Blocked" ? "Active" : "Blocked",
        }
      }
      return user
    })

    // Update state
    setFilteredUsers(updatedFilteredUsers)

    // Show toast notification
    toast({
      title: selectedUser.status === "Blocked" ? "User Unblocked" : "User Blocked",
      description: `${selectedUser.name} has been ${selectedUser.status === "Blocked" ? "unblocked" : "blocked"}.`,
    })

    // Close dialog
    setIsBlockDialogOpen(false)
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return

    // Remove user from the mock data
    const updatedUsers = mockUsers.filter((user) => user.id !== selectedUser.id)

    // Update filtered users
    const updatedFilteredUsers = filteredUsers.filter((user) => user.id !== selectedUser.id)

    // Update state
    setFilteredUsers(updatedFilteredUsers)

    // Show toast notification
    toast({
      title: "User Deleted",
      description: `${selectedUser.name} has been deleted.`,
      variant: "destructive",
    })

    // Close dialog
    setIsDeleteDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl text-gray-500">Loading user data...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600">Manage all users on the platform</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button className="bg-[#004D40] hover:bg-[#00352C] text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-none shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-40">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setRoleFilter("all")
                  setStatusFilter("all")
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{user.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === "Admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : user.role === "Developer"
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : user.role === "Moderator"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          user.status === "Active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : user.status === "Inactive"
                              ? "bg-gray-100 text-gray-800 hover:bg-gray-100"
                              : user.status === "Blocked"
                                ? "bg-red-100 text-red-800 hover:bg-red-100"
                                : "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Link href={`/admin/users/${user.id}`} className="flex items-center w-full">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user)
                              setIsBlockDialogOpen(true)
                            }}
                          >
                            {user.status === "Blocked" ? (
                              <>
                                <Unlock className="h-4 w-4 mr-2" />
                                Unblock User
                              </>
                            ) : (
                              <>
                                <Lock className="h-4 w-4 mr-2" />
                                Block User
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => {
                              setSelectedUser(user)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500 font-medium">No users found</p>
                      <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Block/Unblock Dialog */}
      <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser?.status === "Blocked" ? "Unblock User" : "Block User"}</DialogTitle>
            <DialogDescription>
              {selectedUser?.status === "Blocked"
                ? "This will allow the user to access the platform again."
                : "This will prevent the user from accessing the platform."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{selectedUser?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedUser?.name}</p>
              <p className="text-sm text-gray-500">{selectedUser?.email}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlockDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleBlockUser}
              className={
                selectedUser?.status === "Blocked"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }
            >
              {selectedUser?.status === "Blocked" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Unblock User
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 mr-2" />
                  Block User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the user account and remove their data from our
              servers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{selectedUser?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedUser?.name}</p>
              <p className="text-sm text-gray-500">{selectedUser?.email}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
