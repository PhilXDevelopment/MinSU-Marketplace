// Product type definition
export type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
  condition: ProductCondition
  description: string
  seller_id: string
  seller_name: string
  seller_avatar?: string
  location: string
  status: "active" | "pending" | "sold" | "inactive" | "rejected"
  rating: number
  posted_date: string
}

export type ProductCondition = "New" | "Like New" | "Good" | "Used" | "For parts"

// List all products with optional filtering
export async function listProducts(
  page = 1,
  limit = 20,
  filters: {
    category?: string
    condition?: ProductCondition
    minPrice?: number
    maxPrice?: number
    search?: string
    sellerId?: string
    status?: string
    location?: string
  } = {},
): Promise<Product[]> {
  try {
    // Always return mock data
    let products = getMockProducts()

    // Apply filters
    if (filters.category && filters.category !== "All Categories") {
      products = products.filter((product) => product.category === filters.category)
    }

    if (filters.condition && filters.condition !== "All Conditions") {
      products = products.filter((product) => product.condition === filters.condition)
    }

    if (filters.minPrice !== undefined) {
      products = products.filter((product) => product.price >= filters.minPrice!)
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter((product) => product.price <= filters.maxPrice!)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) || product.description.toLowerCase().includes(searchLower),
      )
    }

    if (filters.sellerId) {
      products = products.filter((product) => product.seller_id === filters.sellerId)
    }

    if (filters.status) {
      products = products.filter((product) => product.status === filters.status)
    }

    if (filters.location && filters.location !== "All Locations") {
      products = products.filter((product) => product.location === filters.location)
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = products.slice(startIndex, endIndex)

    return paginatedProducts
  } catch (error) {
    console.error("Error listing products:", error)
    return getMockProducts().slice(0, limit) // Return mock data even on error
  }
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  try {
    // Always return mock data
    const products = getMockProducts()
    return products.find((product) => product.id === id) || null
  } catch (error) {
    console.error("Error getting product by ID:", error)
    return null
  }
}

// Create a new product
export async function createProduct(
  product: Omit<Product, "id" | "posted_date" | "rating" | "status">,
): Promise<Product> {
  try {
    // Return a mock product with the provided data
    return {
      id: Math.random().toString(36).substring(2, 15),
      ...product,
      status: "active",
      rating: 4.5,
      posted_date: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

// Update a product
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    // Update mock data
    const products = getMockProducts()
    const productIndex = products.findIndex((product) => product.id === id)

    if (productIndex === -1) {
      return null
    }

    const updatedProduct = {
      ...products[productIndex],
      ...updates,
    }

    return updatedProduct
  } catch (error) {
    console.error("Error updating product:", error)
    return null
  }
}

// Delete a product
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    // Just return success
    return true
  } catch (error) {
    console.error("Error deleting product:", error)
    return false
  }
}

// Search products
export async function searchProducts(query: string): Promise<Product[]> {
  try {
    // Filter mock data
    const products = getMockProducts()
    const lowercaseQuery = query.toLowerCase()

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery),
    )
  } catch (error) {
    console.error("Error searching products:", error)
    return []
  }
}

// Mock data function for development and testing
function getMockProducts(): Product[] {
  return []
}
