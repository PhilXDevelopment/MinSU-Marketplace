// Create a new file for individual message conversations

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Send, ArrowLeft, Paperclip, ImageIcon, Smile, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Sample conversations data (same as in messages/page.tsx)
const conversationsData = [
  {
    id: "1",
    user: {
      name: "Jane Smith",
      avatar: "J",
      isOnline: true,
      lastSeen: null,
    },
    lastMessage: {
      content: "Hi! I'm interested in your Calculus textbook. Is it still available?",
      timestamp: "2025-02-15T10:30:00Z",
      isRead: true,
      sender: "them",
    },
    unreadCount: 0,
  },
  {
    id: "2",
    user: {
      name: "Mike Johnson",
      avatar: "M",
      isOnline: false,
      lastSeen: "2025-02-15T09:15:00Z",
    },
    lastMessage: {
      content: "Great! Let's meet tomorrow at the library around 2 PM.",
      timestamp: "2025-02-14T18:45:00Z",
      isRead: false,
      sender: "them",
    },
    unreadCount: 3,
  },
  {
    id: "3",
    user: {
      name: "Lisa Wong",
      avatar: "L",
      isOnline: true,
      lastSeen: null,
    },
    lastMessage: {
      content: "Thanks for the quick response!",
      timestamp: "2025-02-13T14:20:00Z",
      isRead: true,
      sender: "you",
    },
    unreadCount: 0,
  },
]

// Sample messages for each conversation
const messagesData: Record<
  string,
  Array<{ id: string; content: string; timestamp: string; sender: "you" | "them" }>
> = {
  "1": [
    {
      id: "1-1",
      content: "Hi! I'm interested in your Calculus textbook. Is it still available?",
      timestamp: "2025-02-15T10:30:00Z",
      sender: "them",
    },
    {
      id: "1-2",
      content: "Yes, it's still available! It's in great condition, only used for one semester.",
      timestamp: "2025-02-15T10:35:00Z",
      sender: "you",
    },
    {
      id: "1-3",
      content: "Great! How much are you selling it for?",
      timestamp: "2025-02-15T10:37:00Z",
      sender: "them",
    },
    {
      id: "1-4",
      content: "I'm selling it for ₱650, but I'm open to reasonable offers.",
      timestamp: "2025-02-15T10:40:00Z",
      sender: "you",
    },
    {
      id: "1-5",
      content: "That sounds fair. Would you be able to meet tomorrow?",
      timestamp: "2025-02-15T10:42:00Z",
      sender: "them",
    },
  ],
  "2": [
    {
      id: "2-1",
      content: "Hello! I saw your listing for the Scientific Calculator. Is it still for sale?",
      timestamp: "2025-02-14T15:20:00Z",
      sender: "them",
    },
    {
      id: "2-2",
      content: "Hi there! Yes, it's still available.",
      timestamp: "2025-02-14T15:30:00Z",
      sender: "you",
    },
    {
      id: "2-3",
      content: "Perfect! Would you be willing to meet on campus to complete the sale?",
      timestamp: "2025-02-14T15:35:00Z",
      sender: "them",
    },
    {
      id: "2-4",
      content: "Absolutely. I'm available most afternoons this week.",
      timestamp: "2025-02-14T15:40:00Z",
      sender: "you",
    },
    {
      id: "2-5",
      content: "Great! Let's meet tomorrow at the library around 2 PM.",
      timestamp: "2025-02-14T18:45:00Z",
      sender: "them",
    },
  ],
  "3": [
    {
      id: "3-1",
      content: "Hi, I'm interested in joining the study group for Chemistry. Is there still space?",
      timestamp: "2025-02-13T13:10:00Z",
      sender: "them",
    },
    {
      id: "3-2",
      content:
        "Hello! Yes, we still have room for 2 more people. We meet every Tuesday and Thursday at 4 PM in the Science Building.",
      timestamp: "2025-02-13T13:15:00Z",
      sender: "you",
    },
    {
      id: "3-3",
      content: "Perfect! I'd love to join. Should I bring anything specific?",
      timestamp: "2025-02-13T13:20:00Z",
      sender: "them",
    },
    {
      id: "3-4",
      content: "Just your textbook and notes. We're currently focusing on organic chemistry concepts.",
      timestamp: "2025-02-13T14:00:00Z",
      sender: "you",
    },
    {
      id: "3-5",
      content: "Thanks for the quick response!",
      timestamp: "2025-02-13T14:20:00Z",
      sender: "them",
    },
  ],
}

// Mock user data for demonstration
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    avatar: "J",
    isOnline: true,
    lastSeen: null,
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: "J",
    isOnline: true,
    lastSeen: null,
  },
  {
    id: "3",
    name: "Alex Johnson",
    avatar: "A",
    isOnline: false,
    lastSeen: "2025-02-15T08:30:00Z",
  },
]

// Format time for messages
function formatMessageTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export default function DirectMessagePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const params = useParams()
  const userId = params.id as string

  const [conversation, setConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Find conversation or create a new one
    let foundConversation = conversationsData.find((c) => c.id === userId)

    if (!foundConversation) {
      // Find user by ID
      const targetUser = mockUsers.find((u) => u.id === userId)

      if (targetUser) {
        // Create a new conversation
        foundConversation = {
          id: userId,
          user: {
            name: targetUser.name,
            avatar: targetUser.avatar,
            isOnline: targetUser.isOnline,
            lastSeen: targetUser.lastSeen,
          },
          lastMessage: {
            content: "Start a conversation...",
            timestamp: new Date().toISOString(),
            isRead: true,
            sender: "you",
          },
          unreadCount: 0,
        }

        // Create empty messages array for this conversation
        messagesData[userId] = []
      } else {
        // If user not found, redirect to messages
        router.push("/messages")
        return
      }
    }

    setConversation(foundConversation)
    setMessages(messagesData[userId] || [])
    setIsLoading(false)
  }, [user, router, userId])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const newMsg = {
      id: `${userId}-${messages.length + 1}`,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      sender: "you" as const,
    }

    // Add message to current conversation
    setMessages([...messages, newMsg])

    // Update last message in conversation
    if (conversation) {
      setConversation({
        ...conversation,
        lastMessage: {
          content: newMessage.trim(),
          timestamp: new Date().toISOString(),
          isRead: true,
          sender: "you",
        },
      })
    }

    // Clear input
    setNewMessage("")

    // Simulate response after a delay (for demo purposes)
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const responseMsg = {
          id: `${userId}-${messages.length + 2}`,
          content: "Thanks for your message! I'll get back to you soon.",
          timestamp: new Date().toISOString(),
          sender: "them" as const,
        }

        setMessages((prevMessages) => [...prevMessages, responseMsg])

        if (conversation) {
          setConversation({
            ...conversation,
            lastMessage: {
              content: "Thanks for your message! I'll get back to you soon.",
              timestamp: new Date().toISOString(),
              isRead: true,
              sender: "them",
            },
          })
        }
      }, 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-500">Loading conversation...</div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="text-xl text-gray-500">Conversation not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-0">
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Conversation Header */}
        <div className="p-4 border-b border-gray-200 bg-white flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/messages")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <Avatar className="h-10 w-10 mr-3">
            <AvatarFallback className="bg-green-100 text-green-600">{conversation.user.avatar}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="text-sm font-medium text-gray-900">{conversation.user.name}</h2>
            <p className="text-xs text-gray-500">
              {conversation.user.isOnline
                ? "Online"
                : `Last seen ${new Date(conversation.user.lastSeen).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}`}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "you" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.sender === "you" ? "bg-green-600 text-white ml-auto" : "bg-white border border-gray-200"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${message.sender === "you" ? "text-green-100" : "text-gray-500"}`}>
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Start a conversation with {conversation.user.name}</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <ImageIcon className="h-5 w-5" />
            </Button>
            <div className="flex-1 mx-2">
              <Input
                type="text"
                placeholder="Type a message..."
                className="w-full rounded-full border-gray-200 focus:border-green-500 focus:ring-green-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
              />
            </div>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Smile className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white rounded-full"
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
