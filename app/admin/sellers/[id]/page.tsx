"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ShoppingBag,
  Star,
  CreditCard,
  CheckCircle,
  Ban,
  Trash2,
  MessageSquare,
  Eye,
  BarChart3,
  History,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
const mockSellers = [
  {
    id: "1",
    name: "David Lee",
    email: "lee.david@minsu.edu.ph",
    status: "Verified",
    joinDate: "Dec 10, 2024",
    lastActive: "Mar 21, 2025",
    avatar: "D",
    products: 15,
    rating: 4.8,
    sales: 42,
    totalEarnings: 18750,
    location: "Calapan, Oriental Mindoro",
    phone: "+63 912 345 6789",
    department: "Computer Science",
    yearLevel: "3rd Year",
    bio: "Computer Science student selling tech gadgets and accessories. Fast delivery within campus.",
  },
  {
    id: "2",
    name: "Sarah Garcia",
    email: "garcia.sarah@minsu.edu.ph",
    status: "Pending",
    joinDate: "Mar 18, 2025",
    lastActive: "Mar 18, 2025",
    avatar: "S",
    products: 3,
    rating: 0,
    sales: 0,
    totalEarnings: 0,
    location: "Victoria, Oriental Mindoro",
    phone: "+63 923 456 7890",
    department: "Education",
    yearLevel: "2nd Year",
    bio: "Education student selling secondhand textbooks and study materials.",
  },
  {
    id: "3",
    name: "Mark Reyes",
    email: "reyes.mark@minsu.edu.ph",
    status: "Verified",
    joinDate: "Jan 15, 2025",
    lastActive: "Mar 20, 2025",
    avatar: "M",
    products: 8,
    rating: 4.5,
    sales: 27,
    totalEarnings: 12350,
    location: "Bongabong, Oriental Mindoro",
    phone: "+63 934 567 8901",
    department: "Business Administration",
    yearLevel: "4th Year",
    bio: "Business student selling handmade crafts and personalized items. Custom orders welcome.",
  },
  {
    id: "4",
    name: "Ana Santos",
    email: "santos.ana@minsu.edu.ph",
    status: "Suspended",
    joinDate: "Feb 5, 2025",
    lastActive: "Mar 10, 2025",
    avatar: "A",
    products: 12,
    rating: 3.2,
    sales: 18,
    totalEarnings: 8200,
    location: "Calapan, Oriental Mindoro",
    phone: "+63 945 678 9012",
    department: "Fine Arts",
    yearLevel: "3rd Year",
    bio: "Arts student selling paintings, sketches, and art supplies. Suspended for policy violations.",
  },
  {
    id: "5",
    name: "John Tan",
    email: "tan.john@minsu.edu.ph",
    status: "Verified",
    joinDate: "Dec 20, 2024",
    lastActive: "Mar 21, 2025",
    avatar: "J",
    products: 21,
    rating: 4.9,
    sales: 56,
    totalEarnings: 24500,
    location: "Victoria, Oriental Mindoro",
    phone: "+63 956 789 0123",
    department: "Engineering",
    yearLevel: "4th Year",
    bio: "Engineering student selling electronics, calculators, and engineering tools. Fast and reliable service.",
  },
]

// Mock products data
const mockProducts = [
  {
    id: "p1",
    sellerId: "1",
    name: "TI-84 Plus Calculator",
    price: 2500,
    category: "Electronics",
    condition: "Like New",
    listed: "Feb 15, 2025",
    status: "Active",
  },
  {
    id: "p2",
    sellerId: "1",
    name: "Wireless Mouse",
    price: 650,
    category: "Electronics",
    condition: "New",
    listed: "Mar 1, 2025",
    status: "Active",
  },
  {
    id: "p3",
    sellerId: "1",
    name: "USB-C Hub",
    price: 1200,
    category: "Electronics",
    condition: "New",
    listed: "Mar 10, 2025",
    status: "Active",
  },
  {
    id: "p4",
    sellerId: "2",
    name: "Psychology Textbook",
    price: 800,
    category: "Books",
    condition: "Good",
    listed: "Mar 18, 2025",
    status: "Pending",
  },
  {
    id: "p5",
    sellerId: "2",
    name: "Educational Theory Notes",
    price: 350,
    category: "Books",
    condition: "Good",
    listed: "Mar 18, 2025",
    status: "Pending",
  },
  {
    id: "p6",
    sellerId: "3",
    name: "Handmade Notebook",
    price: 250,
    category: "Stationery",
    condition: "New",
    listed: "Feb 20, 2025",
    status: "Active",
  },
  {
    id: "p7",
    sellerId: "3",
    name: "Custom Planner",
    price: 450,
    category: "Stationery",
    condition: "New",
    listed: "Mar 5, 2025",
    status: "Active",
  },
  {
    id: "p8",
    sellerId: "4",
    name: "Watercolor Set",
    price: 750,
    category: "Art Supplies",
    condition: "New",
    listed: "Feb 10, 2025",
    status: "Inactive",
  },
  {
    id: "p9",
    sellerId: "4",
    name: "Canvas (12x16)",
    price: 350,
    category: "Art Supplies",
    condition: "New",
    listed: "Feb 28, 2025",
    status: "Inactive",
  },
  {
    id: "p10",
    sellerId: "5",
    name: "Arduino Starter Kit",
    price: 1800,
    category: "Electronics",
    condition: "New",
    listed: "Jan 15, 2025",
    status: "Active",
  },
  {
    id: "p11",
    sellerId: "5",
    name: "Soldering Iron Kit",
    price: 950,
    category: "Tools",
    condition: "Like New",
    listed: "Feb 5, 2025",
    status: "Active",
  },
]

// Mock reviews data
const mockReviews = [
  {
    id: "r1",
    sellerId: "1",
    reviewer: "Maria Cruz",
    rating: 5,
    comment: "Great seller! Fast delivery and item was exactly as described.",
    date: "Mar 15, 2025",
  },
  {
    id: "r2",
    sellerId: "1",
    reviewer: "Juan Dela Cruz",
    rating: 4,
    comment: "Good transaction. Responsive seller.",
    date: "Mar 10, 2025",
  },
  {
    id: "r3",
    sellerId: "3",
    reviewer: "Elena Santos",
    rating: 5,
    comment: "Beautiful handmade items. Will buy again!",
    date: "Mar 12, 2025",
  },
  {
    id: "r4",
    sellerId: "3",
    reviewer: "Miguel Ramos",
    rating: 4,
    comment: "Nice quality products. Seller was very accommodating.",
    date: "Feb 28, 2025",
  },
  {
    id: "r5",
    sellerId: "4",
    reviewer: "Sophia Reyes",
    rating: 2,
    comment: "Item arrived damaged. Seller was difficult to reach.",
    date: "Mar 5, 2025",
  },
  {
    id: "r6",
    sellerId: "5",
    reviewer: "Lucas Garcia",
    rating: 5,
    comment: "Excellent quality Arduino kit. Seller provided helpful tips too!",
    date: "Mar 18, 2025",
  },
  {
    id: "r7",
    sellerId: "5",
    reviewer: "Isabella Lim",
    rating: 5,
    comment: "Fast shipping and great packaging. Very professional seller.",
    date: "Mar 10, 2025",
  },
]

// Mock activity history
const mockActivity = [
  {
    id: "a1",
    sellerId: "1",
    action: "Listed new product",
    details: "USB-C Hub",
    date: "Mar 10, 2025",
  },
  {
    id: "a2",
    sellerId: "1",
    action: "Completed sale",
    details: "Wireless Mouse to Juan Dela Cruz",
    date: "Mar 8, 2025",
  },
  {
    id: "a3",
    sellerId: "1",
    action: "Updated product",
    details: "TI-84 Plus Calculator (price reduced)",
    date: "Mar 5, 2025",
  },
  {
    id: "a4",
    sellerId: "2",
    action: "Account created",
    details: "Seller account pending verification",
    date: "Mar 18, 2025",
  },
  {
    id: "a5",
    sellerId: "2",
    action: "Listed new product",
    details: "Psychology Textbook",
    date: "Mar 18, 2025",
  },
  {
    id: "a6",
    sellerId: "3",
    action: "Completed sale",
    details: "Custom Planner to Elena Santos",
    date: "Mar 12, 2025",
  },
  {
    id: "a7",
    sellerId: "4",
    action: "Account suspended",
    details: "Multiple policy violations",
    date: "Mar 10, 2025",
  },
  {
    id: "a8",
    sellerId: "5",
    action: "Completed sale",
    details: "Arduino Starter Kit to Lucas Garcia",
    date: "Mar 18, 2025",
  },
]

export default function SellerDetails() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [seller, setSeller] = useState<any>(null)
  const [sellerProducts, setSellerProducts] = useState<any[]>([])
  const [sellerReviews, setSellerReviews] = useState<any[]>([])
  const [sellerActivity, setSellerActivity] = useState<any[]>([])
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      const sellerId = params.id as string
      const foundSeller = mockSellers.find((s) => s.id === sellerId)

      if (foundSeller) {
        setSeller(foundSeller)
        setSellerProducts(mockProducts.filter((p) => p.sellerId === sellerId))
        setSellerReviews(mockReviews.filter((r) => r.sellerId === sellerId))
        setSellerActivity(mockActivity.filter((a) => a.sellerId === sellerId))
      }

      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.id])

  const handleVerifySeller = () => {
    if (!seller) return

    // Update seller status
    setSeller({
      ...seller,
      status: "Verified",
    })

    // Show toast notification
    toast({
      title: "Seller Verified",
      description: `${seller.name} has been verified and can now sell products.`,
    })

    // Close dialog
    setIsVerifyDialogOpen(false)
  }

  const handleSuspendSeller = () => {
    if (!seller) return

    // Update seller status
    setSeller({
      ...seller,
      status: seller.status === "Suspended" ? "Verified" : "Suspended",
    })

    // Show toast notification
    toast({
      title: seller.status === "Suspended" ? "Seller Reinstated" : "Seller Suspended",
      description: `${seller.name} has been ${seller.status === "Suspended" ? "reinstated" : "suspended"}.`,
      variant: seller.status === "Suspended" ? "default" : "destructive",
    })

    // Close dialog
    setIsSuspendDialogOpen(false)
  }

  const handleDeleteSeller = () => {
    if (!seller) return

    // Show toast notification
    toast({
      title: "Seller Deleted",
      description: `${seller.name} has been deleted from the platform.`,
      variant: "destructive",
    })

    // Close dialog and navigate back
    setIsDeleteDialogOpen(false)
    router.push("/admin/sellers")
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl text-gray-500">Loading seller data...</div>
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="p-6">
        <Button variant="outline" onClick={() => router.push("/admin/sellers")} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sellers
        </Button>
        <div className="flex flex-col items-center justify-center py-12">
          <User className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Seller Not Found</h2>
          <p className="text-gray-600 mb-6">The seller you are looking for does not exist or has been removed.</p>
          <Button onClick={() => router.push("/admin/sellers")}>Return to Seller Management</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <Button variant="outline" onClick={() => router.push("/admin/sellers")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Sellers
      </Button>

      {/* Seller Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <Card className="w-full md:w-2/3">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-2xl">{seller.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800">{seller.name}</h1>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {seller.email}
                    </div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      {seller.location}
                    </div>
                  </div>
                  <Badge
                    className={
                      seller.status === "Verified"
                        ? "bg-green-100 text-green-800 hover:bg-green-100 h-fit"
                        : seller.status === "Pending"
                          ? "bg-amber-100 text-amber-800 hover:bg-amber-100 h-fit"
                          : "bg-red-100 text-red-800 hover:bg-red-100 h-fit"
                    }
                  >
                    {seller.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Joined: {seller.joinDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Last Active: {seller.lastActive}</span>
                  </div>
                  <div className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Products: {seller.products}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-2 text-amber-500" />
                    <span className="text-sm text-gray-600">Rating: {seller.rating > 0 ? seller.rating : "N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Total Sales: {seller.sales} (₱{seller.totalEarnings.toLocaleString()})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle>Seller Actions</CardTitle>
            <CardDescription>Manage this seller account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {seller.status === "Pending" && (
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setIsVerifyDialogOpen(true)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Verify Seller
              </Button>
            )}
            <Button
              className={`w-full ${
                seller.status === "Suspended"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }`}
              onClick={() => setIsSuspendDialogOpen(true)}
            >
              {seller.status === "Suspended" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Reinstate Seller
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend Seller
                </>
              )}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push(`/admin/users/${seller.id}`)}>
              <User className="h-4 w-4 mr-2" />
              View User Profile
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push(`/messages?user=${seller.id}`)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Message Seller
            </Button>
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Seller
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Seller Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Seller Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{seller.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{seller.phone}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{seller.location}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Academic Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{seller.department}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{seller.yearLevel}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-medium text-gray-800 mb-2">Bio</h3>
            <p className="text-gray-600">{seller.bio}</p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Products, Reviews, and Activity */}
      <Tabs defaultValue="products">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="activity">Activity History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products ({sellerProducts.length})</CardTitle>
              <CardDescription>Products listed by this seller</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Listed Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellerProducts.length > 0 ? (
                    sellerProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>₱{product.price.toLocaleString()}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.condition}</TableCell>
                        <TableCell>{product.listed}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              product.status === "Active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : product.status === "Pending"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                            }
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/marketplace/product/${product.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <ShoppingBag className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-500 font-medium">No products found</p>
                          <p className="text-gray-400 text-sm">This seller hasn't listed any products yet</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Reviews ({sellerReviews.length})</CardTitle>
              <CardDescription>Customer reviews for this seller</CardDescription>
            </CardHeader>
            <CardContent>
              {sellerReviews.length > 0 ? (
                <div className="space-y-6">
                  {sellerReviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between mb-2">
                        <div className="font-medium">{review.reviewer}</div>
                        <div className="text-sm text-gray-500">{review.date}</div>
                      </div>
                      <div className="flex items-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <Star className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 font-medium">No reviews yet</p>
                  <p className="text-gray-400 text-sm">This seller hasn't received any reviews</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity History Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Recent activity for this seller</CardDescription>
            </CardHeader>
            <CardContent>
              {sellerActivity.length > 0 ? (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                  <div className="space-y-6">
                    {sellerActivity.map((activity) => (
                      <div key={activity.id} className="relative pl-10">
                        <div className="absolute left-0 top-1 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <History className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <p className="font-medium text-gray-800">{activity.action}</p>
                            <p className="text-gray-600">{activity.details}</p>
                          </div>
                          <div className="text-sm text-gray-500 mt-1 md:mt-0">{activity.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <History className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 font-medium">No activity recorded</p>
                  <p className="text-gray-400 text-sm">This seller has no recorded activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Seller Analytics</CardTitle>
              <CardDescription>Performance metrics for this seller</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <CreditCard className="h-8 w-8 text-[#004D40] mb-2" />
                      <p className="text-sm text-gray-500">Total Sales</p>
                      <p className="text-2xl font-bold">₱{seller.totalEarnings.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">{seller.sales} items sold</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <Star className="h-8 w-8 text-amber-500 mb-2" />
                      <p className="text-sm text-gray-500">Average Rating</p>
                      <p className="text-2xl font-bold">{seller.rating > 0 ? seller.rating : "N/A"}</p>
                      <p className="text-sm text-gray-500">{sellerReviews.length} reviews</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center">
                      <BarChart3 className="h-8 w-8 text-blue-500 mb-2" />
                      <p className="text-sm text-gray-500">Conversion Rate</p>
                      <p className="text-2xl font-bold">
                        {seller.sales > 0 ? `${((seller.sales / seller.products) * 100).toFixed(1)}%` : "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">{seller.products} products listed</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Detailed Analytics Coming Soon</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    We're working on more detailed analytics for seller performance, including sales trends, customer
                    demographics, and product performance metrics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
              <AvatarFallback>{seller?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{seller?.name}</p>
              <p className="text-sm text-gray-500">{seller?.email}</p>
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
            <DialogTitle>{seller?.status === "Suspended" ? "Reinstate Seller" : "Suspend Seller"}</DialogTitle>
            <DialogDescription>
              {seller?.status === "Suspended"
                ? "This will reinstate the seller and allow them to continue selling on the marketplace."
                : "This will suspend the seller and prevent them from selling on the marketplace."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-4 py-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{seller?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{seller?.name}</p>
              <p className="text-sm text-gray-500">{seller?.email}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSuspendDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSuspendSeller}
              className={
                seller?.status === "Suspended"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-amber-600 hover:bg-amber-700 text-white"
              }
            >
              {seller?.status === "Suspended" ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Reinstate Seller
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4 mr-2" />
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
              <AvatarFallback>{seller?.avatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{seller?.name}</p>
              <p className="text-sm text-gray-500">{seller?.email}</p>
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

function Phone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function GraduationCap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  )
}

function BookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}
