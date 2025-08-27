"use server"

import { cookies } from "next/headers"

export async function checkAdminAuth() {
  const cookieStore = cookies()
  const adminAuth = cookieStore.get("minsu-admin-auth")

  return {
    isAuthenticated: !!adminAuth,
  }
}
