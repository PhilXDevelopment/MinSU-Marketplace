// Create a new file for centralized user data

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  rank: "Newbie" | "Helper" | "Expert"
  points: number
  joinedDate: string
  campus: string
  department?: string
  github?: string
  isOnline: boolean
  lastSeen: string | null
  forumAnswers: number
  itemsListed: number
  itemsPurchased: number
  badges: Array<{ name: string; icon: string; color: string }>
  activities: Array<{ type: string; title: string; time: string }>
}

// If this file exists, replace the mock users with an empty array
export const users = []

// Expanded mock user data
export const mockUsers: UserProfile[] = []

// Function to get user by ID
export function getUserById(id: string): UserProfile | undefined {
  return mockUsers.find((user) => user.id === id)
}
