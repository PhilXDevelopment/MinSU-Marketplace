"use client"

import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, MessageSquare, ThumbsUp, Clock, Tag, Filter, ArrowUpDown, MapPin, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { getForumPosts } from "@/app/actions/forum-actions"

// Departments for filtering
const departments = [
  "All Departments",
  "Mathematics",
  "Chemistry",
  "Computer Science",
  "Engineering",
  "Physics",
  "General",
]

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

// Get rank color
function getRankColor(rank: string) {
  switch (rank) {
    case "Expert":
      return "bg-gradient-to-r from-green-600 to-green-700 text-white"
    case "Helper":
      return "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
    default:
      return "bg-gradient-to-r from-gray-500 to-gray-600 text-white"
  }
}

export default function Forum() {
  const { user } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [posts, setPosts] = useState<any[]>([])
  const [filteredPosts, setFilteredPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("latest")
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments")
  const [sortOption, setSortOption] = useState("latest")

  // Fetch forum posts
  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      try {
        const result = await getForumPosts(1, 50, {
          sortBy: selectedTab as "latest" | "popular" | "unanswered",
          department: selectedDepartment !== "All Departments" ? selectedDepartment : undefined,
        })

        if (result.success) {
          setPosts(result.posts)
          setFilteredPosts(result.posts)
        } else {
          console.error("Failed to fetch posts:", result.message)
        }
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [selectedTab, selectedDepartment])

  // Filter posts based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          post.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredPosts(filtered)
    } else {
      setFilteredPosts(posts)
    }
  }, [searchTerm, posts])

  // Apply additional sorting if needed
  useEffect(() => {
    if (sortOption === "most-replies") {
      setFilteredPosts((prev) => [...prev].sort((a, b) => b.replies - a.replies))
    } else if (sortOption === "most-upvotes") {
      setFilteredPosts((prev) => [...prev].sort((a, b) => b.upvotes - a.upvotes))
    }
  }, [sortOption])

  const handleUpvote = (questionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      localStorage.setItem("minsu-last-intent", `/forum/question/${questionId}`)
      router.push("/auth/login")
    } else {
      // Implement upvote logic here if user is logged in
      console.log("Upvoted question:", questionId)
    }
  }

  const handleQuestionClick = (questionId: string) => {
    router.push(`/forum/question/${questionId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Forum
          </motion.h1>
          <p className="text-gray-600">Ask questions, share knowledge, and connect with fellow students</p>
        </div>

        {/* Search and Ask Question */}
        <motion.div
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search questions, topics, or tags..."
                className="pl-10 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="hidden md:flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-lg">
                    <Filter className="mr-2 h-4 w-4" />
                    {selectedDepartment}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Departments</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {departments.map((department) => (
                    <DropdownMenuItem
                      key={department}
                      onClick={() => setSelectedDepartment(department)}
                      className={selectedDepartment === department ? "bg-gray-100" : ""}
                    >
                      {department}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-lg">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    {sortOption === "latest"
                      ? "Latest"
                      : sortOption === "most-replies"
                        ? "Most Replies"
                        : "Most Upvotes"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setSortOption("latest")}
                    className={sortOption === "latest" ? "bg-gray-100" : ""}
                  >
                    Latest
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOption("most-replies")}
                    className={sortOption === "most-replies" ? "bg-gray-100" : ""}
                  >
                    Most Replies
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOption("most-upvotes")}
                    className={sortOption === "most-upvotes" ? "bg-gray-100" : ""}
                  >
                    Most Upvotes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="w-full md:w-auto">
              {user ? (
                <Link href="/forum/ask">
                  <Button className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white rounded-lg">
                    Ask a Question
                  </Button>
                </Link>
              ) : (
                <Button
                  className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  onClick={() => {
                    localStorage.setItem("minsu-last-intent", "/forum/ask")
                    router.push("/auth/login")
                  }}
                >
                  Ask a Question
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs and Questions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Tabs defaultValue="latest" onValueChange={setSelectedTab}>
            <div className="px-6 pt-4">
              <TabsList className="grid grid-cols-3 w-full max-w-md bg-gray-100">
                <TabsTrigger value="latest" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
                  Latest
                </TabsTrigger>
                <TabsTrigger
                  value="popular"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  Popular
                </TabsTrigger>
                <TabsTrigger
                  value="unanswered"
                  className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
                >
                  Unanswered
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="latest" className="p-0 m-0">
              <QuestionsList
                questions={filteredPosts}
                onUpvote={handleUpvote}
                onQuestionClick={handleQuestionClick}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="popular" className="p-0 m-0">
              <QuestionsList
                questions={filteredPosts}
                onUpvote={handleUpvote}
                onQuestionClick={handleQuestionClick}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="unanswered" className="p-0 m-0">
              <QuestionsList
                questions={filteredPosts}
                onUpvote={handleUpvote}
                onQuestionClick={handleQuestionClick}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function QuestionsList({
  questions,
  onUpvote,
  onQuestionClick,
  loading,
}: {
  questions: any[]
  onUpvote: (id: string, e: React.MouseEvent) => void
  onQuestionClick: (id: string) => void
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 animate-pulse">
          <MessageSquare className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">Loading questions...</h3>
        <div className="w-48 h-4 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
        <div className="w-32 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {questions.length > 0 ? (
        questions.map((question, index) => (
          <motion.div
            key={question.id}
            className="p-6 hover:bg-gray-50 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => onQuestionClick(question.id)}
          >
            <div className="flex">
              {/* Upvote button */}
              <div className="mr-4 flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2 rounded-full hover:bg-green-50 text-gray-600"
                  onClick={(e) => onUpvote(question.id, e)}
                >
                  <ThumbsUp className="h-5 w-5" />
                </Button>
                <span className="text-sm font-medium text-gray-700">{question.upvotes || 0}</span>
              </div>

              {/* Question content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-50 text-green-600">
                      {question.author_avatar || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-medium text-sm text-gray-700">{question.author_name || "Anonymous"}</span>
                    <span
                      className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getRankColor(question.author_rank || "Newbie")}`}
                    >
                      {question.author_rank || "Newbie"}
                    </span>
                  </div>
                  {question.trending && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-none ml-auto">
                      <TrendingUp className="h-3 w-3 mr-1" /> Trending
                    </Badge>
                  )}
                </div>

                <h3 className="text-xl font-medium text-gray-800 mb-2 hover:text-green-600 transition-colors cursor-pointer">
                  {question.title || "Untitled Question"}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{question.content || "No content"}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {question.tags &&
                    Array.isArray(question.tags) &&
                    question.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="bg-green-50 border-green-200 text-green-700">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                    <MapPin className="h-3 w-3 mr-1" />
                    {question.department || "General"}
                  </Badge>
                </div>

                {/* Meta information */}
                <div className="flex items-center text-sm text-gray-500 gap-4 flex-wrap">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatRelativeTime(question.timestamp || new Date().toISOString())}</span>
                  </div>

                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{question.replies || 0} replies</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-2">No questions found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your filters or search terms</p>
          <Button
            variant="outline"
            onClick={() => {
              // Reset filters
              window.location.href = "/forum"
            }}
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  )
}
