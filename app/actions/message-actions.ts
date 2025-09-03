"use server"

import { revalidatePath } from "next/cache"
import * as messageModel from "@/lib/models/message"
import * as userModel from "@/lib/models/user"
import * as notificationModel from "@/lib/models/notification"

export async function getOrCreateConversation(userIds: string[]) {
  try {
    const conversation = await messageModel.getOrCreateConversation(userIds)

    return { success: true, conversation }
  } catch (error) {
    console.error("Error getting or creating conversation:", error)
    return { success: false, message: "Failed to get or create conversation" }
  }
}

export async function getUserConversations(userId: string) {
  try {
    const conversations = await messageModel.getUserConversations(userId)

    // Get the other participant's info for each conversation
    const conversationsWithUserInfo = await Promise.all(
      conversations.map(async (conversation) => {
        const otherParticipantId = conversation.participants.find((id) => id !== userId)

        if (!otherParticipantId) {
          return { ...conversation, otherUser: null }
        }

        const otherUser = await userModel.getUserById(otherParticipantId)

        return {
          ...conversation,
          otherUser: otherUser
            ? {
                id: otherUser.id,
                name: otherUser.name,
                avatar: otherUser.avatar || otherUser.name.charAt(0).toUpperCase(),
                isOnline: otherUser.isOnline || false,
                lastSeen: otherUser.lastSeen,
              }
            : null,
        }
      }),
    )

    return { success: true, conversations: conversationsWithUserInfo }
  } catch (error) {
    console.error("Error getting user conversations:", error)
    return { success: false, message: "Failed to get user conversations" }
  }
}

export async function getConversationMessages(conversationId: string, userId: string) {
  try {
    // First check if the user is a participant in this conversation
    const conversation = await messageModel.getConversationById(conversationId)

    if (!conversation) {
      return { success: false, message: "Conversation not found" }
    }

    if (!conversation.participants.includes(userId)) {
      return { success: false, message: "You do not have permission to view this conversation" }
    }

    const messages = await messageModel.getConversationMessages(conversationId)

    // Mark messages as read
    await messageModel.markMessagesAsRead(conversationId, userId)

    return { success: true, messages }
  } catch (error) {
    console.error("Error getting conversation messages:", error)
    return { success: false, message: "Failed to get conversation messages" }
  }
}

export async function sendMessage(conversationId: string, senderId: string, content: string) {
  try {
    // First check if the user is a participant in this conversation
    const conversation = await messageModel.getConversationById(conversationId)

    if (!conversation) {
      return { success: false, message: "Conversation not found" }
    }

    if (!conversation.participants.includes(senderId)) {
      return { success: false, message: "You do not have permission to send messages in this conversation" }
    }

    const message = await messageModel.sendMessage(conversationId, senderId, content)

    // Create notification for the other participant
    const recipientId = conversation.participants.find((id) => id !== senderId)

    if (recipientId) {
      const sender = await userModel.getUserById(senderId)

      await notificationModel.createNotification({
        userId: recipientId,
        type: "message",
        title: `New message from ${sender?.name || "Someone"}`,
        description: content.length > 50 ? `${content.substring(0, 50)}...` : content,
        actionUrl: `/messages/${conversationId}`,
        sender: sender
          ? {
              id: senderId,
              name: sender.name,
              avatar: sender.avatar || sender.name.charAt(0).toUpperCase(),
            }
          : undefined,
      })
    }

    revalidatePath(`/messages/${conversationId}`)
    revalidatePath("/messages")

    return { success: true, message }
  } catch (error) {
    console.error("Error sending message:", error)
    return { success: false, message: "Failed to send message" }
  }
}
