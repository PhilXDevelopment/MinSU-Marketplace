"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, X, Camera, Check, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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

// Categories for selection
const categories = [
  "Books",
  "Electronics",
  "Furniture",
  "Lab Equipment",
  "Tools",
  "Appliances",
  "Clothing",
  "Sports",
  "Other",
]

// Conditions for selection
const conditions = ["New", "Like New", "Good", "Used", "For parts"]

// Campuses for selection
const campuses = ["Main Campus", "Calapan Campus", "Bongabong Campus"]

// Buildings for selection
const buildings = [
  "Admin Building",
  "Canteen",
  "IT Building",
  "CAAF Building",
  "IABE Building",
  "CTE Building",
  "CME Building",
  "CAS Building",
  "CCJE Building",
  "IF Building",
]

// Dormitories for selection
const dormitories = ["Boys Dorm A", "Boys Dorm B", "Girls Dorm A", "Girls Dorm B"]

export default function SellItemPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [condition, setCondition] = useState("")
  const [campus, setCampus] = useState("")
  const [location, setLocation] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  const handleAddImage = () => {
    if (images.length >= 5) {
      toast({
        title: "Maximum images reached",
        description: "You can upload a maximum of 5 images",
        variant: "destructive",
      })
      return
    }

    // Simulate image upload by adding a placeholder
    setImages([...images, `/placeholder.svg?height=600&width=600&text=Image ${images.length + 1}`])
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, "")
    setPrice(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!name.trim()) {
      toast({
        title: "Missing name",
        description: "Please provide a name for your item",
        variant: "destructive",
      })
      return
    }

    if (!price) {
      toast({
        title: "Missing price",
        description: "Please provide a price for your item",
        variant: "destructive",
      })
      return
    }

    if (!description.trim()) {
      toast({
        title: "Missing description",
        description: "Please provide a description for your item",
        variant: "destructive",
      })
      return
    }

    if (!category) {
      toast({
        title: "Missing category",
        description: "Please select a category for your item",
        variant: "destructive",
      })
      return
    }

    if (!condition) {
      toast({
        title: "Missing condition",
        description: "Please select the condition of your item",
        variant: "destructive",
      })
      return
    }

    if (!campus) {
      toast({
        title: "Missing campus",
        description: "Please select a campus for pickup",
        variant: "destructive",
      })
      return
    }

    if (!location) {
      toast({
        title: "Missing location",
        description: "Please select a specific pickup location",
        variant: "destructive",
      })
      return
    }

    if (images.length === 0) {
      toast({
        title: "Missing images",
        description: "Please add at least one image of your item",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const productData = {
        name,
        description,
        price: Number(price),
        category,
        condition,
        location: `${campus} - ${location}`,
        image: images[0], // Only save the first image for now
        seller_id: user?.id,
      }
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      })
      const result = await response.json()
      if (result.success) {
        toast({ title: "Product listed!", description: "Your item has been added to the marketplace." })
        router.push("/marketplace")
      } else {
        toast({ title: "Failed to list product", description: result.message || "An error occurred.", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Failed to list product", description: "An error occurred.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePreview = () => {
    if (!name || !price || !description || !category || !condition || !campus || !location || images.length === 0) {
      toast({
        title: "Incomplete listing",
        description: "Please fill in all required fields to preview your listing",
        variant: "destructive",
      })
      return
    }

    setShowPreview(!showPreview)
  }

  if (!user) {
    return null // Don't render anything if redirecting
  }

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
              <BreadcrumbLink className="text-gray-500 font-normal">Sell an Item</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center mb-6">
              <Link href="/marketplace">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Marketplace
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">Sell an Item</h1>
            </div>

            {!showPreview ? (
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Create Your Listing</CardTitle>
                  <CardDescription>Provide details about the item you want to sell</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Item Name
                      </label>
                      <Input
                        id="name"
                        placeholder="e.g., Calculus Textbook"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="price" className="text-sm font-medium text-gray-700">
                        Price (₱)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                          ₱
                        </span>
                        <Input
                          id="price"
                          placeholder="e.g., 500"
                          value={price}
                          onChange={handlePriceChange}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <Textarea
                        id="description"
                        placeholder="Describe your item in detail..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="min-h-[150px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="category" className="text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <Select value={category} onValueChange={setCategory}>
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="condition" className="text-sm font-medium text-gray-700">
                          Condition
                        </label>
                        <Select value={condition} onValueChange={setCondition}>
                          <SelectTrigger id="condition">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            {conditions.map((cond) => (
                              <SelectItem key={cond} value={cond}>
                                {cond}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="campus" className="text-sm font-medium text-gray-700">
                        Campus
                      </label>
                      <Select value={campus} onValueChange={setCampus}>
                        <SelectTrigger id="campus">
                          <SelectValue placeholder="Select a campus" />
                        </SelectTrigger>
                        <SelectContent>
                          {campuses.map((camp) => (
                            <SelectItem key={camp} value={camp}>
                              {camp}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium text-gray-700">
                        Specific Pickup Location
                      </label>
                      <Select value={location} onValueChange={setLocation}>
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select a specific location" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Buildings Group */}
                          <div className="px-2 py-1.5 text-xs font-medium text-gray-500">Buildings</div>
                          {buildings.map((building) => (
                            <SelectItem key={building} value={building}>
                              {building}
                            </SelectItem>
                          ))}

                          {/* Dormitories Group - with separator */}
                          <div className="px-2 py-1.5 text-xs font-medium text-gray-500 border-t border-gray-200 mt-1 pt-2">
                            Dormitories
                          </div>
                          {dormitories.map((dorm) => (
                            <SelectItem key={dorm} value={dorm}>
                              {dorm}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Images
                        <span className="text-gray-500 text-xs ml-2">(max 5)</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {images.map((image, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-md overflow-hidden border border-gray-200"
                          >
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`Item image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}

                        {images.length < 5 && (
                          <button
                            type="button"
                            onClick={handleAddImage}
                            className="aspect-square rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400"
                          >
                            <Camera className="h-8 w-8 mb-2" />
                            <span className="text-sm">Add Image</span>
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Add up to 5 images of your item. The first image will be the cover image.
                      </p>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="button" variant="outline" onClick={togglePreview}>
                    Preview Listing
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" className="bg-green-600 hover:bg-green-700 text-white">
                        Create Listing
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Listing</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to create this listing? Once published, it will be visible to all MinSU
                          students.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleSubmit}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                              Creating...
                            </>
                          ) : (
                            "Publish Listing"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ) : (
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Preview Listing</CardTitle>
                    <Button type="button" variant="outline" size="sm" onClick={togglePreview}>
                      Edit Listing
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Image Gallery */}
                    <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                      <Image src={images[0] || "/placeholder.svg"} alt={name} fill className="object-contain" />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {images.map((image, index) => (
                        <div
                          key={index}
                          className={`w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${index === 0 ? "border-green-500" : "border-transparent"}`}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={image || "/placeholder.svg"}
                              alt={`${name} thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Item Details */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">{name}</h2>
                      <p className="text-3xl font-bold text-green-600 mb-4">₱{Number(price).toLocaleString()}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-sm">{category}</span>
                        <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-md text-sm">{condition}</span>
                      </div>

                      <h3 className="font-medium text-gray-800 mb-2">Description</h3>
                      <p className="text-gray-600 whitespace-pre-line mb-4">{description}</p>

                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Campus: {campus}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <span className="ml-5">Specific Location: {location}</span>
                      </div>

                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-medium mr-3">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">Seller</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button type="button" variant="outline" className="mr-2" onClick={togglePreview}>
                    Edit Listing
                  </Button>
                  <Button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Creating...
                      </>
                    ) : (
                      "Publish Listing"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}

            <Card className="border-none shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Selling Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="bg-green-100 text-green-700 rounded-full p-1 mr-2 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>Be honest about the condition of your item</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 text-green-700 rounded-full p-1 mr-2 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>Set a fair price based on the item's condition and market value</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 text-green-700 rounded-full p-1 mr-2 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>Use clear, well-lit photos that accurately show the item</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 text-green-700 rounded-full p-1 mr-2 mt-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>Meet buyers in public places on campus for safety</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-red-100 text-red-700 rounded-full p-1 mr-2 mt-0.5">
                      <X className="h-3 w-3" />
                    </div>
                    <span>Do not sell prohibited items (alcohol, weapons, etc.)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
