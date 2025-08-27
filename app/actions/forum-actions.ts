"use server"

import { revalidatePath } from "next/cache"
import * as forumModel from "@/lib/models/forum-post"
import * as userModel from "@/lib/models/user"
import * as notificationModel from "@/lib/models/notification"

export async function createForumPost(authorId: string, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    const department = formData.get("department") as string
    const tagsString = formData.get("tags") as string
    const tags = tagsString.split(",").map((tag) => tag.trim())

    // Get author info
    const author = await userModel.getUserById(authorId)
    if (!author) {
      return { success: false, message: "Author not found" }
    }

    const post = await forumModel.createForumPost({
      title,
      content,
      author_id: authorId,
      author_name: author.name,
      author_rank: author.rank,
      author_avatar: author.avatar || author.name.charAt(0).toUpperCase(),
      department,
      tags,
    })

    revalidatePath("/forum")

    return { success: true, post }
  } catch (error) {
    console.error("Error creating forum post:", error)
    return { success: false, message: "Failed to create forum post" }
  }
}

export async function getForumPostDetails(postId: string) {
  try {
    const post = await forumModel.getForumPostById(postId)

    if (!post) {
      return { success: false, message: "Post not found" }
    }

    const replies = await forumModel.getForumRepliesByPostId(postId)

    return { success: true, post, replies }
  } catch (error) {
    console.error("Error getting forum post details:", error)
    return { success: false, message: "Failed to get forum post details" }
  }
}

export async function createForumReply(postId: string, authorId: string, formData: FormData) {
  try {
    const content = formData.get("content") as string

    // Get author info
    const author = await userModel.getUserById(authorId)
    if (!author) {
      return { success: false, message: "Author not found" }
    }

    // Get post to notify the original author
    const post = await forumModel.getForumPostById(postId)
    if (!post) {
      return { success: false, message: "Post not found" }
    }

    const reply = await forumModel.createForumReply({
      post_id: postId,
      content,
      author_id: authorId,
      author_name: author.name,
      author_rank: author.rank,
      author_avatar: author.avatar || author.name.charAt(0).toUpperCase(),
    })

    // Create notification for the post author (if not the same as reply author)
    if (post.author_id !== authorId) {
      try {
        await notificationModel.createNotification({
          user_id: post.author_id,
          type: "forum",
          title: "New reply to your question",
          description: `${author.name} replied to your question: "${post.title}"`,
          action_url: `/forum/question/${postId}`,
          sender_id: authorId,
          sender_name: author.name,
          sender_avatar: author.avatar || author.name.charAt(0).toUpperCase(),
        })
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError)
        // Continue even if notification creation fails
      }
    }

    revalidatePath(`/forum/question/${postId}`)

    return { success: true, reply }
  } catch (error) {
    console.error("Error creating forum reply:", error)
    return { success: false, message: "Failed to create forum reply" }
  }
}

export async function upvoteForumPost(postId: string, userId: string) {
  try {
    const post = await forumModel.getForumPostById(postId)

    if (!post) {
      return { success: false, message: "Post not found" }
    }

    // In a real app, we would check if the user has already upvoted
    // For simplicity, we'll just increment the upvote count

    const updatedPost = await forumModel.updateForumPost(postId, {
      upvotes: post.upvotes + 1,
    })

    // Create notification for the post author (if not the same as upvoter)
    if (post.author_id !== userId) {
      try {
        const upvoter = await userModel.getUserById(userId)

        await notificationModel.createNotification({
          user_id: post.author_id,
          type: "forum",
          title: "Your post was upvoted",
          description: `${upvoter?.name || "Someone"} upvoted your post: "${post.title}"`,
          action_url: `/forum/question/${postId}`,
          sender_id: userId,
          sender_name: upvoter?.name || "Anonymous",
          sender_avatar: upvoter?.avatar || "?",
        })
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError)
        // Continue even if notification creation fails
      }
    }

    revalidatePath(`/forum/question/${postId}`)
    revalidatePath("/forum")

    return { success: true, post: updatedPost }
  } catch (error) {
    console.error("Error upvoting forum post:", error)
    return { success: false, message: "Failed to upvote forum post" }
  }
}

export async function upvoteForumReply(replyId: string, userId: string) {
  try {
    const reply = await forumModel.getForumReplyById(replyId)

    if (!reply) {
      return { success: false, message: "Reply not found" }
    }

    // In a real app, we would check if the user has already upvoted
    // For simplicity, we'll just increment the upvote count

    const updatedReply = await forumModel.updateForumReply(replyId, {
      upvotes: reply.upvotes + 1,
    })

    // Create notification for the reply author (if not the same as upvoter)
    if (reply.author_id !== userId) {
      try {
        const upvoter = await userModel.getUserById(userId)

        await notificationModel.createNotification({
          user_id: reply.author_id,
          type: "forum",
          title: "Your answer was upvoted",
          description: `${upvoter?.name || "Someone"} upvoted your answer`,
          action_url: `/forum/question/${reply.post_id}`,
          sender_id: userId,
          sender_name: upvoter?.name || "Anonymous",
          sender_avatar: upvoter?.avatar || "?",
        })
      } catch (notificationError) {
        console.error("Error creating notification:", notificationError)
        // Continue even if notification creation fails
      }
    }

    revalidatePath(`/forum/question/${reply.post_id}`)

    return { success: true, reply: updatedReply }
  } catch (error) {
    console.error("Error upvoting forum reply:", error)
    return { success: false, message: "Failed to upvote forum reply" }
  }
}

export async function markReplyAsBestAnswer(replyId: string, postId: string, userId: string) {
  try {
    // Get the post to check if the user is the author
    const post = await forumModel.getForumPostById(postId)

    if (!post) {
      return { success: false, message: "Post not found" }
    }

    if (post.author_id !== userId) {
      return { success: false, message: "Only the post author can mark a best answer" }
    }

    const reply = await forumModel.getForumReplyById(replyId)

    if (!reply) {
      return { success: false, message: "Reply not found" }
    }

    // Get all replies for this post
    const replies = await forumModel.getForumRepliesByPostId(postId)

    // Unmark any existing best answer
    for (const r of replies) {
      if (r.is_best_answer) {
        await forumModel.updateForumReply(r.id, { is_best_answer: false })
      }
    }

    // Mark this reply as best answer
    const updatedReply = await forumModel.updateForumReply(replyId, { is_best_answer: true })

    // Create notification for the reply author (if not the same as post author)
    if (reply.author_id !== userId) {
      try {
        await notificationModel.createNotification({
          user_id: reply.author_id,
          type: "forum",
          title: "Your answer was marked as best",
          description: `${post.author_name} marked your answer as the best answer`,
          action_url: `/forum/question/${postId}`,
          sender_id: userId,
          sender_name: post.author_name,
          sender_avatar: post.author_avatar,
        })

        // Award points to the reply author
        const replyAuthor = await userModel.getUserById(reply.author_id)
        if (replyAuthor) {
          await userModel.updateUser(reply.author_id, { points: replyAuthor.points + 10 })
        }
      } catch (notificationError) {
        console.error("Error creating notification or updating user:", notificationError)
        // Continue even if notification creation fails
      }
    }

    revalidatePath(`/forum/question/${postId}`)

    return { success: true, reply: updatedReply }
  } catch (error) {
    console.error("Error marking best answer:", error)
    return { success: false, message: "Failed to mark best answer" }
  }
}

export async function getForumPosts(
  page = 1,
  limit = 20,
  filters: {
    department?: string
    tag?: string
    authorId?: string
    sortBy?: "latest" | "popular" | "unanswered"
  } = {},
) {
  try {
    const posts = await forumModel.listForumPosts(page, limit, {
      department: filters.department,
      tag: filters.tag,
      author_id: filters.authorId,
      sortBy: filters.sortBy,
    })

    // Ensure posts is an array
    const postsArray = Array.isArray(posts) ? posts : []

    return { success: true, posts: postsArray }
  } catch (error) {
    console.error("Error getting forum posts:", error)
    return { success: false, message: "Failed to get forum posts", posts: [] }
  }
}
