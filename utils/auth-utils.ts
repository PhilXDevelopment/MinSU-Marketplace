// Helper function to check if user is authenticated
export const isAdminAuthenticated = () => {
  if (typeof window === "undefined") return false

  try {
    return localStorage.getItem("minsu-admin-auth") === "true"
  } catch (error) {
    console.error("Error checking admin auth:", error)
    return false
  }
}

// Helper function to get admin user data
export const getAdminUser = () => {
  if (typeof window === "undefined") return null

  try {
    const userData = localStorage.getItem("minsu-admin-user")
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error("Error getting admin user:", error)
    return null
  }
}
