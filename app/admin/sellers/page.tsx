"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Download,
  Unlock,
  Trash2,
  Eye,
  CheckCircle,
  ShoppingBag,
  Star,
  AlertTriangle,
  CheckSquare,
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

// Mock seller data
const mockSellers = []

export default function SellerManagement() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [filteredSellers, setFilteredSellers] = useState(mockSellers)
  const [selectedSeller, setSelectedSeller] = useState<any>(null)
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false)
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter sellers based on search term and status
  useEffect(() => {
    let results = mockSellers

    // Filter by search term
    if (searchTerm) {
      results = results.filter(
        (seller) =>
          seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          seller.location.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      results = results.filter((seller) => seller.status.toLowerCase() === statusFilter.toLowerCase())
    }

    setFilteredSellers(results)
  }, [searchTerm, statusFilter])

  const handleVerifySeller = () => {
    if (!selectedSeller) return

    // Update seller status in the mock data
    const updatedSellers = mockSellers.map((seller) => {
      if (seller.id === selectedSeller.id) {
        return {
          ...seller,
          status: "Verified",
        }
      }
      return seller
    })

    // Update filtered sellers
    const updatedFilteredSellers = filteredSellers.map((seller) => {
      if (seller.id === selectedSeller.id) {
        return {
          ...seller,
          status: "Verified",
        }
      }
      return seller
    })

    // Update state
    setFilteredSellers(updatedFilteredSellers)

    // Show toast notification
    toast({
      title: "Seller Verified",
      description: `${selectedSeller.name} has been verified and can now sell products.`,
    })

    // Close dialog
    setIsVerifyDialogOpen(false)
  }

  const handleSuspendSeller = () => {
    if (!selectedSeller) return

    // Update seller status in the mock data
    const updatedSellers = mockSellers.map((seller) => {
      if (seller.id === selectedSeller.id) {
        return {
          ...seller,
          status: seller.status === "Suspended" ? "Verified" : "Suspended",
        }
      }
      return seller
    })

    // Update filtered sellers
    const updatedFilteredSellers = filteredSellers.map((seller) => {
      if (seller.id === selectedSeller.id) {
        return {
          ...seller,
          status: seller.status === "Suspended" ? "Verified" : "Suspended",
        }
      }
      return seller
    })

    // Update state
    setFilteredSellers(updatedFilteredSellers)

    // Show toast notification
    toast({
      title: selectedSeller.status === "Suspended" ? "Seller Reinstated" : "Seller Suspended",
      description: `${selectedSeller.name} has been ${
        selectedSeller.status === "Suspended" ? "reinstated" : "suspended"
      }.`,
      variant: selectedSeller.status === "Suspended" ? "default" : "destructive",
    })

    // Close dialog
    setIsSuspendDialogOpen(false)
  }

  const handleDeleteSeller = () => {
    if (!selectedSeller) return

    // Remove seller from the mock data
    const updatedSellers = mockSellers.filter((seller) => seller.id !== selectedSeller.id)

    // Update filtered sellers
    const updatedFilteredSellers = filteredSellers.filter((seller) => seller.id !== selectedSeller.id)

    // Update state
    setFilteredSellers(updatedFilteredSellers)

    // Show toast notification
    toast({
      title: "Seller Deleted",
      description: `${selectedSeller.name} has been deleted from the platform.`,
      variant: "destructive",
    })

    // Close dialog
    setIsDeleteDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl text-gray-500">Loading seller data...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Seller Management</h1>
          <p className="text-gray-600">Manage all sellers on the marketplace</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button className="bg-[#004D40] hover:bg-[#00352C] text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Seller
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
                placeholder="Search sellers..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <div className="w-40">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
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

      {/* Sellers Table */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSellers.length > 0 ? (
                filteredSellers.map((seller) => (
                  <TableRow key={seller.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{seller.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{seller.name}</p>
                          <p className="text-sm text-gray-500">{seller.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          seller.status === "Verified"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : seller.status === "Pending"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {seller.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-2 text-gray-500" />
                        {seller.products}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 mr-2 text-amber-500" />
                        {seller.rating > 0 ? seller.rating : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>{seller.sales}</TableCell>
                    <TableCell>{seller.location}</TableCell>
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
                            <Link href={`/admin/sellers/${seller.id}`} className="flex items-center w-full">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {seller.status === "Pending" && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedSeller(seller)
                                setIsVerifyDialogOpen(true)
                              }}
                            >
                              <CheckSquare className="h-4 w-4 mr-2" />
                              Verify Seller
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedSeller(seller)
                              setIsSuspendDialogOpen(true)
                            }}
                          >
                            {seller.status === "Suspended" ? (
                              <>
                                <Unlock className="h-4 w-4 mr-2" />
                                Reinstate Seller
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Suspend Seller
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => {
                              setSelectedSeller(seller)
                              setIsDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Seller
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500 font-medium">No sellers found</p>
                      <p className="text-gray-400 text-sm">Try adjusting your filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Verify Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Seller</DialogTitle>
            <DialogDescription>
              This will verify the seller and allow them to list products on the marketplace.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{selectedSeller?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedSeller?.name}</p>
              <p className="text-sm text-gray-500">{selectedSeller?.email}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVerifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerifySeller} className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify Seller
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend/Reinstate Dialog */}
      <Dialog open={isSuspendDialogOpen} onOpenChange={setIsSuspendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedSeller?.status === "Suspended" ? "Reinstate Seller" : "Suspend Seller"}</DialogTitle>
            <DialogDescription>
              {selectedSeller?.status === "Suspended"
                ? "This will reinstate the seller and allow them to continue selling on the marketplace."
                : "This will suspend the seller and prevent them from selling on the marketplace."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{selectedSeller?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedSeller?.name}</p>
              <p className="text-sm text-gray-500">{selectedSeller?.email}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspendDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSuspendSeller}
              className={
                selectedSeller?.status === "Suspended"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }
            >
              {selectedSeller?.status === "Suspended" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Reinstate Seller
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Suspend Seller
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
            <DialogTitle>Delete Seller</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the seller account and remove all their
              listings from the marketplace.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{selectedSeller?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{selectedSeller?.name}</p>
              <p className="text-sm text-gray-500">{selectedSeller?.email}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteSeller} className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Seller
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
