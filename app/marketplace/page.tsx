"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  ChevronDown,
  Filter,
  Search,
  Grid3X3,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Star,
  MapPin,
  Clock,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Categories for filtering
const categories = ["All Categories", "Books", "Electronics", "Furniture", "Lab Equipment", "Tools", "Appliances"]

// Conditions for filtering
const conditions = ["All Conditions", "New", "Like New", "Good", "Used"]

// Locations for filtering
const locations = [
  "All Locations",
  "Main Campus",
  "North Campus",
  "South Campus",
  "Science Building",
  "Engineering Building",
  "CS Department",
  "Dormitory Area",
]

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  seller_id: number;
  seller_name: string;
  created_at: string;
  updated_at: string;
  category: string;
  condition: string;
  location: string;
  image: string;
  seller_avatar: string;
  rating: number;
  posted_date: string;
}

export default function Marketplace() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedCondition, setSelectedCondition] = useState("All Conditions")
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [priceRange, setPriceRange] = useState([0, 3000])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortOption, setSortOption] = useState("newest")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)

      try {
        const response = await fetch('/api/products')
        const result = await response.json()

        if (result.success) {
          let products = result.data

          // Apply filters
          if (searchTerm) {
            products = products.filter((p: Product) =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
          }

          if (selectedCategory !== "All Categories") {
            products = products.filter((p: Product) => p.category === selectedCategory)
          }

          if (selectedCondition !== "All Conditions") {
            products = products.filter((p: Product) => p.condition === selectedCondition)
          }

          if (selectedLocation !== "All Locations") {
            products = products.filter((p: Product) => p.location === selectedLocation)
          }

          products = products.filter((p: Product) => 
            p.price >= priceRange[0] && p.price <= priceRange[1]
          )

          // Apply sorting
          switch (sortOption) {
            case "newest":
              products = [...products].sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
              )
              break
            case "price-low":
              products = [...products].sort((a, b) => a.price - b.price)
              break
            case "price-high":
              products = [...products].sort((a, b) => b.price - a.price)
              break
          }

          setFilteredProducts(products)
        } else {
          console.error("Failed to fetch products:", result.message)
          setFilteredProducts([])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        setFilteredProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [searchTerm, selectedCategory, selectedCondition, selectedLocation, priceRange, sortOption])

  const handleProductClick = (productId: number) => {
    if (!user) {
      // Store intent for redirect after login
      localStorage.setItem("minsu-last-intent", `/marketplace/product/${productId}`)
      router.push("/auth/login")
    } else {
      router.push(`/marketplace/product/${productId}`)
    }
  }

  const resetFilters = () => {
    setSelectedCategory("All Categories")
    setSelectedCondition("All Conditions")
    setSelectedLocation("All Locations")
    setPriceRange([0, 3000])
    setSearchTerm("")
  }

  // Format relative time for posted date
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "just now"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? "day" : "days"} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Marketplace
          </motion.h1>
          <p className="text-gray-600">Find and sell items within your campus community</p>
        </div>

        {/* Filters and Search */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Mobile Filters Button */}
            <div className="md:hidden w-full">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Refine your search with these filters</SheetDescription>
                  </SheetHeader>
                  <div className="py-6 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">Category</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            className={
                              selectedCategory === category
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                            }
                            onClick={() => setSelectedCategory(category)}
                          >
                            {category}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">Condition</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {conditions.map((condition) => (
                          <Button
                            key={condition}
                            variant={selectedCondition === condition ? "default" : "outline"}
                            className={
                              selectedCondition === condition
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                            }
                            onClick={() => setSelectedCondition(condition)}
                          >
                            {condition}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700">Location</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            {selectedLocation}
                            <ChevronDown className="ml-2 h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[300px]">
                          {locations.map((location) => (
                            <DropdownMenuItem key={location} onClick={() => setSelectedLocation(location)}>
                              {location}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-700">Price Range</h3>
                        <span className="text-sm text-gray-600">
                          ₱{priceRange[0]} - ₱{priceRange[1]}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[0, 3000]}
                        max={3000}
                        step={100}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="[&>span]:bg-green-500"
                      />
                    </div>
                  </div>
                  <SheetFooter className="flex flex-row gap-2">
                    <SheetClose asChild>
                      <Button variant="outline" onClick={resetFilters} className="flex-1">
                        Reset
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">Apply</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop Filters */}
            <div className="hidden md:flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-lg">
                    <Filter className="mr-2 h-4 w-4" />
                    {selectedCategory}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-gray-100" : ""}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-lg">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    {sortOption === "newest"
                      ? "Newest"
                      : sortOption === "price-low"
                        ? "Price: Low to High"
                        : "Price: High to Low"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setSortOption("newest")}
                    className={sortOption === "newest" ? "bg-gray-100" : ""}
                  >
                    Newest
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOption("price-low")}
                    className={sortOption === "price-low" ? "bg-gray-100" : ""}
                  >
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOption("price-high")}
                    className={sortOption === "price-high" ? "bg-gray-100" : ""}
                  >
                    Price: High to Low
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                className={`rounded-lg ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={`rounded-lg ${viewMode === "list" ? "bg-gray-100" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <div className="w-full md:w-auto">
              {user ? (
                <Link href="/marketplace/sell">
                  <Button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white rounded-lg">
                    + Sell Item
                  </Button>
                </Link>
              ) : (
                <Button
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  onClick={() => {
                    localStorage.setItem("minsu-last-intent", "/marketplace/sell")
                    router.push("/auth/login")
                  }}
                >
                  + Sell Item
                </Button>
              )}
            </div>
          </div>

          {/* Desktop Advanced Filters */}
          <div className="hidden md:block">
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategory !== "All Categories" && (
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 gap-1 px-3 py-1.5">
                  {selectedCategory}
                  <button
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    onClick={() => setSelectedCategory("All Categories")}
                  >
                    ×
                  </button>
                </Badge>
              )}

              {selectedCondition !== "All Conditions" && (
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 gap-1 px-3 py-1.5">
                  {selectedCondition}
                  <button
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    onClick={() => setSelectedCondition("All Conditions")}
                  >
                    ×
                  </button>
                </Badge>
              )}

              {selectedLocation !== "All Locations" && (
                <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 gap-1 px-3 py-1.5">
                  {selectedLocation}
                  <button
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    onClick={() => setSelectedLocation("All Locations")}
                  >
                    ×
                  </button>
                </Badge>
              )}

              {(selectedCategory !== "All Categories" ||
                selectedCondition !== "All Conditions" ||
                selectedLocation !== "All Locations" ||
                priceRange[0] > 0 ||
                priceRange[1] < 3000) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-amber-600 hover:text-amber-700 px-3 py-1.5 h-auto"
                >
                  Clear All
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Price Range:</span>
                  <span className="text-sm font-medium text-gray-700">
                    ₱{priceRange[0]} - ₱{priceRange[1]}
                  </span>
                </div>
                <Slider
                  defaultValue={[0, 3000]}
                  max={3000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="[&>span]:bg-green-500"
                />
              </div>

              <div>
                <span className="text-sm text-gray-500 block mb-2">Condition:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedCondition}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    {conditions.map((condition) => (
                      <DropdownMenuItem key={condition} onClick={() => setSelectedCondition(condition)}>
                        {condition}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <span className="text-sm text-gray-500 block mb-2">Location:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedLocation}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    {locations.map((location) => (
                      <DropdownMenuItem key={location} onClick={() => setSelectedLocation(location)}>
                        {location}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : /* Products Grid/List */
        filteredProducts.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => handleProductClick(product.id)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="h-48 relative">
                    <Image
                      src={product.image || "/placeholder.svg?height=300&width=300"}
                      alt={product.name}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {product.condition}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg line-clamp-1 text-gray-800 group-hover:text-green-600 transition-colors">
                        {product.name}
                      </h3>
                      <span className="text-green-600 font-bold">₱{product.price}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">{product.category}</p>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{product.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="bg-green-50 text-green-600 text-xs">
                            {product.seller_avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span>{product.seller_name}</span>
                      </div>
                      <div className="flex items-center text-sm text-amber-600">
                        <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                        <span>{product.rating || 4.5}</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatRelativeTime(product.posted_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{product.location}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer group"
                  onClick={() => handleProductClick(product.id)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-48 h-48 relative">
                      <Image
                        src={product.image || "/placeholder.svg?height=300&width=300"}
                        alt={product.name}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                      <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {product.condition}
                      </div>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-green-600 transition-colors">
                          {product.name}
                        </h3>
                        <span className="text-green-600 font-bold">₱{product.price}</span>
                      </div>
                      <div className="flex items-center mt-1 space-x-2">
                        <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700 text-xs">
                          {product.category}
                        </Badge>
                        <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 text-xs">
                          {product.location}
                        </Badge>
                        <div className="flex items-center text-amber-600">
                          <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                          <span className="text-xs">{product.rating || 4.5}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mt-2">{product.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarFallback className="bg-green-50 text-green-600 text-xs">
                              {product.seller_avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span>{product.seller_name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{formatRelativeTime(product.posted_date)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          <motion.div
            className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
