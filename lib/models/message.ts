import sql from "@/lib/db"

// Message type definition
export type Message = {
  id: string
  conversation_id: string
  content: string
  sender_id: string
  is_read: boolean
  created_at: string
}

export type Conversation = {
  id: string
  last_message_content: string
  last_message_timestamp: string
  last_message_sender_id: string
  last_message_is_read: boolean
  created_at: string
  participants: string[]
}

export type ConversationParticipant = {
  conversation_id: string
  user_id: string
}

// Create a new message
export async function createMessage(message: Omit<Message, "id" | "created_at">): Promise<Message> {
  try {
    // Start a transaction
    const result = await sql.transaction(async (tx) => {
      // Insert the message
      const newMessage = await tx`
        INSERT INTO messages (
          conversation_id, content, sender_id, is_read
        ) VALUES (
          ${message.conversation_id}, ${message.content}, ${message.sender_id}, ${message.is_read}
        )
        RETURNING *
      `

      // Update the conversation's last message
      await tx`
        UPDATE conversations
        SET 
          last_message_content = ${message.content},
          last_message_timestamp = NOW(),
          last_message_sender_id = ${message.sender_id},
          last_message_is_read = ${message.is_read}
        WHERE id = ${message.conversation_id}
      `

      return newMessage[0]
    })

    return result
  } catch (error) {
    console.error("Error creating message:", error)
    throw error
  }
}

// Get messages for a conversation
export async function getMessagesByConversationId(conversationId: string, limit = 50): Promise<Message[]> {
  try {
    const messages = await sql`
      SELECT * FROM messages
      WHERE conversation_id = ${conversationId}
      ORDER BY created_at ASC
      LIMIT ${limit}
    `

    return messages
  } catch (error) {
    console.error("Error getting messages by conversation ID:", error)
    return []
  }
}

// Create a new conversation
export async function createConversation(participants: string[]): Promise<Conversation> {
  try {
    // Start a transaction
    const result = await sql.transaction(async (tx) => {
      // Create the conversation
      const newConversation = await tx`
        INSERT INTO conversations DEFAULT VALUES
        RETURNING *
      `

      // Add participants
      for (const userId of participants) {
        await tx`
          INSERT INTO conversation_participants (conversation_id, user_id)
          VALUES (${newConversation[0].id}, ${userId})
        `
      }

      return newConversation[0]
    })

    return result
  } catch (error) {
    console.error("Error creating conversation:", error)
    throw error
  }
}

// Get conversations for a user
export async function getConversationsByUserId(userId: string): Promise<Conversation[]> {
  try {
    const conversations = await sql`
      SELECT c.*, ARRAY_AGG(cp.user_id) as participants
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      WHERE c.id IN (
        SELECT conversation_id
        FROM conversation_participants
        WHERE user_id = ${userId}
      )
      GROUP BY c.id
      ORDER BY c.last_message_timestamp DESC
    `

    return conversations
  } catch (error) {
    console.error("Error getting conversations by user ID:", error)
    return []
  }
}

// Get conversation by ID
export async function getConversationById(id: string): Promise<Conversation | null> {
  try {
    const conversations = await sql`
      SELECT c.*, ARRAY_AGG(cp.user_id) as participants
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      WHERE c.id = ${id}
      GROUP BY c.id
    `

    return conversations.length > 0 ? conversations[0] : null
  } catch (error) {
    console.error("Error getting conversation by ID:", error)
    return null
  }
}

// Get or create conversation between users
export async function getOrCreateConversation(userIds: string[]): Promise<Conversation> {
  try {
    // Check if a conversation already exists between these users
    const existingConversation = await sql`
      SELECT c.*, ARRAY_AGG(cp.user_id) as participants
      FROM conversations c
      JOIN conversation_participants cp ON c.id = cp.conversation_id
      GROUP BY c.id
      HAVING ARRAY_AGG(cp.user_id) @> ${userIds} AND ARRAY_LENGTH(ARRAY_AGG(cp.user_id), 1) = ${userIds.length}
    `

    if (existingConversation.length > 0) {
      return existingConversation[0]
    }

    // If no conversation exists, create a new one
    return await createConversation(userIds)
  } catch (error) {
    console.error("Error getting or creating conversation:", error)
    throw error
  }
}

// Mark messages as read
export async function markMessagesAsRead(conversationId: string, userId: string): Promise<boolean> {
  try {
    await sql`
      UPDATE messages
      SET is_read = true
      WHERE conversation_id = ${conversationId}
        AND sender_id != ${userId}
        AND is_read = false
    `

    // Also update the conversation's last message read status if needed
    await sql`
      UPDATE conversations
      SET last_message_is_read = true
      WHERE id = ${conversationId}
        AND last_message_sender_id != ${userId}
        AND last_message_is_read = false
    `

    return true
  } catch (error) {
    console.error("Error marking messages as read:", error)
    return false
  }
}

// Get unread message count for a user
export async function getUnreadMessageCount(userId: string): Promise<number> {
  try {
    const result = await sql`
      SELECT COUNT(*) as count
      FROM messages
      WHERE conversation_id IN (
        SELECT conversation_id
        FROM conversation_participants
        WHERE user_id = ${userId}
      )
      AND sender_id != ${userId}
      AND is_read = false
    `

    return Number.parseInt(result[0].count)
  } catch (error) {
    console.error("Error getting unread message count:", error)
    return 0
  }
}
