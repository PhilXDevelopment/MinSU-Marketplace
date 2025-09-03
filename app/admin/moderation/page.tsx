"use client"

import { useState, useEffect } from "react"
import {
  Shield,
  Search,
  Filter,
  MoreHorizontal,
  Flag,
  CheckCircle,
  XCircle,
  MessageSquare,
  ShoppingBag,
  User,
  Eye,
  Trash2,
  Lock,
  Unlock,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Replace the mock data with empty arrays
const initialReportedContent = []
const initialPendingProducts = []
const initialForumPosts = []

export default function ContentModeration() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("reported")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  // State for content with actual data manipulation
  const [reportedContent, setReportedContent] = useState(initialReportedContent)
  const [pendingProducts, setPendingProducts] = useState(initialPendingProducts)
  const [forumPosts, setForumPosts] = useState(initialForumPosts)

  // Filtered content based on search and filters
  const [filteredContent, setFilteredContent] = useState(reportedContent)
  const [filteredProducts, setFilteredProducts] = useState(pendingProducts)
  const [filteredPosts, setFilteredPosts] = useState(forumPosts)

  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false)
  const [isViewRepliesOpen, setIsViewRepliesOpen] = useState(false)
  const [isViewAuthorOpen, setIsViewAuthorOpen] = useState(false)
  const [isViewProductOpen, setIsViewProductOpen] = useState(false)
  const [lockReason, setLockReason] = useState("")
  const [replyText, setReplyText] = useState("")

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Filter reported content based on search term and type
  useEffect(() => {
    let results = reportedContent

    // Filter by search term
    if (searchTerm) {
      results = results.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.reporter.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by type
    if (typeFilter !== "all") {
      results = results.filter((item) => item.type.toLowerCase() === typeFilter.toLowerCase())
    }

    setFilteredContent(results)
  }, [searchTerm, typeFilter, reportedContent])

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      const results = pendingProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProducts(results)
    } else {
      setFilteredProducts(pendingProducts)
    }
  }, [searchTerm, pendingProducts])

  // Filter forum posts based on search term
  useEffect(() => {
    if (searchTerm) {
      const results = forumPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPosts(results)
    } else {
      setFilteredPosts(forumPosts)
    }
  }, [searchTerm, forumPosts])

  const handleApproveItem = () => {
    if (!selectedItem) return

    if (activeTab === "reported") {
      // Update the reported content status
      const updatedContent = reportedContent.map((item) =>
        item.id === selectedItem.id ? { ...item, status: "Approved" } : item,
      )
      setReportedContent(updatedContent)

      toast({
        title: "Report Dismissed",
        description: `The report for "${selectedItem.title}" has been dismissed.`,
      })
    } else if (activeTab === "products") {
      // Update the product status
      const updatedProducts = pendingProducts.map((item) =>
        item.id === selectedItem.id ? { ...item, status: "Approved" } : item,
      )
      setPendingProducts(updatedProducts)

      toast({
        title: "Product Approved",
        description: `"${selectedItem.name}" has been approved and is now listed on the marketplace.`,
      })
    }

    setIsActionDialogOpen(false)
  }

  const handleRejectItem = () => {
    if (!selectedItem) return

    if (activeTab === "reported") {
      // Remove the reported content
      const updatedContent = reportedContent.filter((item) => item.id !== selectedItem.id)
      setReportedContent(updatedContent)

      toast({
        title: "Content Removed",
        description: `The reported content "${selectedItem.title}" has been removed.`,
        variant: "destructive",
      })
    } else if (activeTab === "products") {
      // Update the product status
      const updatedProducts = pendingProducts.map((item) =>
        item.id === selectedItem.id ? { ...item, status: "Rejected" } : item,
      )
      setPendingProducts(updatedProducts)

      toast({
        title: "Product Rejected",
        description: `"${selectedItem.name}" has been rejected and the seller has been notified.`,
        variant: "destructive",
      })
    } else if (activeTab === "forum") {
      // Lock the thread
      const updatedPosts = forumPosts.map((item) =>
        item.id === selectedItem.id ? { ...item, status: "Locked", lockReason } : item,
      )
      setForumPosts(updatedPosts)

      toast({
        title: "Thread Locked",
        description: `The thread "${selectedItem.title}" has been locked.`,
        variant: "destructive",
      })
    }

    setIsActionDialogOpen(false)
    setLockReason("")
  }

  const handleDeleteItem = () => {
    if (!selectedItem) return

    if (activeTab === "reported") {
      // Remove the reported content
      const updatedContent = reportedContent.filter((item) => item.id !== selectedItem.id)
      setReportedContent(updatedContent)
    } else if (activeTab === "products") {
      // Remove the product
      const updatedProducts = pendingProducts.filter((item) => item.id !== selectedItem.id)
      setPendingProducts(updatedProducts)
    } else if (activeTab === "forum") {
      // Remove the forum post
      const updatedPosts = forumPosts.filter((item) => item.id !== selectedItem.id)
      setForumPosts(updatedPosts)
    }

    toast({
      title: "Item Deleted",
      description: `The ${activeTab === "forum" ? "thread" : activeTab === "products" ? "product" : "content"} has been permanently deleted.`,
      variant: "destructive",
    })

    setIsDeleteDialogOpen(false)
  }

  const handleViewDetails = (item: any) => {
    setSelectedItem(item)
    setIsViewDetailsOpen(true)
  }

  const handleViewReplies = (post: any) => {
    setSelectedItem(post)
    setIsViewRepliesOpen(true)
  }

  const handleViewAuthor = (user: any) => {
    setSelectedItem(user)
    setIsViewAuthorOpen(true)
  }

  const handleViewProduct = (product: any) => {
    setSelectedItem(product)
    setIsViewProductOpen(true)
  }

  const handleLockThread = (post: any) => {
    setSelectedItem(post)
    setIsActionDialogOpen(true)
  }

  const handleUnlockThread = (post: any) => {
    // Unlock the thread
    const updatedPosts = forumPosts.map((item) =>
      item.id === post.id ? { ...item, status: "Active", lockReason: "" } : item,
    )
    setForumPosts(updatedPosts)

    toast({
      title: "Thread Unlocked",
      description: `The thread "${post.title}" has been unlocked.`,
    })
  }

  const handleSendReply = () => {
    if (!selectedItem || !replyText.trim()) return

    // Add the reply to the selected post
    const newReply = {
      id: `r${Date.now()}`,
      author: {
        id: "admin",
        name: "Admin",
        avatar: "A",
      },
      content: replyText,
      posted: new Date().toLocaleDateString(),
      likes: 0,
    }

    const updatedPosts = forumPosts.map((post) =>
      post.id === selectedItem.id ? { ...post, replies: [...post.replies, newReply] } : post,
    )

    setForumPosts(updatedPosts)
    setReplyText("")

    toast({
      title: "Reply Sent",
      description: "Your reply has been posted to the thread.",
    })
  }

  const handleNavigateToUser = (userId: string) => {
    toast({
      title: "Navigating to User Profile",
      description: `Viewing user profile with ID: ${userId}`,
    })
    router.push(`/admin/users/${userId}`)
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl text-gray-500">Loading content data...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Content Moderation</h1>
          <p className="text-gray-600">Manage and moderate platform content</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge className="bg-red-500 text-white text-sm">{reportedContent.length} Items Requiring Attention</Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reported" onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reported" className="relative">
            Reported Content
            <Badge className="ml-2 bg-red-500 text-white">{reportedContent.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="products" className="relative">
            Pending Products
            <Badge className="ml-2 bg-amber-500 text-white">{pendingProducts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="forum" className="relative">
            Forum Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reported" className="mt-0">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Reported Content</CardTitle>
              <CardDescription>Review and take action on reported content</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContent.length > 0 ? (
                    filteredContent.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              item.type === "Forum Post"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : item.type === "Product"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-purple-50 text-purple-700 border-purple-200"
                            }
                          >
                            {item.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{item.content}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{item.reporter.avatar}</AvatarFallback>
                            </Avatar>
                            <span>{item.reporter.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.reported}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              item.status === "Pending"
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                : item.status === "Approved"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
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
                              <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedItem(item)
                                  setIsActionDialogOpen(true)
                                }}
                              >
                                <Flag className="h-4 w-4 mr-2" />
                                Take Action
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewAuthor(item.reporter)}>
                                <User className="h-4 w-4 mr-2" />
                                View Reporter
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => {
                                  setSelectedItem(item)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
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
                          <Shield className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-500 font-medium">No reported content found</p>
                          <p className="text-gray-400 text-sm">All clear for now!</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="mt-0">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Pending Products</CardTitle>
              <CardDescription>Review and approve products before they are listed</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Listed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id} className={product.status === "Rejected" ? "bg-red-50" : ""}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-10 h-10 bg-gray-100 rounded cursor-pointer"
                              onClick={() => handleViewProduct(product)}
                            >
                              <img
                                src={
                                  product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"
                                }
                                alt={product.name}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <p
                              className="font-medium cursor-pointer hover:text-blue-600"
                              onClick={() => handleViewProduct(product)}
                            >
                              {product.name}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{product.seller.avatar}</AvatarFallback>
                            </Avatar>
                            <span
                              className="cursor-pointer hover:text-blue-600"
                              onClick={() => handleNavigateToUser(product.seller.id)}
                            >
                              {product.seller.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-green-600">{product.price}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.listed}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {product.status === "Pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() => {
                                    setSelectedItem(product)
                                    setIsActionDialogOpen(true)
                                  }}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => {
                                    setSelectedItem(product)
                                    handleApproveItem()
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                              </>
                            )}
                            {product.status === "Rejected" && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => {
                                  setSelectedItem(product)
                                  handleApproveItem()
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            {product.status === "Approved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => {
                                  setSelectedItem(product)
                                  setIsActionDialogOpen(true)
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Revoke
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-500 font-medium">No pending products found</p>
                          <p className="text-gray-400 text-sm">All products have been reviewed!</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forum" className="mt-0">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Forum Management</CardTitle>
              <CardDescription>Manage forum posts and threads</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Replies</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                      <TableRow key={post.id} className={post.status === "Locked" ? "bg-amber-50" : ""}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {post.status === "Locked" && <Lock className="h-4 w-4 text-amber-600" />}
                            <p
                              className="font-medium cursor-pointer hover:text-blue-600"
                              onClick={() => handleViewDetails(post)}
                            >
                              {post.title}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>{post.author.avatar}</AvatarFallback>
                            </Avatar>
                            <span
                              className="cursor-pointer hover:text-blue-600"
                              onClick={() => handleViewAuthor(post.author)}
                            >
                              {post.author.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell>{post.posted}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-blue-50"
                            onClick={() => handleViewReplies(post)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1 text-blue-600" />
                            {post.replies ? post.replies.length : 0}
                          </Button>
                        </TableCell>
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
                              <DropdownMenuItem onClick={() => handleViewDetails(post)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Post
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewReplies(post)}>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                View Replies
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleViewAuthor(post.author)}>
                                <User className="h-4 w-4 mr-2" />
                                View Author
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {post.status !== "Locked" ? (
                                <DropdownMenuItem
                                  className="text-amber-600 focus:text-amber-600"
                                  onClick={() => handleLockThread(post)}
                                >
                                  <Lock className="h-4 w-4 mr-2" />
                                  Lock Thread
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="text-green-600 focus:text-green-600"
                                  onClick={() => handleUnlockThread(post)}
                                >
                                  <Unlock className="h-4 w-4 mr-2" />
                                  Unlock Thread
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600"
                                onClick={() => {
                                  setSelectedItem(post)
                                  setIsDeleteDialogOpen(true)
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Thread
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
                          <MessageSquare className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-500 font-medium">No forum posts found</p>
                          <p className="text-gray-400 text-sm">Try adjusting your search</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Filters */}
      <Card className="border-none shadow-sm mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={`Search ${activeTab === "reported" ? "reported content" : activeTab === "products" ? "products" : "forum posts"}...`}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {activeTab === "reported" && (
              <div className="w-40">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="forum post">Forum Posts</SelectItem>
                    <SelectItem value="product">Products</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                if (activeTab === "reported") {
                  setTypeFilter("all")
                }
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeTab === "products"
                ? selectedItem?.status === "Rejected"
                  ? "Approve Product"
                  : "Reject Product"
                : activeTab === "forum"
                  ? "Lock Thread"
                  : "Take Action"}
            </DialogTitle>
            <DialogDescription>
              {activeTab === "products"
                ? selectedItem?.status === "Rejected"
                  ? "This will approve the product and make it visible on the marketplace."
                  : "This will reject the product and notify the seller."
                : activeTab === "forum"
                  ? "This will lock the thread and prevent further replies."
                  : "Choose an action to take on this reported content."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedItem && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {activeTab === "products"
                        ? selectedItem.seller?.avatar
                        : activeTab === "forum"
                          ? selectedItem.author?.avatar
                          : selectedItem.reporter?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {activeTab === "products"
                        ? selectedItem.name
                        : activeTab === "forum"
                          ? selectedItem.title
                          : selectedItem.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activeTab === "products"
                        ? `Seller: ${selectedItem.seller?.name}`
                        : activeTab === "forum"
                          ? `Author: ${selectedItem.author?.name}`
                          : `Reported by: ${selectedItem.reporter?.name}`}
                    </p>
                  </div>
                </div>

                {activeTab === "reported" && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700">{selectedItem.content}</p>
                  </div>
                )}

                {activeTab === "forum" && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Reason for locking thread:</p>
                    <Textarea
                      placeholder="Enter reason for locking thread"
                      value={lockReason}
                      onChange={(e) => setLockReason(e.target.value)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
              Cancel
            </Button>
            {activeTab === "products" ? (
              <>
                <Button
                  onClick={selectedItem?.status === "Rejected" ? handleApproveItem : handleRejectItem}
                  className={
                    selectedItem?.status === "Rejected"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }
                >
                  {selectedItem?.status === "Rejected" ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Product
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Product
                    </>
                  )}
                </Button>
              </>
            ) : activeTab === "reported" ? (
              <div className="flex gap-2">
                <Button onClick={handleRejectItem} className="bg-red-600 hover:bg-red-700 text-white">
                  <XCircle className="h-4 w-4 mr-2" />
                  Remove Content
                </Button>
                <Button onClick={handleApproveItem} className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Dismiss Report
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleRejectItem}
                className="bg-amber-600 hover:bg-amber-700 text-white"
                disabled={!lockReason.trim()}
              >
                <Lock className="h-4 w-4 mr-2" />
                Lock Thread
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {activeTab === "forum" ? "Thread" : "Content"}</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {activeTab === "forum" ? "thread" : "content"} and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            {selectedItem && (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {activeTab === "products"
                      ? selectedItem.seller?.avatar
                      : activeTab === "forum"
                        ? selectedItem.author?.avatar
                        : selectedItem.reporter?.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {activeTab === "products"
                      ? selectedItem.name
                      : activeTab === "forum"
                        ? selectedItem.title
                        : selectedItem.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {activeTab === "products"
                      ? `Seller: ${selectedItem.seller?.name}`
                      : activeTab === "forum"
                        ? `Author: ${selectedItem.author?.name}`
                        : `Reported by: ${selectedItem.reporter?.name}`}
                  </p>
                </div>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete {activeTab === "forum" ? "Thread" : "Content"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {activeTab === "products"
                ? "Product Details"
                : activeTab === "forum"
                  ? "Thread Details"
                  : "Report Details"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedItem && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {activeTab === "products"
                        ? selectedItem.seller?.avatar
                        : activeTab === "forum"
                          ? selectedItem.author?.avatar
                          : selectedItem.reporter?.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">
                      {activeTab === "products"
                        ? selectedItem.name
                        : activeTab === "forum"
                          ? selectedItem.title
                          : selectedItem.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {activeTab === "products"
                        ? `Listed by ${selectedItem.seller?.name} on ${selectedItem.listed}`
                        : activeTab === "forum"
                          ? `Posted by ${selectedItem.author?.name} on ${selectedItem.posted}`
                          : `Reported by ${selectedItem.reporter?.name} on ${selectedItem.reported}`}
                    </p>
                  </div>
                </div>

                {activeTab === "products" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Price</p>
                      <p className="font-bold text-green-600">{selectedItem.price}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Category</p>
                      <p>{selectedItem.category}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <Badge
                        className={
                          selectedItem.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : selectedItem.status === "Approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {selectedItem.status}
                      </Badge>
                    </div>
                  </div>
                )}

                {activeTab === "forum" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Category</p>
                        <p>{selectedItem.category}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Replies</p>
                        <p>{selectedItem.replies ? selectedItem.replies.length : 0}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <Badge
                          className={
                            selectedItem.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          }
                        >
                          {selectedItem.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Views</p>
                        <p>{selectedItem.views}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Content</p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-700">{selectedItem.content}</p>
                      </div>
                    </div>
                    {selectedItem.status === "Locked" && selectedItem.lockReason && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Lock Reason</p>
                        <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                          <p className="text-amber-800">{selectedItem.lockReason || "No reason provided"}</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {activeTab === "reported" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Type</p>
                        <Badge
                          variant="outline"
                          className={
                            selectedItem.type === "Forum Post"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : selectedItem.type === "Product"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-purple-50 text-purple-700 border-purple-200"
                          }
                        >
                          {selectedItem.type}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-500">Status</p>
                        <Badge
                          className={
                            selectedItem.status === "Pending"
                              ? "bg-amber-100 text-amber-800"
                              : selectedItem.status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                          }
                        >
                          {selectedItem.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500">Report Content</p>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <p className="text-gray-700">{selectedItem.content}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDetailsOpen(false)}>
              Close
            </Button>
            {activeTab === "reported" && (
              <div className="flex gap-2">
                <Button onClick={handleRejectItem} className="bg-red-600 hover:bg-red-700 text-white">
                  <XCircle className="h-4 w-4 mr-2" />
                  Remove Content
                </Button>
                <Button onClick={handleApproveItem} className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Dismiss Report
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Product Dialog */}
      <Dialog open={isViewProductOpen} onOpenChange={setIsViewProductOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="bg-gray-100 rounded-md overflow-hidden h-64 flex items-center justify-center">
                  {selectedItem.images && selectedItem.images.length > 0 ? (
                    <img
                      src={selectedItem.images[0] || "/placeholder.svg"}
                      alt={selectedItem.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src="/placeholder.svg?height=300&width=300"
                      alt="No image available"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedItem.name}</h3>
                  <p className="text-sm text-gray-500">
                    Listed by {selectedItem.seller.name} on {selectedItem.listed}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Price</p>
                    <p className="font-bold text-green-600">{selectedItem.price}</p>
                    {selectedItem.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">{selectedItem.originalPrice}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p>{selectedItem.category}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Condition</p>
                    <p>{selectedItem.condition}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge
                      className={
                        selectedItem.status === "Pending"
                          ? "bg-amber-100 text-amber-800"
                          : selectedItem.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }
                    >
                      {selectedItem.status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Description</p>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-gray-700">{selectedItem.description}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">Seller Information</p>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{selectedItem.seller.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedItem.seller.name}</p>
                        <p className="text-sm text-gray-500">{selectedItem.seller.location}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <div>
                        <p className="text-sm text-gray-500">Rating</p>
                        <p className="font-medium">{selectedItem.seller.rating} / 5</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium">{selectedItem.seller.joinDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewProductOpen(false)}>
              Close
            </Button>
            <div className="flex gap-2">
              {selectedItem?.status === "Pending" && (
                <>
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() => {
                      setIsViewProductOpen(false)
                      setIsActionDialogOpen(true)
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      handleApproveItem()
                      setIsViewProductOpen(false)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                </>
              )}
              {selectedItem?.status === "Rejected" && (
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    handleApproveItem()
                    setIsViewProductOpen(false)
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              )}
              {selectedItem?.status === "Approved" && (
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    setIsViewProductOpen(false)
                    setIsActionDialogOpen(true)
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Revoke
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Replies Dialog */}
      <Dialog open={isViewRepliesOpen} onOpenChange={setIsViewRepliesOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Thread Replies</DialogTitle>
            <DialogDescription>{selectedItem?.title}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedItem && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{selectedItem.author.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedItem.author.name}</p>
                      <p className="text-xs text-gray-500">{selectedItem.posted}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-700">{selectedItem.content}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium">
                      Replies ({selectedItem.replies ? selectedItem.replies.length : 0})
                    </h4>
                    <Badge
                      className={
                        selectedItem.status === "Locked" ? "bg-amber-100 text-amber-800" : "bg-green-100 text-green-800"
                      }
                    >
                      {selectedItem.status}
                    </Badge>
                  </div>

                  {selectedItem.replies && selectedItem.replies.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {selectedItem.replies.map((reply: any) => (
                        <div key={reply.id} className="bg-gray-50 p-4 rounded-md">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{reply.author.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{reply.author.name}</p>
                              <p className="text-xs text-gray-500">{reply.posted}</p>
                            </div>
                          </div>
                          <p className="mt-2 text-gray-700">{reply.content}</p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Reply
                            </Button>
                            <span className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                              {reply.likes} likes
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-md">
                      <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No replies yet</p>
                    </div>
                  )}
                </div>

                {selectedItem.status !== "Locked" && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Add Admin Reply</p>
                    <Textarea
                      placeholder="Type your reply here..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button onClick={handleSendReply} disabled={!replyText.trim()} className="w-full">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Post Reply as Admin
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewRepliesOpen(false)}>
              Close
            </Button>
            {selectedItem?.status !== "Locked" ? (
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => {
                  setIsViewRepliesOpen(false)
                  handleLockThread(selectedItem)
                }}
              >
                <Lock className="h-4 w-4 mr-2" />
                Lock Thread
              </Button>
            ) : (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  handleUnlockThread(selectedItem)
                  setIsViewRepliesOpen(false)
                }}
              >
                <Unlock className="h-4 w-4 mr-2" />
                Unlock Thread
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Author Dialog */}
      <Dialog open={isViewAuthorOpen} onOpenChange={setIsViewAuthorOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="py-4 space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 mb-4">
                  <AvatarFallback className="text-xl">{selectedItem.avatar}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold">{selectedItem.name}</h3>
                <p className="text-gray-500">{selectedItem.location}</p>
                {selectedItem.program && (
                  <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-100">{selectedItem.program}</Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedItem.joinDate && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Member Since</p>
                    <p>{selectedItem.joinDate}</p>
                  </div>
                )}
                {selectedItem.rating && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Rating</p>
                    <p>{selectedItem.rating} / 5</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewAuthorOpen(false)
                    handleNavigateToUser(selectedItem.id)
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                  <Flag className="h-4 w-4 mr-2" />
                  Flag User
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewAuthorOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
