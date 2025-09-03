"use server"

import { revalidatePath } from "next/cache"
import * as userModel from "@/lib/models/user"

export async function registerUser(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // Check if user already exists
    const existingUser = await userModel.getUserByEmail(email)
    if (existingUser) {
      return { success: false, message: "User with this email already exists" }
    }

    // Create new user
    const user = await userModel.createUser({
      name,
      email,
      password,
      avatar: name.charAt(0).toUpperCase()
    })

    revalidatePath("/auth/login")
    return { success: true, user }
  } catch (error) {
    console.error("Error registering user:", error)
    return { success: false, message: "Failed to register user" }
  }
}

export async function updateUserProfile(userId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string

    const updatedUser = await userModel.updateUser(userId, { name, email })

    if (!updatedUser) {
      return { success: false, message: "User not found" }
    }

    revalidatePath("/profile")
    revalidatePath("/settings")

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, message: "Failed to update profile" }
  }
}

export async function getUserProfile(userId: string) {
  try {
    const user = await userModel.getUserById(userId)

    if (!user) {
      return { success: false, message: "User not found" }
    }

    // Don't return sensitive information
    const { password, ...userProfile } = user

    return { success: true, user: userProfile }
  } catch (error) {
    console.error("Error getting user profile:", error)
    return { success: false, message: "Failed to get user profile" }
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const user = await userModel.authenticateUser(email, password);
    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }
    // Don't return the password
    const { password: _pw, ...userData } = user;
    return { success: true, user: userData };
  } catch (error) {
    return { success: false, message: "Login failed" };
  }
}
