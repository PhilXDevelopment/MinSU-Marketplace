// Create a new file for centralized message data
import { getUserById } from "./users"

export interface Conversation {
  id: string
  participants: string[] // User IDs
  lastMessage: {
    content: string
    timestamp: string
    isRead: boolean
    sender: string // User ID
  }
  unreadCount: number
}

export interface Message {
  id: string
  conversationId: string
  content: string
  timestamp: string
  sender: string // User ID
}

// Sample conversation templates for new chats
const conversationTemplates: Record<
  string,
  Array<{ content: string; sender: "user" | "other"; delayHours: number }>
> = {
  general: [
    { content: "Hi there! How are you?", sender: "other", delayHours: 0 },
    { content: "I'm good, thanks for asking! How about you?", sender: "user", delayHours: 0.5 },
    { content: "I'm doing well. I saw your profile and wanted to connect.", sender: "other", delayHours: 1 },
  ],
  marketplace: [
    { content: "Hi! I'm interested in your item. Is it still available?", sender: "other", delayHours: 0 },
    { content: "Yes, it's still available! Are you interested in buying it?", sender: "user", delayHours: 2 },
    { content: "Great! How much are you selling it for?", sender: "other", delayHours: 3 },
    {
      content: "I'm selling it for the price listed. Would you like to meet up to see it?",
      sender: "user",
      delayHours: 4,
    },
  ],
  study: [
    {
      content: "Hello! I'm in your class and was wondering if you'd like to join our study group?",
      sender: "other",
      delayHours: 0,
    },
    { content: "Hi! That sounds great. When do you usually meet?", sender: "user", delayHours: 1 },
    { content: "We meet every Tuesday and Thursday at 4 PM in the library.", sender: "other", delayHours: 2 },
    { content: "Perfect! I'll join you next Tuesday then.", sender: "user", delayHours: 3 },
  ],
}

// Sample conversations data
export const conversations: Conversation[] = [
  {
    id: "conv_1",
    participants: ["current_user", "1"], // John Doe
    lastMessage: {
      content: "That sounds fair. Would you be able to meet tomorrow?",
      timestamp: "2025-02-15T10:42:00Z",
      isRead: true,
      sender: "1",
    },
    unreadCount: 0,
  },
  {
    id: "conv_2",
    participants: ["current_user", "2"], // Jane Smith
    lastMessage: {
      content: "Great! Let's meet tomorrow at the library around 2 PM.",
      timestamp: "2025-02-14T18:45:00Z",
      isRead: false,
      sender: "2",
    },
    unreadCount: 3,
  },
  {
    id: "conv_3",
    participants: ["current_user", "3"], // Alex Johnson
    lastMessage: {
      content: "Thanks for the quick response!",
      timestamp: "2025-02-13T14:20:00Z",
      isRead: true,
      sender: "current_user",
    },
    unreadCount: 0,
  },
  {
    id: "conv_4",
    participants: ["current_user", "4"], // Maria Santos
    lastMessage: {
      content: "Would you take ₱400 for the Biology Lab Kit?",
      timestamp: "2025-02-11T11:05:00Z",
      isRead: true,
      sender: "4",
    },
    unreadCount: 0,
  },
  {
    id: "conv_5",
    participants: ["current_user", "5"], // David Lee
    lastMessage: {
      content: "I can help you with that calculus problem. Let's meet at the math lab.",
      timestamp: "2025-02-10T15:30:00Z",
      isRead: true,
      sender: "5",
    },
    unreadCount: 0,
  },
]

// If this file exists, replace the mock messages with an empty array
export const messages: Message[] = []

// Function to get conversation by user ID
export function getConversationByUserId(userId: string): { conversation: Conversation; messageList: Message[] } | null {
  // Find existing conversation with this user
  const conversation = conversations.find(
    (conv) => conv.participants.includes("current_user") && conv.participants.includes(userId),
  )

  if (conversation) {
    return {
      conversation,
      messageList: messages[conversation.id] || [],
    }
  }

  return null
}

// Function to create a new conversation with a user
export function createNewConversation(userId: string): { conversation: Conversation; messageList: Message[] } {
  const user = getUserById(userId)
  if (!user) {
    throw new Error("User not found")
  }

  // Create a new conversation ID
  const newConvId = `conv_new_${userId}`

  // Determine which template to use based on user's department
  let templateKey = "general"
  if (user.department?.toLowerCase().includes("chemistry") || user.department?.toLowerCase().includes("biology")) {
    templateKey = "study"
  } else if (user.itemsListed > 0) {
    templateKey = "marketplace"
  }

  const template = conversationTemplates[templateKey]

  // Create messages based on template
  const now = new Date()
  const newMessages: Message[] = template.map((tmpl, index) => {
    const msgTime = new Date(now)
    msgTime.setHours(msgTime.getHours() - template.length + index + tmpl.delayHours)

    return {
      id: `msg_new_${userId}_${index + 1}`,
      conversationId: newConvId,
      content: tmpl.content,
      timestamp: msgTime.toISOString(),
      sender: tmpl.sender === "other" ? userId : "current_user",
    }
  })

  // Create the conversation object
  const lastMsg = newMessages[newMessages.length - 1]
  const newConversation: Conversation = {
    id: newConvId,
    participants: ["current_user", userId],
    lastMessage: {
      content: lastMsg.content,
      timestamp: lastMsg.timestamp,
      isRead: true,
      sender: lastMsg.sender,
    },
    unreadCount: 0,
  }

  return {
    conversation: newConversation,
    messageList: newMessages,
  }
}
