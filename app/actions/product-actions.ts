"use server"

import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "@/lib/models/product"
import { getUserById } from "@/lib/models/user"
import type { Product, ProductCondition } from "@/lib/models/product"

// Get product listings with filters
export async function getProductListings(
  page = 1,
  limit = 20,
  filters: {
    category?: string
    condition?: ProductCondition | string
    location?: string
    minPrice?: number
    maxPrice?: number
    searchTerm?: string
    seller_id?: string
    status?: string
  } = {},
) {
  try {
    let products: Product[] = []

    // If search term is provided, use search function
    if (filters.searchTerm && filters.searchTerm.trim() !== "") {
      products = await searchProducts(filters.searchTerm)

      // Apply additional filters to search results
      if (filters.category && filters.category !== "All Categories") {
        products = products.filter((p) => p.category === filters.category)
      }

      if (filters.condition && filters.condition !== "All Conditions") {
        products = products.filter((p) => p.condition === (filters.condition as ProductCondition))
      }

      if (filters.location && filters.location !== "All Locations") {
        products = products.filter((p) => p.location === filters.location)
      }

      if (filters.minPrice !== undefined) {
        products = products.filter((p) => p.price >= filters.minPrice!)
      }

      if (filters.maxPrice !== undefined) {
        products = products.filter((p) => p.price <= filters.maxPrice!)
      }

      if (filters.seller_id) {
        products = products.filter((p) => p.seller_id === filters.seller_id)
      }

      if (filters.status) {
        products = products.filter((p) => p.status === filters.status)
      }
    } else {
      // Use regular listing with filters
      products = await listProducts(page, limit, {
        category: filters.category,
        condition: filters.condition as ProductCondition,
        location: filters.location,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sellerId: filters.seller_id,
        status: filters.status,
      })
    }

    return {
      success: true,
      products,
      totalPages: Math.ceil(products.length / limit),
      currentPage: page,
    }
  } catch (error) {
    console.error("Error fetching product listings:", error)
    return {
      success: false,
      message: "Failed to fetch product listings",
      products: [],
      totalPages: 0,
      currentPage: page,
    }
  }
}

// Get product details by ID
export async function getProductDetails(id: string) {
  try {
    const product = await getProductById(id)

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      }
    }

    // Get seller details
    const seller = await getUserById(product.seller_id)

    return {
      success: true,
      product,
      seller: seller
        ? {
            id: seller.id,
            name: seller.name,
            avatar: seller.avatar,
            rank: seller.rank,
            points: seller.points,
          }
        : {
            id: product.seller_id,
            name: product.seller_name,
            avatar: product.seller_avatar || "U",
            rank: "Seller",
            points: 100,
          },
    }
  } catch (error) {
    console.error("Error fetching product details:", error)
    return {
      success: false,
      message: "Failed to fetch product details",
    }
  }
}

// Create a new product listing
export async function createProductListing(productData: Omit<Product, "id" | "posted_date">) {
  try {
    // Validate required fields
    if (
      !productData.name ||
      !productData.price ||
      !productData.category ||
      !productData.condition ||
      !productData.description ||
      !productData.seller_id ||
      !productData.location
    ) {
      return {
        success: false,
        message: "Missing required fields",
      }
    }

    // Create the product
    const product = await createProduct(productData)

    return {
      success: true,
      product,
      message: "Product listed successfully",
    }
  } catch (error) {
    console.error("Error creating product listing:", error)
    return {
      success: false,
      message: "Failed to create product listing",
    }
  }
}

// Update a product listing
export async function updateProductListing(id: string, productData: Partial<Product>, userId: string) {
  try {
    // Get the product
    const product = await getProductById(id)

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      }
    }

    // Check if the user is the seller
    if (product.seller_id !== userId) {
      return {
        success: false,
        message: "You do not have permission to update this product",
      }
    }

    // Update the product
    const updatedProduct = await updateProduct(id, productData)

    return {
      success: true,
      product: updatedProduct,
      message: "Product updated successfully",
    }
  } catch (error) {
    console.error("Error updating product listing:", error)
    return {
      success: false,
      message: "Failed to update product listing",
    }
  }
}

// Delete a product listing
export async function deleteProductListing(id: string, userId: string) {
  try {
    // Get the product
    const product = await getProductById(id)

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      }
    }

    // Check if the user is the seller
    if (product.seller_id !== userId) {
      return {
        success: false,
        message: "You do not have permission to delete this product",
      }
    }

    // Delete the product
    const deleted = await deleteProduct(id)

    if (!deleted) {
      return {
        success: false,
        message: "Failed to delete product",
      }
    }

    return {
      success: true,
      message: "Product deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting product listing:", error)
    return {
      success: false,
      message: "Failed to delete product listing",
    }
  }
}

// Mark a product as sold
export async function markProductAsSold(id: string, userId: string) {
  try {
    // Get the product
    const product = await getProductById(id)

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      }
    }

    // Check if the user is the seller
    if (product.seller_id !== userId) {
      return {
        success: false,
        message: "You do not have permission to update this product",
      }
    }

    // Update the product status
    const updatedProduct = await updateProduct(id, { status: "sold" })

    return {
      success: true,
      product: updatedProduct,
      message: "Product marked as sold",
    }
  } catch (error) {
    console.error("Error marking product as sold:", error)
    return {
      success: false,
      message: "Failed to mark product as sold",
    }
  }
}
