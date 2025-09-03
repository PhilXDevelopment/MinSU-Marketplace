"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Tag,
  MapPin,
  CheckCircle2,
  Share2,
  Flag,
  MoreHorizontal,
  AlertCircle,
  Send,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  getForumPostDetails,
  createForumReply,
  upvoteForumPost,
  upvoteForumReply,
  markReplyAsBestAnswer,
} from "@/app/actions/forum-actions"

// Format date to relative time
function formatRelativeTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  } else if (diffInSeconds < 3 / 1000)
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

export default function QuestionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [question, setQuestion] = useState<any | null>(null)
  const [replies, setReplies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [relatedQuestions, setRelatedQuestions] = useState<any[]>([])
  const [answerContent, setAnswerContent] = useState("")
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false)
  const [userVotes, setUserVotes] = useState<Record<string, "up" | "down" | null>>({})
  const answerRef = useRef<HTMLDivElement>(null)

  // New state for comment inputs
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({})
  const [showCommentForm, setShowCommentForm] = useState<Record<string, boolean>>({})
  const [isSubmittingComment, setIsSubmittingComment] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function fetchQuestionDetails() {
      setLoading(true)
      try {
        const questionId = params.id as string
        const result = await getForumPostDetails(questionId)

        if (result.success) {
          setQuestion(result.post)
          setReplies(result.replies)

          // Find related questions (to be implemented with database)
          // For now, we'll leave this empty
          setRelatedQuestions([])
        } else {
          console.error("Failed to fetch question details:", result.message)
        }
      } catch (error) {
        console.error("Error fetching question details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestionDetails()
  }, [params.id])

  const handleSubmitAnswer = async () => {
    if (!user) {
      localStorage.setItem("minsu-last-intent", `/forum/question/${params.id}`)
      router.push("/auth/login")
      return
    }

    if (!answerContent.trim()) {
      toast({
        title: "Empty answer",
        description: "Please write something before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingAnswer(true)

    try {
      const formData = new FormData()
      formData.append("content", answerContent)

      const result = await createForumReply(params.id as string, user.id, formData)

      if (result.success) {
        // Add the new reply to the list
        setReplies((prev) => [...prev, result.reply])

        // Update the question's reply count
        setQuestion((prev: any) => ({
          ...prev,
          replies: prev.replies + 1,
        }))

        // Clear the answer input
        setAnswerContent("")

        toast({
          title: "Answer submitted",
          description: "Your answer has been posted successfully",
        })

        // Scroll to the newly added answer
        setTimeout(() => {
          answerRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      } else {
        toast({
          title: "Failed to submit answer",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting answer:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingAnswer(false)
    }
  }

  // New function to handle comment submission
  const handleSubmitComment = (answerId: string) => {
    if (!user) {
      localStorage.setItem("minsu-last-intent", `/forum/question/${params.id}`)
      router.push("/auth/login")
      return
    }

    const commentContent = commentInputs[answerId]
    if (!commentContent || !commentContent.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before submitting",
        variant: "destructive",
      })
      return
    }

    setIsSubmittingComment({
      ...isSubmittingComment,
      [answerId]: true,
    })

    // Simulate submitting comment
    setTimeout(() => {
      if (question) {
        // Create a new comment object
        const newComment = {
          author: user.name,
          authorAvatar: user.avatar || user.name.charAt(0).toUpperCase(),
          content: commentContent.trim(),
          timestamp: new Date().toISOString(),
        }

        // Update the question with the new comment
        const updatedReplies = replies.map((reply) => {
          if (reply.id === answerId) {
            return {
              ...reply,
              comments: [...(reply.comments || []), newComment],
            }
          }
          return reply
        })

        setReplies(updatedReplies)

        // Clear the comment input and hide the form
        setCommentInputs({
          ...commentInputs,
          [answerId]: "",
        })

        setShowCommentForm({
          ...showCommentForm,
          [answerId]: false,
        })

        toast({
          title: "Comment added",
          description: "Your comment has been posted successfully",
        })
      }

      setIsSubmittingComment({
        ...isSubmittingComment,
        [answerId]: false,
      })
    }, 800)
  }

  // Toggle comment form visibility
  const toggleCommentForm = (answerId: string) => {
    if (!user) {
      localStorage.setItem("minsu-last-intent", `/forum/question/${params.id}`)
      router.push("/auth/login")
      return
    }

    setShowCommentForm({
      ...showCommentForm,
      [answerId]: !showCommentForm[answerId],
    })

    // Initialize comment input if it doesn't exist
    if (!commentInputs[answerId]) {
      setCommentInputs({
        ...commentInputs,
        [answerId]: "",
      })
    }
  }

  const handleVote = async (type: "question" | "answer", id: string, voteType: "up" | "down") => {
    if (!user) {
      localStorage.setItem("minsu-last-intent", `/forum/question/${params.id}`)
      router.push("/auth/login")
      return
    }

    const voteKey = `${type}-${id}`
    const currentVote = userVotes[voteKey]
    let newVote: "up" | "down" | null = null

    // Toggle vote if clicking the same button, otherwise set to the new vote type
    if (currentVote === voteType) {
      newVote = null
    } else {
      newVote = voteType
    }

    // Update user votes state
    setUserVotes({
      ...userVotes,
      [voteKey]: newVote,
    })

    try {
      // Update question or answer upvotes
      if (type === "question" && question) {
        let updatedUpvotes = question.upvotes

        // Remove previous vote if any
        if (currentVote === "up") updatedUpvotes--
        if (currentVote === "down") updatedUpvotes++

        // Add new vote if any
        if (newVote === "up") updatedUpvotes++
        if (newVote === "down") updatedUpvotes--

        setQuestion({
          ...question,
          upvotes: updatedUpvotes,
        })

        if (newVote === "up") {
          await upvoteForumPost(id, user.id)
        }

        toast({
          title: newVote ? `Vote ${newVote}dated` : "Vote removed",
          description: newVote ? `You ${newVote}voted this question` : "Your vote has been removed",
          variant: "default",
        })
      } else if (type === "answer") {
        const updatedReplies = replies.map((reply) => {
          if (reply.id === id) {
            let updatedUpvotes = reply.upvotes

            // Remove previous vote if any
            if (currentVote === "up") updatedUpvotes--
            if (currentVote === "down") updatedUpvotes++

            // Add new vote if any
            if (newVote === "up") updatedUpvotes++
            if (newVote === "down") updatedUpvotes--

            return {
              ...reply,
              upvotes: updatedUpvotes,
            }
          }
          return reply
        })

        setReplies(updatedReplies)

        if (newVote === "up") {
          await upvoteForumReply(id, user.id)
        }
      }
    } catch (error) {
      console.error("Error voting:", error)
      toast({
        title: "Error",
        description: "Failed to update vote",
        variant: "destructive",
      })
    }
  }

  const handleMarkAsBest = async (replyId: string) => {
    if (!question || !user) return

    // Only the question author should be able to mark best answer
    if (user.id !== question.author_id) {
      toast({
        title: "Permission denied",
        description: "Only the question author can mark the best answer",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await markReplyAsBestAnswer(replyId, question.id, user.id)

      if (result.success) {
        // Update the replies list to reflect the change
        const updatedReplies = replies.map((reply) => ({
          ...reply,
          is_best_answer: reply.id === replyId,
        }))

        setReplies(updatedReplies)

        toast({
          title: "Best answer marked",
          description: "You've successfully marked the best answer",
        })
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error marking best answer:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    }
  }

  const handleShare = () => {
    // In a real app, this would use the Web Share API
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied",
      description: "Question link has been copied to clipboard",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Question Not Found</h1>
            <p className="text-gray-600 mb-6">The question you're looking for doesn't exist or has been removed.</p>
            <Link href="/forum">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Back to Forum</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/forum">Forum</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/forum?department=${question.department}`}>{question.department}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink className="text-gray-500 font-normal max-w-[150px] truncate">
                {question.title}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Question */}
            <motion.div
              className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green-50 text-green-600">{question.author_avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <span className="font-medium text-gray-800">{question.author_name}</span>
                      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getRankColor(question.author_rank)}`}>
                        {question.author_rank}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Asked {formatRelativeTime(question.timestamp)}</p>
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 mb-4">{question.title}</h1>

                <p className="text-gray-700 mb-6 whitespace-pre-line">{question.content}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {question.tags &&
                    question.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline" className="bg-green-50 border-green-200 text-green-700">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">
                    <MapPin className="h-3 w-3 mr-1" />
                    {question.department}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${
                        userVotes[`question-${question.id}`] === "up"
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "text-gray-600"
                      }`}
                      onClick={() => handleVote("question", question.id, "up")}
                    >
                      <ThumbsUp
                        className={`h-4 w-4 mr-2 ${
                          userVotes[`question-${question.id}`] === "up" ? "fill-green-500" : ""
                        }`}
                      />
                      {question.upvotes}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className={`${
                        userVotes[`question-${question.id}`] === "down"
                          ? "bg-red-50 text-red-600 border-red-200"
                          : "text-gray-600"
                      }`}
                      onClick={() => handleVote("question", question.id, "down")}
                    >
                      <ThumbsDown
                        className={`h-4 w-4 ${userVotes[`question-${question.id}`] === "down" ? "fill-red-500" : ""}`}
                      />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-600">
                          <Flag className="h-4 w-4 mr-2" />
                          Report
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Report Question</DialogTitle>
                          <DialogDescription>
                            If you believe this question violates our community guidelines, please let us know.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-2 py-4">
                          {["Inappropriate content", "Spam", "Harassment", "Incorrect information", "Other"].map(
                            (reason) => (
                              <div key={reason} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  id={reason}
                                  name="report-reason"
                                  className="h-4 w-4 text-green-600"
                                />
                                <label htmlFor={reason} className="text-sm text-gray-700">
                                  {reason}
                                </label>
                              </div>
                            ),
                          )}
                        </div>
                        <div className="flex justify-end">
                          <Button className="bg-green-600 hover:bg-green-700 text-white">Submit Report</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Answers */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {replies.length} {replies.length === 1 ? "Answer" : "Answers"}
                </h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="text-gray-600">
                      <MoreHorizontal className="h-4 w-4 mr-2" />
                      Sort By
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Most Upvoted</DropdownMenuItem>
                    <DropdownMenuItem>Newest First</DropdownMenuItem>
                    <DropdownMenuItem>Oldest First</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {replies.map((reply, index) => (
                <motion.div
                  key={reply.id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden mb-4 ${
                    reply.is_best_answer ? "border-2 border-green-500" : ""
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  ref={index === replies.length - 1 ? answerRef : null}
                >
                  {reply.is_best_answer && (
                    <div className="bg-green-50 text-green-700 px-6 py-2 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      <span className="font-medium">Best Answer</span>
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-green-50 text-green-600">{reply.author_avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium text-gray-800">{reply.author_name}</span>
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getRankColor(reply.author_rank)}`}>
                            {reply.author_rank}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Answered {formatRelativeTime(reply.timestamp)}</p>
                      </div>
                    </div>

                    <div className="text-gray-700 mb-6 whitespace-pre-line">{reply.content}</div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${
                            userVotes[`answer-${reply.id}`] === "up"
                              ? "bg-green-50 text-green-600 border-green-200"
                              : "text-gray-600"
                          }`}
                          onClick={() => handleVote("answer", reply.id, "up")}
                        >
                          <ThumbsUp
                            className={`h-4 w-4 mr-2 ${
                              userVotes[`answer-${reply.id}`] === "up" ? "fill-green-500" : ""
                            }`}
                          />
                          {reply.upvotes}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className={`${
                            userVotes[`answer-${reply.id}`] === "down"
                              ? "bg-red-50 text-red-600 border-red-200"
                              : "text-gray-600"
                          }`}
                          onClick={() => handleVote("answer", reply.id, "down")}
                        >
                          <ThumbsDown
                            className={`h-4 w-4 ${userVotes[`answer-${reply.id}`] === "down" ? "fill-red-500" : ""}`}
                          />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-600"
                          onClick={() => toggleCommentForm(reply.id)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Comment
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        {user && user.id === question.author_id && !reply.is_best_answer && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-200"
                            onClick={() => handleMarkAsBest(reply.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Mark as Best
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Comments */}
                    {reply.comments && reply.comments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Comments</h4>
                        <div className="space-y-3">
                          {reply.comments.map((comment: any, idx: number) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                  {comment.authorAvatar}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-700">{comment.author}</span>
                                  <span className="text-xs text-gray-500 ml-2">
                                    {formatRelativeTime(comment.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{comment.content}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add Comment Form */}
                    {showCommentForm[reply.id] && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Add a Comment</h4>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Write your comment..."
                            value={commentInputs[reply.id] || ""}
                            onChange={(e) =>
                              setCommentInputs({
                                ...commentInputs,
                                [reply.id]: e.target.value,
                              })
                            }
                            className="flex-1"
                          />
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleSubmitComment(reply.id)}
                            disabled={isSubmittingComment[reply.id]}
                          >
                            {isSubmittingComment[reply.id] ? (
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Add Answer */}
            <motion.div
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Your Answer</h2>

                <Textarea
                  placeholder="Write your answer here..."
                  className="min-h-[150px] mb-4"
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                />

                <div className="flex justify-end">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleSubmitAnswer}
                    disabled={isSubmittingAnswer}
                  >
                    {isSubmittingAnswer ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Answer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Related Questions */}
            <motion.div
              className="bg-white rounded-xl shadow-sm overflow-hidden sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Related Questions</h2>

                <div className="space-y-4">
                  {relatedQuestions.length > 0 ? (
                    relatedQuestions.map((relatedQuestion) => (
                      <Link key={relatedQuestion.id} href={`/forum/question/${relatedQuestion.id}`} className="block">
                        <div className="group">
                          <h3 className="text-gray-800 font-medium group-hover:text-green-600 transition-colors">
                            {relatedQuestion.title}
                          </h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            <span>{relatedQuestion.replies} replies</span>
                            <span className="mx-2">•</span>
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            <span>{relatedQuestion.upvotes} upvotes</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No related questions found</p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700">Browse by Tag</h3>
                  <div className="flex flex-wrap gap-2">
                    {question.tags &&
                      question.tags.map((tag: string) => (
                        <Link key={tag} href={`/forum?tag=${tag}`}>
                          <Badge
                            variant="outline"
                            className="bg-green-50 border-green-200 text-green-700 cursor-pointer hover:bg-green-100"
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        </Link>
                      ))}
                    <Link href={`/forum?department=${question.department}`}>
                      <Badge
                        variant="outline"
                        className="bg-amber-50 border-amber-200 text-amber-700 cursor-pointer hover:bg-amber-100"
                      >
                        <MapPin className="h-3 w-3 mr-1" />
                        {question.department}
                      </Badge>
                    </Link>
                  </div>
                </div>

                <Separator className="my-4" />

                <Link href="/forum/ask">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Ask a Question
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
