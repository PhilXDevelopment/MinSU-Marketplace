import pool from "@/lib/db"
import { RowDataPacket, ResultSetHeader } from "mysql2"

// User type definition
export type User = {
  id: number
  name: string
  email: string
  password: string
  rank: string
  points: number
  avatar: string | null
  is_online: boolean
  created_at?: Date
  updated_at?: Date
}

// Mock users for development
const mockUsers: User[] = []

// Get user by ID
export async function getUserById(id: number): Promise<User | null> {
  try {
    const [users] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id]
    )

    return users.length > 0 ? (users[0] as User) : null
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const [users] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )

    return users.length > 0 ? (users[0] as User) : null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

// Create a new user
export async function createUser(user: Omit<User, "id" | "rank" | "points" | "is_online">): Promise<User> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users (
        name, email, password, \`rank\`, points, avatar, is_online
      ) VALUES (?, ?, ?, 'Newbie', 0, ?, false)`,
      [
        user.name,
        user.email,
        user.password,
        user.avatar || user.name.charAt(0).toUpperCase()
      ]
    )

    const newUser = await getUserById(result.insertId)
    if (!newUser) {
      throw new Error("Failed to create user")
    }

    return newUser
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

// Update user
export async function updateUser(id: number, updates: Partial<User>): Promise<User | null> {
  try {
    const setParts: string[] = []
    const values: any[] = []

    // Add each update field to the query
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        setParts.push(`${key} = ?`)
        values.push(value)
      }
    })

    if (setParts.length === 0) {
      return await getUserById(id)
    }

    // Add the ID as the last parameter
    values.push(id)

    await pool.query<ResultSetHeader>(
      `UPDATE users SET ${setParts.join(", ")} WHERE id = ?`,
      values
    )

    return await getUserById(id)
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

// List users with pagination
export async function listUsers(page = 1, limit = 20): Promise<User[]> {
  try {
    const offset = (page - 1) * limit

    const [users] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users ORDER BY name LIMIT ? OFFSET ?",
      [limit, offset]
    )

    return users as User[]
  } catch (error) {
    console.error("Error listing users:", error)
    return []
  }
}

// Delete user
export async function deleteUser(id: number): Promise<boolean> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM users WHERE id = ?",
      [id]
    )

    return result.affectedRows > 0
  } catch (error) {
    console.error("Error deleting user:", error)
    return false
  }
}

// Update user online status
export async function updateUserOnlineStatus(id: number, isOnline: boolean): Promise<boolean> {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE users SET is_online = ? WHERE id = ?",
      [isOnline, id]
    )

    return result.affectedRows > 0
  } catch (error) {
    console.error("Error updating user online status:", error)
    return false
  }
}

// Authenticate user
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const [users] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    )

    return users.length > 0 ? (users[0] as User) : null
  } catch (error) {
    console.error("Error authenticating user:", error)
    return null
  }
}
