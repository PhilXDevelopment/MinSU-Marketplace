"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  MessageSquare,
  Heart,
  Share2,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  ChevronLeft,
  Info,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      try {
        const res = await fetch(`/api/products/${params.id}`)
        const json = await res.json()
        if (json.success && json.data) {
          setProduct(json.data)
          // Optionally fetch related products here if you want
        } else {
          setProduct(null)
        }
      } catch (err) {
        setProduct(null)
      }
      setLoading(false)
    }
    fetchProduct()
  }, [params.id])

  const handlePrevImage = () => {
    if (!product) return
    setCurrentImageIndex((prev) => (prev === 0 ? product.additionalImages.length : prev - 1))
  }

  const handleNextImage = () => {
    if (!product) return
    setCurrentImageIndex((prev) => (prev === product.additionalImages.length ? 0 : prev + 1))
  }

  const handleSaveProduct = () => {
    if (!user) {
      localStorage.setItem("minsu-last-intent", `/marketplace/product/${params.id}`)
      router.push("/auth/login")
      return
    }

    setIsSaved(!isSaved)
    toast({
      title: isSaved ? "Removed from saved items" : "Saved to your collection",
      description: isSaved
        ? "This item has been removed from your saved items"
        : "You can view this item in your saved collection",
      variant: isSaved ? "destructive" : "default",
    })
  }

  const handleContactSeller = () => {
    if (!user) {
      localStorage.setItem("minsu-last-intent", `/marketplace/product/${params.id}`)
      router.push("/auth/login")
      return
    }

    toast({
      title: "Message sent",
      description: `Your message has been sent to ${product?.seller}`,
    })
  }

  const handleShare = () => {
    // In a real app, this would use the Web Share API
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Product link has been copied to clipboard",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
            <Link href="/marketplace">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Back to Marketplace</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Determine which image to show
  const additionalImages = product.additionalImages ?? [];
  const displayImage = currentImageIndex === 0 ? product.image : additionalImages[currentImageIndex - 1];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/marketplace">Marketplace</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/marketplace?category=${product.category}`}>{product.category}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-gray-500 font-normal max-w-[150px] truncate">
                {product.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative aspect-video md:aspect-[4/3] w-full">
                <Image src={displayImage || "/placeholder.svg"} alt={product.name} fill className="object-contain" />

                {/* Image navigation */}
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/20 text-white hover:bg-black/40"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-black/20 text-white hover:bg-black/40"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {currentImageIndex + 1} / {additionalImages.length + 1}
                </div>
              </div>

              {/* Thumbnail navigation */}
              <div className="p-4 flex gap-2 overflow-x-auto">
                <button
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                    currentImageIndex === 0 ? "border-green-500" : "border-transparent"
                  }`}
                  onClick={() => setCurrentImageIndex(0)}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={`${product.name} thumbnail`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>

                {additionalImages.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                      currentImageIndex === idx + 1 ? "border-green-500" : "border-transparent"
                    }`}
                    onClick={() => setCurrentImageIndex(idx + 1)}
                  >
                    <div className="relative w-full h-full">
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`${product.name} thumbnail ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              className="bg-white rounded-xl shadow-sm overflow-hidden mt-6 p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
                  {product.category}
                </Badge>
                <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                  {product.condition}
                </Badge>
                <div className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                  <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                  <span className="text-xs">{product.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                  <span>{product.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  <span>Posted {product.postedDate}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-800 mb-2">Description</h2>
                <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-green-100 text-green-600">{product.sellerAvatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-800">{product.seller}</p>
                    <p className="text-xs text-gray-500">Seller</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                  onClick={handleContactSeller}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Seller
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Price and Actions */}
          <div>
            <motion.div
              className="bg-white rounded-xl shadow-sm overflow-hidden p-6 sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Price</p>
                <p className="text-3xl font-bold text-gray-800">₱{product.price.toLocaleString()}</p>
              </div>

              <div className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-11">Buy Now</Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className={`${
                      isSaved
                        ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                        : "text-gray-700 border-gray-200"
                    }`}
                    onClick={handleSaveProduct}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isSaved ? "fill-red-500" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </Button>

                  <Button variant="outline" className="text-gray-700 border-gray-200" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Safety Tips</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <Info className="h-4 w-4 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                    Meet in a public place on campus
                  </li>
                  <li className="flex items-start">
                    <Info className="h-4 w-4 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                    Inspect the item before paying
                  </li>
                  <li className="flex items-start">
                    <Info className="h-4 w-4 mr-2 text-amber-500 mt-0.5 flex-shrink-0" />
                    Never share personal financial information
                  </li>
                </ul>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="link" className="text-green-600 p-0 h-auto">
                      Report this listing
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Report Listing</DialogTitle>
                      <DialogDescription>
                        If you believe this listing violates our community guidelines, please let us know.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-4">
                      {["Prohibited item", "Misleading description", "Suspicious seller", "Scam", "Other"].map(
                        (reason) => (
                          <div key={reason} className="flex items-center space-x-2">
                            <input type="radio" id={reason} name="report-reason" className="h-4 w-4 text-green-600" />
                            <label htmlFor={reason} className="text-sm text-gray-700">
                              {reason}
                            </label>
                          </div>
                        ),
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-green-600 hover:bg-green-700 text-white">Submit Report</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Similar Items</h2>
              <Link href={`/marketplace?category=${product.category}`}>
                <Button variant="ghost" className="text-green-600">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/marketplace/product/${relatedProduct.id}`}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group"
                >
                  <div className="h-48 relative">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {relatedProduct.condition}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg line-clamp-1 text-gray-800 group-hover:text-green-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <span className="text-green-600 font-bold">₱{relatedProduct.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{relatedProduct.category}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="bg-green-50 text-green-600 text-xs">
                            {relatedProduct.sellerAvatar}
                          </AvatarFallback>
                        </Avatar>
                        <span>{relatedProduct.seller}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
