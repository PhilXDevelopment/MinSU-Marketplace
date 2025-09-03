"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Send, Plus, X, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { createForumPost } from "@/app/actions/forum-actions"

// Departments for selection
const departments = [
  "Mathematics",
  "Chemistry",
  "Computer Science",
  "Engineering",
  "Physics",
  "General",
  "Business",
  "Arts",
  "Social Sciences",
]

// Available tags for selection
const availableTags = [
  "Calculus",
  "Exams",
  "Math",
  "Chemistry",
  "Study Group",
  "Technology",
  "Computer Science",
  "Work-Life Balance",
  "Advice",
  "Internship",
  "Engineering",
  "Study Tips",
  "Notes",
  "Programming",
  "Research",
  "Scholarships",
  "Career",
  "Books",
  "Software",
  "Hardware",
  "Projects",
  "Assignments",
  "Labs",
  "Tutoring",
]

export default function AskQuestionPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [department, setDepartment] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [filteredTags, setFilteredTags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter tags based on input
  useEffect(() => {
    if (tagInput) {
      setFilteredTags(
        availableTags
          .filter((tag) => tag.toLowerCase().includes(tagInput.toLowerCase()) && !selectedTags.includes(tag))
          .slice(0, 5),
      )
    } else {
      setFilteredTags([])
    }
  }, [tagInput, selectedTags])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  const handleAddTag = (tag: string) => {
    if (selectedTags.length < 5 && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
      setTagInput("")
      setFilteredTags([])
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your question",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "Missing content",
        description: "Please provide details for your question",
        variant: "destructive",
      })
      return
    }

    if (!department) {
      toast({
        title: "Missing department",
        description: "Please select a department for your question",
        variant: "destructive",
      })
      return
    }

    if (selectedTags.length === 0) {
      toast({
        title: "Missing tags",
        description: "Please add at least one tag to your question",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("content", content)
      formData.append("department", department)
      formData.append("tags", selectedTags.join(","))

      const result = await createForumPost(user.id, formData)

      if (result.success) {
        toast({
          title: "Question submitted",
          description: "Your question has been posted successfully",
        })

        // Redirect to forum page
        router.push("/forum")
      } else {
        toast({
          title: "Failed to submit question",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error submitting question:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return null // Don't render anything if redirecting
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
              <BreadcrumbLink className="text-gray-500 font-normal">Ask a Question</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center mb-6">
              <Link href="/forum">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Forum
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">Ask a Question</h1>
            </div>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Create Your Question</CardTitle>
                <CardDescription>
                  Provide details to help others understand your question and give better answers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium text-gray-700">
                      Title
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 inline ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-80">
                              Be specific and imagine you're asking a question to another person. Titles written as
                              questions tend to get better answers.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Input
                      id="title"
                      placeholder="e.g., How do I solve integration by parts problems?"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium text-gray-700">
                      Details
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 inline ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-80">
                              Include all the information someone would need to answer your question. Be clear and
                              thorough.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <Textarea
                      id="content"
                      placeholder="Explain your question in detail..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="department" className="text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger id="department" className="w-full">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="tags" className="text-sm font-medium text-gray-700">
                      Tags
                      <span className="text-gray-500 text-xs ml-2">(max 5)</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedTags.map((tag) => (
                        <div
                          key={tag}
                          className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-sm flex items-center"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-green-500 hover:text-green-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <Input
                        id="tags"
                        placeholder="Add tags..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        disabled={selectedTags.length >= 5}
                        className="w-full"
                      />
                      {filteredTags.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200">
                          {filteredTags.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => handleAddTag(tag)}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">Add up to 5 tags to describe what your question is about</p>
                  </div>
                </form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="button" variant="outline" className="mr-2" onClick={() => router.push("/forum")}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Post Question
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-sm mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Tips for a Great Question</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="bg-green-100 text-green-700 rounded-full p-1 mr-2 mt-0.5">
                      <Plus className="h-3 w-3" />
                    </div>
                    <span>Summarize your problem in a one-line title</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 text-green-700 rounded-full p-1 mr-2 mt-0.5">
                      <Plus className="h-3 w-3" />
                    </div>
                    <span>Describe what you've tried and what you expected to happen</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 text-green-700 rounded-full p-1 mr-2 mt-0.5">
                      <Plus className="h-3 w-3" />
                    </div>
                    <span>Add relevant tags to help categorize your question</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-green-100 text-green-700 rounded-full p-1 mr-2 mt-0.5">
                      <Plus className="h-3 w-3" />
                    </div>
                    <span>Proofread for clarity and correctness</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
