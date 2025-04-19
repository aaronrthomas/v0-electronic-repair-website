"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

type User = {
  id: string
  name: string
  email: string
  role: string
}

export function AuthStatus() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/session")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error("Failed to load user session:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  async function handleSignOut() {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
      })

      if (response.ok) {
        // Reload the page to update the UI
        window.location.href = "/"
      }
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-8 w-24 animate-pulse rounded bg-gray-200"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/signin">
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm">Sign Up</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm">Hi, {user.name}</span>
      <Button variant="outline" size="sm" onClick={handleSignOut}>
        Sign Out
      </Button>
    </div>
  )
}
