"use server"

import { revalidatePath } from "next/cache"
import * as notificationModel from "@/lib/models/notification"

export async function getUserNotifications(
  userId: string,
  page = 1,
  limit = 20,
  filter?: notificationModel.NotificationType,
) {
  try {
    const notifications = await notificationModel.getUserNotifications(userId, page, limit, filter)

    return { success: true, notifications }
  } catch (error) {
    console.error("Error getting user notifications:", error)
    return { success: false, message: "Failed to get user notifications" }
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    const notification = await notificationModel.markNotificationAsRead(notificationId)

    if (!notification) {
      return { success: false, message: "Notification not found" }
    }

    revalidatePath("/notifications")

    return { success: true, notification }
  } catch (error) {
    console.error("Error marking notification as read:", error)
    return { success: false, message: "Failed to mark notification as read" }
  }
}

export async function markAllNotificationsAsRead(userId: string) {
  try {
    await notificationModel.markAllNotificationsAsRead(userId)

    revalidatePath("/notifications")

    return { success: true }
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    return { success: false, message: "Failed to mark all notifications as read" }
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    const success = await notificationModel.deleteNotification(notificationId)

    if (!success) {
      return { success: false, message: "Notification not found" }
    }

    revalidatePath("/notifications")

    return { success: true }
  } catch (error) {
    console.error("Error deleting notification:", error)
    return { success: false, message: "Failed to delete notification" }
  }
}

export async function deleteAllUserNotifications(userId: string) {
  try {
    await notificationModel.deleteAllUserNotifications(userId)

    revalidatePath("/notifications")

    return { success: true }
  } catch (error) {
    console.error("Error deleting all notifications:", error)
    return { success: false, message: "Failed to delete all notifications" }
  }
}
