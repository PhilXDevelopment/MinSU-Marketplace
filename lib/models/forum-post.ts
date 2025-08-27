import { neon } from "@neondatabase/serverless"

// Use environment variable for database connection
const DATABASE_URL = process.env.DATABASE_URL || ""

// Create a SQL client
const sql = DATABASE_URL ? neon(DATABASE_URL) : null

// Forum post type definition
export type ForumPost = {
  id: string
  title: string
  content: string
  author_id: string
  author_name: string
  author_rank: string
  author_avatar: string
  department: string
  upvotes: number
  replies: number
  trending: boolean
  timestamp: string
  tags?: string[]
}

// Forum reply type definition
export type ForumReply = {
  id: string
  post_id: string
  content: string
  author_id: string
  author_name: string
  author_rank: string
  author_avatar: string
  upvotes: number
  is_best_answer: boolean
  timestamp: string
  comments?: any[]
}

// Replace the mock forum posts with empty arrays
const mockForumPosts: ForumPost[] = []
const mockForumReplies: ForumReply[] = []

// Create a forum post
export async function createForumPost(
  post: Omit<ForumPost, "id" | "upvotes" | "replies" | "trending" | "timestamp">,
): Promise<ForumPost> {
  try {
    // For development/testing, create in mock data
    if (!sql || process.env.NODE_ENV === "development") {
      const newPost: ForumPost = {
        id: (mockForumPosts.length + 1).toString(),
        ...post,
        upvotes: 0,
        replies: 0,
        trending: false,
        timestamp: new Date().toISOString(),
      }
      mockForumPosts.push(newPost)
      return newPost
    }

    // For production, insert into database
    const result = await sql`
      INSERT INTO forum_posts (
        title, content, author_id, author_name, author_rank, author_avatar, department
      ) VALUES (
        ${post.title}, ${post.content}, ${post.author_id}, ${post.author_name}, 
        ${post.author_rank}, ${post.author_avatar}, ${post.department}
      )
      RETURNING *
    `

    // Insert tags if provided
    if (post.tags && post.tags.length > 0) {
      for (const tag of post.tags) {
        await sql`
          INSERT INTO forum_post_tags (post_id, tag)
          VALUES (${result[0].id}, ${tag})
        `
      }
    }

    // Get the count of replies
    const repliesCount = await sql`
      SELECT COUNT(*) FROM forum_replies WHERE post_id = ${result[0].id}
    `

    return {
      ...result[0],
      replies: Number.parseInt(repliesCount[0].count) || 0,
      tags: post.tags || [],
    }
  } catch (error) {
    console.error("Error creating forum post:", error)
    // Create in mock data as fallback
    const newPost: ForumPost = {
      id: (mockForumPosts.length + 1).toString(),
      ...post,
      upvotes: 0,
      replies: 0,
      trending: false,
      timestamp: new Date().toISOString(),
    }
    mockForumPosts.push(newPost)
    return newPost
  }
}

// Get forum post by ID
export async function getForumPostById(id: string): Promise<ForumPost | null> {
  try {
    // For development/testing, get from mock data
    if (!sql || process.env.NODE_ENV === "development") {
      const post = mockForumPosts.find((post) => post.id === id)
      if (!post) return null

      // Count replies
      const replies = mockForumReplies.filter((reply) => reply.post_id === id)
      return {
        ...post,
        replies: replies.length,
      }
    }

    // For production, query the database
    const posts = await sql`
      SELECT p.*, COUNT(r.id) as replies
      FROM forum_posts p
      LEFT JOIN forum_replies r ON p.id = r.post_id
      WHERE p.id = ${id}
      GROUP BY p.id
    `

    if (posts.length === 0) return null

    // Get tags for this post
    const tags = await sql`
      SELECT tag FROM forum_post_tags WHERE post_id = ${id}
    `

    return {
      ...posts[0],
      replies: Number.parseInt(posts[0].replies) || 0,
      tags: tags.map((t) => t.tag),
    }
  } catch (error) {
    console.error("Error getting forum post by ID:", error)
    // Get from mock data as fallback
    const post = mockForumPosts.find((post) => post.id === id)
    if (!post) return null

    // Count replies
    const replies = mockForumReplies.filter((reply) => reply.post_id === id)
    return {
      ...post,
      replies: replies.length,
    }
  }
}

// Update forum post
export async function updateForumPost(id: string, updates: Partial<ForumPost>): Promise<ForumPost | null> {
  try {
    // For development/testing, update mock data
    if (!sql || process.env.NODE_ENV === "development") {
      const index = mockForumPosts.findIndex((post) => post.id === id)
      if (index === -1) return null

      mockForumPosts[index] = { ...mockForumPosts[index], ...updates }
      return mockForumPosts[index]
    }

    // Create SET parts for the query
    const setParts = []
    const values = []

    // Add each update field to the query
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== "tags") {
        setParts.push(`${key} = $${setParts.length + 1}`)
        values.push(value)
      }
    })

    if (setParts.length === 0) {
      return await getForumPostById(id)
    }

    // Build and execute the query
    const query = `
      UPDATE forum_posts
      SET ${setParts.join(", ")}
      WHERE id = $${setParts.length + 1}
      RETURNING *
    `

    // Add the ID as the last parameter
    values.push(id)

    const result = await sql.query(query, ...values)

    if (result.length === 0) return null

    // Update tags if provided
    if (updates.tags) {
      // Delete existing tags
      await sql`DELETE FROM forum_post_tags WHERE post_id = ${id}`

      // Insert new tags
      for (const tag of updates.tags) {
        await sql`
          INSERT INTO forum_post_tags (post_id, tag)
          VALUES (${id}, ${tag})
        `
      }
    }

    // Get the updated post with tags
    return await getForumPostById(id)
  } catch (error) {
    console.error("Error updating forum post:", error)
    // Update mock data as fallback
    const index = mockForumPosts.findIndex((post) => post.id === id)
    if (index === -1) return null

    mockForumPosts[index] = { ...mockForumPosts[index], ...updates }
    return mockForumPosts[index]
  }
}

// Delete forum post
export async function deleteForumPost(id: string): Promise<boolean> {
  try {
    // For development/testing, delete from mock data
    if (!sql || process.env.NODE_ENV === "development") {
      const index = mockForumPosts.findIndex((post) => post.id === id)
      if (index === -1) return false

      mockForumPosts.splice(index, 1)

      // Also delete related replies
      const replyIndices = mockForumReplies
        .map((reply, index) => (reply.post_id === id ? index : -1))
        .filter((index) => index !== -1)
        .sort((a, b) => b - a) // Sort in descending order to remove from end first

      for (const index of replyIndices) {
        mockForumReplies.splice(index, 1)
      }

      return true
    }

    // Delete tags first (foreign key constraint)
    await sql`DELETE FROM forum_post_tags WHERE post_id = ${id}`

    // Delete replies (foreign key constraint)
    await sql`DELETE FROM forum_replies WHERE post_id = ${id}`

    // Delete the post
    const result = await sql`
      DELETE FROM forum_posts WHERE id = ${id}
      RETURNING id
    `

    return result.length > 0
  } catch (error) {
    console.error("Error deleting forum post:", error)
    return false
  }
}

// Create a forum reply
export async function createForumReply(
  reply: Omit<ForumReply, "id" | "upvotes" | "is_best_answer" | "timestamp">,
): Promise<ForumReply> {
  try {
    // For development/testing, create in mock data
    if (!sql || process.env.NODE_ENV === "development") {
      const newReply: ForumReply = {
        id: (mockForumReplies.length + 1).toString(),
        ...reply,
        upvotes: 0,
        is_best_answer: false,
        timestamp: new Date().toISOString(),
        comments: [],
      }
      mockForumReplies.push(newReply)

      // Update the post's reply count
      const postIndex = mockForumPosts.findIndex((post) => post.id === reply.post_id)
      if (postIndex !== -1) {
        mockForumPosts[postIndex].replies = (mockForumPosts[postIndex].replies || 0) + 1
      }

      return newReply
    }

    // For production, insert into database
    const result = await sql`
      INSERT INTO forum_replies (
        post_id, content, author_id, author_name, author_rank, author_avatar
      ) VALUES (
        ${reply.post_id}, ${reply.content}, ${reply.author_id}, ${reply.author_name}, 
        ${reply.author_rank}, ${reply.author_avatar}
      )
      RETURNING *
    `

    return {
      ...result[0],
      comments: [],
    }
  } catch (error) {
    console.error("Error creating forum reply:", error)
    // Create in mock data as fallback
    const newReply: ForumReply = {
      id: (mockForumReplies.length + 1).toString(),
      ...reply,
      upvotes: 0,
      is_best_answer: false,
      timestamp: new Date().toISOString(),
      comments: [],
    }
    mockForumReplies.push(newReply)
    return newReply
  }
}

// Get forum replies by post ID
export async function getForumRepliesByPostId(postId: string): Promise<ForumReply[]> {
  try {
    // For development/testing, get from mock data
    if (!sql || process.env.NODE_ENV === "development") {
      return mockForumReplies.filter((reply) => reply.post_id === postId)
    }

    // For production, query the database
    const replies = await sql`
      SELECT * FROM forum_replies
      WHERE post_id = ${postId}
      ORDER BY is_best_answer DESC, upvotes DESC, timestamp ASC
    `

    return replies.map((reply) => ({
      ...reply,
      comments: [], // In a real app, you would fetch comments for each reply
    }))
  } catch (error) {
    console.error("Error getting forum replies by post ID:", error)
    // Get from mock data as fallback
    return mockForumReplies.filter((reply) => reply.post_id === postId)
  }
}

// Get forum reply by ID
export async function getForumReplyById(id: string): Promise<ForumReply | null> {
  try {
    // For development/testing, get from mock data
    if (!sql || process.env.NODE_ENV === "development") {
      return mockForumReplies.find((reply) => reply.id === id) || null
    }

    // For production, query the database
    const replies = await sql`
      SELECT * FROM forum_replies WHERE id = ${id}
    `

    if (replies.length === 0) return null

    return {
      ...replies[0],
      comments: [], // In a real app, you would fetch comments for this reply
    }
  } catch (error) {
    console.error("Error getting forum reply by ID:", error)
    // Get from mock data as fallback
    return mockForumReplies.find((reply) => reply.id === id) || null
  }
}

// Update forum reply
export async function updateForumReply(id: string, updates: Partial<ForumReply>): Promise<ForumReply | null> {
  try {
    // For development/testing, update mock data
    if (!sql || process.env.NODE_ENV === "development") {
      const index = mockForumReplies.findIndex((reply) => reply.id === id)
      if (index === -1) return null

      mockForumReplies[index] = { ...mockForumReplies[index], ...updates }
      return mockForumReplies[index]
    }

    // Create SET parts for the query
    const setParts = []
    const values = []

    // Add each update field to the query
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== "comments") {
        setParts.push(`${key} = $${setParts.length + 1}`)
        values.push(value)
      }
    })

    if (setParts.length === 0) {
      return await getForumReplyById(id)
    }

    // Build and execute the query
    const query = `
      UPDATE forum_replies
      SET ${setParts.join(", ")}
      WHERE id = $${setParts.length + 1}
      RETURNING *
    `

    // Add the ID as the last parameter
    values.push(id)

    const result = await sql.query(query, ...values)

    if (result.length === 0) return null

    return {
      ...result[0],
      comments: [], // In a real app, you would fetch comments for this reply
    }
  } catch (error) {
    console.error("Error updating forum reply:", error)
    // Update mock data as fallback
    const index = mockForumReplies.findIndex((reply) => reply.id === id)
    if (index === -1) return null

    mockForumReplies[index] = { ...mockForumReplies[index], ...updates }
    return mockForumReplies[index]
  }
}

// Delete forum reply
export async function deleteForumReply(id: string): Promise<boolean> {
  try {
    // For development/testing, delete from mock data
    if (!sql || process.env.NODE_ENV === "development") {
      const replyIndex = mockForumReplies.findIndex((reply) => reply.id === id)
      if (replyIndex === -1) return false

      const postId = mockForumReplies[replyIndex].post_id
      mockForumReplies.splice(replyIndex, 1)

      // Update the post's reply count
      const postIndex = mockForumPosts.findIndex((post) => post.id === postId)
      if (postIndex !== -1 && mockForumPosts[postIndex].replies > 0) {
        mockForumPosts[postIndex].replies--
      }

      return true
    }

    // Get the post_id before deleting (to update reply count)
    const reply = await sql`SELECT post_id FROM forum_replies WHERE id = ${id}`
    if (reply.length === 0) return false

    const postId = reply[0].post_id

    // Delete the reply
    const result = await sql`
      DELETE FROM forum_replies WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) return false

    // Update the post's reply count
    await sql`
      UPDATE forum_posts
      SET replies = (SELECT COUNT(*) FROM forum_replies WHERE post_id = ${postId})
      WHERE id = ${postId}
    `

    return true
  } catch (error) {
    console.error("Error deleting forum reply:", error)
    return false
  }
}

// List forum posts with filtering, sorting, and pagination
export async function listForumPosts(
  page = 1,
  limit = 20,
  filters: {
    department?: string
    tag?: string
    author_id?: string
    sortBy?: "latest" | "popular" | "unanswered"
  } = {},
): Promise<ForumPost[]> {
  try {
    // For development/testing, filter mock data
    if (!sql || process.env.NODE_ENV === "development") {
      let filteredPosts = [...mockForumPosts]

      // Apply filters
      if (filters.department) {
        filteredPosts = filteredPosts.filter((post) => post.department === filters.department)
      }

      if (filters.tag) {
        filteredPosts = filteredPosts.filter((post) => post.tags?.includes(filters.tag))
      }

      if (filters.author_id) {
        filteredPosts = filteredPosts.filter((post) => post.author_id === filters.author_id)
      }

      // Apply sorting
      if (filters.sortBy === "latest") {
        filteredPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      } else if (filters.sortBy === "popular") {
        filteredPosts.sort((a, b) => b.upvotes - a.upvotes)
      } else if (filters.sortBy === "unanswered") {
        filteredPosts.sort((a, b) => (a.replies === 0 ? -1 : 1) - (b.replies === 0 ? -1 : 1))
      }

      // Apply pagination
      const start = (page - 1) * limit
      const end = start + limit

      return filteredPosts.slice(start, end)
    }

    // For production, query the database with filters
    let query = `
      SELECT p.*, COUNT(r.id) as replies
      FROM forum_posts p
      LEFT JOIN forum_replies r ON p.id = r.post_id
    `

    const whereConditions = []
    const queryParams = []

    if (filters.department) {
      whereConditions.push(`p.department = $${queryParams.length + 1}`)
      queryParams.push(filters.department)
    }

    if (filters.author_id) {
      whereConditions.push(`p.author_id = $${queryParams.length + 1}`)
      queryParams.push(filters.author_id)
    }

    if (whereConditions.length > 0) {
      query += ` WHERE ${whereConditions.join(" AND ")}`
    }

    query += ` GROUP BY p.id`

    // Apply sorting
    if (filters.sortBy === "latest") {
      query += ` ORDER BY p.timestamp DESC`
    } else if (filters.sortBy === "popular") {
      query += ` ORDER BY p.upvotes DESC`
    } else if (filters.sortBy === "unanswered") {
      query += ` ORDER BY COUNT(r.id) ASC, p.timestamp DESC`
    } else {
      query += ` ORDER BY p.timestamp DESC`
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query += ` LIMIT ${limit} OFFSET ${offset}`

    const posts = await sql.query(query, ...queryParams)

    // Get tags for each post
    const postsWithTags = await Promise.all(
      posts.map(async (post) => {
        const tags = await sql`
        SELECT tag FROM forum_post_tags WHERE post_id = ${post.id}
      `

        return {
          ...post,
          replies: Number.parseInt(post.replies) || 0,
          tags: tags.map((t) => t.tag),
        }
      }),
    )

    return postsWithTags
  } catch (error) {
    console.error("Error listing forum posts:", error)
    // Filter mock data as fallback
    let filteredPosts = [...mockForumPosts]

    // Apply filters
    if (filters.department) {
      filteredPosts = filteredPosts.filter((post) => post.department === filters.department)
    }

    if (filters.tag) {
      filteredPosts = filteredPosts.filter((post) => post.tags?.includes(filters.tag))
    }

    if (filters.author_id) {
      filteredPosts = filteredPosts.filter((post) => post.author_id === filters.author_id)
    }

    // Apply sorting
    if (filters.sortBy === "latest") {
      filteredPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    } else if (filters.sortBy === "popular") {
      filteredPosts.sort((a, b) => b.upvotes - a.upvotes)
    } else if (filters.sortBy === "unanswered") {
      filteredPosts.sort((a, b) => (a.replies === 0 ? -1 : 1) - (b.replies === 0 ? -1 : 1))
    }

    // Apply pagination
    const start = (page - 1) * limit
    const end = start + limit

    return filteredPosts.slice(start, end)
  }
}
