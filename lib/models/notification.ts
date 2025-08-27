import sql from "@/lib/db"

// Notification type definition
export type Notification = {
  id: string
  user_id: string
  type: string
  title: string
  description: string
  action_url: string
  sender_id?: string
  sender_name?: string
  sender_avatar?: string
  is_read: boolean
  created_at: string
}

// Mock notifications for development
const mockNotifications: Notification[] = [
  {
    id: "1",
    user_id: "1",
    type: "message",
    title: "New Message",
    description: "You received a new message from Jane Smith",
    action_url: "/messages/2",
    sender_id: "2",
    sender_name: "Jane Smith",
    sender_avatar: "J",
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "1",
    type: "forum",
    title: "Answer Accepted",
    description: "Your answer was marked as best answer",
    action_url: "/forum/question/1",
    sender_id: "3",
    sender_name: "Alex Johnson",
    sender_avatar: "A",
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
]

// Create a new notification
export async function createNotification(
  notification: Omit<Notification, "id" | "created_at" | "is_read">,
): Promise<Notification> {
  try {
    // For development/testing, create mock notification
    if (!sql || process.env.NODE_ENV === "development") {
      const newNotification: Notification = {
        id: (mockNotifications.length + 1).toString(),
        user_id: notification.user_id,
        type: notification.type,
        title: notification.title,
        description: notification.description,
        action_url: notification.action_url,
        sender_id: notification.sender_id,
        sender_name: notification.sender_name,
        sender_avatar: notification.sender_avatar,
        is_read: false,
        created_at: new Date().toISOString(),
      }
      mockNotifications.push(newNotification)
      return newNotification
    }

    // For production, insert into database
    const result = await sql`
      INSERT INTO notifications (
        user_id, type, title, description, action_url, 
        sender_id, sender_name, sender_avatar, is_read
      ) VALUES (
        ${notification.user_id}, ${notification.type}, ${notification.title}, 
        ${notification.description}, ${notification.action_url},
        ${notification.sender_id || null}, ${notification.sender_name || null}, 
        ${notification.sender_avatar || null}, false
      )
      RETURNING *
    `

    return result[0]
  } catch (error) {
    console.error("Error creating notification:", error)
    // Create a mock notification as fallback
    const newNotification: Notification = {
      id: (mockNotifications.length + 1).toString(),
      user_id: notification.user_id,
      type: notification.type,
      title: notification.title,
      description: notification.description,
      action_url: notification.action_url,
      sender_id: notification.sender_id,
      sender_name: notification.sender_name,
      sender_avatar: notification.sender_avatar,
      is_read: false,
      created_at: new Date().toISOString(),
    }
    mockNotifications.push(newNotification)
    return newNotification
  }
}

// Get notifications for a user
export async function getNotificationsForUser(userId: string, page = 1, limit = 20): Promise<Notification[]> {
  try {
    // For development/testing, return mock data
    if (!sql || process.env.NODE_ENV === "development") {
      const userNotifications = mockNotifications.filter((n) => n.user_id === userId)
      const start = (page - 1) * limit
      const end = start + limit
      return userNotifications.slice(start, end)
    }

    const offset = (page - 1) * limit

    const notifications = await sql`
      SELECT * FROM notifications
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return notifications
  } catch (error) {
    console.error("Error getting notifications for user:", error)
    // Return mock data as fallback
    const userNotifications = mockNotifications.filter((n) => n.user_id === userId)
    const start = (page - 1) * limit
    const end = start + limit
    return userNotifications.slice(start, end)
  }
}

// Mark notification as read
export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    // For development/testing, update mock data
    if (!sql || process.env.NODE_ENV === "development") {
      const index = mockNotifications.findIndex((n) => n.id === id)
      if (index !== -1) {
        mockNotifications[index].is_read = true
        return true
      }
      return false
    }

    await sql`
      UPDATE notifications
      SET is_read = true
      WHERE id = ${id}
    `

    return true
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return false
  }
}

// Mark all notifications as read for a user
export async function markAllNotificationsAsRead(userId: string): Promise<boolean> {
  try {
    // For development/testing, update mock data
    if (!sql || process.env.NODE_ENV === "development") {
      mockNotifications.forEach((n) => {
        if (n.user_id === userId) {
          n.is_read = true
        }
      })
      return true
    }

    await sql`
      UPDATE notifications
      SET is_read = true
      WHERE user_id = ${userId} AND is_read = false
    `

    return true
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return false
  }
}

// Delete notification
export async function deleteNotification(id: string): Promise<boolean> {
  try {
    // For development/testing, delete from mock data
    if (!sql || process.env.NODE_ENV === "development") {
      const index = mockNotifications.findIndex((n) => n.id === id)
      if (index !== -1) {
        mockNotifications.splice(index, 1)
        return true
      }
      return false
    }

    const result = await sql`
      DELETE FROM notifications WHERE id = ${id}
      RETURNING id
    `

    return result.length > 0
  } catch (error) {
    console.error("Error deleting notification:", error)
    return false
  }
}

// Get unread notification count for a user
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  try {
    // For development/testing, count from mock data
    if (!sql || process.env.NODE_ENV === "development") {
      return mockNotifications.filter((n) => n.user_id === userId && !n.is_read).length
    }

    const result = await sql`
      SELECT COUNT(*) as count FROM notifications
      WHERE user_id = ${userId} AND is_read = false
    `

    return Number.parseInt(result[0].count)
  } catch (error) {
    console.error("Error getting unread notification count:", error)
    // Count from mock data as fallback
    return mockNotifications.filter((n) => n.user_id === userId && !n.is_read).length
  }
}
