"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Search,
  Send,
  Phone,
  Video,
  Info,
  MoreHorizontal,
  ChevronLeft,
  ImageIcon,
  Smile,
  Paperclip,
  Mic,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useIsMobile } from "@/hooks/use-mobile"

// Format date to relative time
function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? "day" : "days"} ago`
  } else {
    return date.toLocaleDateString()
  }
}

// Format time for messages
function formatMessageTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export default function MessagesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const isMobile = useIsMobile()

  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredConversations, setFilteredConversations] = useState([])
  const [showConversationList, setShowConversationList] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  // Filter conversations based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredConversations(
        conversations.filter((conversation) => conversation.user.name.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    } else {
      setFilteredConversations(conversations)
    }
  }, [searchTerm, conversations])

  // Load messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      setMessages(messagesData[selectedConversation] || [])

      // Mark conversation as read
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv.id === selectedConversation
            ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, isRead: true } }
            : conv,
        ),
      )

      // On mobile, hide conversation list when a conversation is selected
      if (isMobile) {
        setShowConversationList(false)
      }
    }
  }, [selectedConversation, isMobile])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!selectedConversation || !newMessage.trim()) return

    const newMsg = {
      id: `${selectedConversation}-${messages.length + 1}`,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      sender: "you" as const,
    }

    // Add message to current conversation
    setMessages([...messages, newMsg])

    // Update last message in conversations list
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === selectedConversation
          ? {
              ...conv,
              lastMessage: {
                content: newMessage.trim(),
                timestamp: new Date().toISOString(),
                isRead: true,
                sender: "you",
              },
            }
          : conv,
      ),
    )

    // Clear input
    setNewMessage("")

    // Simulate response after a delay (for demo purposes)
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const responseMsg = {
          id: `${selectedConversation}-${messages.length + 2}`,
          content: "Thanks for your message! I'll get back to you soon.",
          timestamp: new Date().toISOString(),
          sender: "them" as const,
        }

        setMessages((prevMessages) => [...prevMessages, responseMsg])

        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv.id === selectedConversation
              ? {
                  ...conv,
                  lastMessage: {
                    content: "Thanks for your message! I'll get back to you soon.",
                    timestamp: new Date().toISOString(),
                    isRead: true,
                    sender: "them",
                  },
                }
              : conv,
          ),
        )
      }, 2000)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleBackToList = () => {
    setShowConversationList(true)
  }

  if (!user) {
    return null // Don't render anything if redirecting
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-0">
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Conversation List */}
        {(showConversationList || !isMobile) && (
          <motion.div
            className={`bg-white border-r border-gray-200 ${isMobile ? "w-full" : "w-1/3"}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-800 mb-4">Messages</h1>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  className="pl-10 pr-4 py-2 w-full rounded-full border-gray-200 focus:border-green-500 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100%-5rem)]">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedConversation === conversation.id ? "bg-gray-50" : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-center">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-green-100 text-green-600">
                            {conversation.user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.user.isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h2 className="text-sm font-medium text-gray-900 truncate">{conversation.user.name}</h2>
                          <p className="text-xs text-gray-500">
                            {formatRelativeTime(conversation.lastMessage.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p
                            className={`text-sm truncate ${
                              conversation.lastMessage.isRead ? "text-gray-500" : "text-gray-900 font-medium"
                            }`}
                          >
                            {conversation.lastMessage.sender === "you" ? "You: " : ""}
                            {conversation.lastMessage.content}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge className="bg-green-600 text-white ml-2">{conversation.unreadCount}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">No conversations found</div>
              )}
            </div>
          </motion.div>
        )}

        {/* Message Thread */}
        {selectedConversation && (!showConversationList || !isMobile) ? (
          <motion.div
            className={`bg-white flex flex-col ${isMobile ? "w-full" : "w-2/3"}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Conversation Header */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              {isMobile && (
                <Button variant="ghost" size="icon" className="mr-2" onClick={handleBackToList}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}

              {selectedConversation && (
                <>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green-100 text-green-600">
                      {conversations.find((c) => c.id === selectedConversation)?.user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 flex-1">
                    <h2 className="text-sm font-medium text-gray-900">
                      {conversations.find((c) => c.id === selectedConversation)?.user.name}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {conversations.find((c) => c.id === selectedConversation)?.user.isOnline
                        ? "Online"
                        : `Last seen ${formatRelativeTime(
                            conversations.find((c) => c.id === selectedConversation)?.user.lastSeen || "",
                          )}`}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-500">
                      <Info className="h-5 w-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-500">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Block user</DropdownMenuItem>
                        <DropdownMenuItem>Delete conversation</DropdownMenuItem>
                        <DropdownMenuItem>Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "you" ? "justify-end" : "justify-start"}`}
                  >
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
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
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
          </motion.div>
        ) : (
          !isMobile && (
            <div className="w-2/3 bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-medium text-gray-800 mb-2">Your Messages</h2>
                <p className="text-gray-500 max-w-md">
                  Select a conversation to start messaging or search for a specific user.
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
