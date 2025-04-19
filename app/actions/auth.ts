"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// In a real app, you would use a database
// This is just for demonstration purposes
const users = [
  {
    id: "1",
    name: "Demo User",
    email: "user@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "user",
  },
  {
    id: "2",
    name: "Demo Technician",
    email: "tech@example.com",
    password: "password123", // In a real app, this would be hashed
    role: "technician",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State",
    specialties: "Smartphones, Laptops, TVs",
  },
]

export async function signIn(formData) {
  try {
    const email = formData.get("email")
    const password = formData.get("password")

    // Validate inputs
    if (!email || !password) {
      return { error: "Email and password are required" }
    }

    // Find user
    const user = users.find((u) => u.email === email)

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return { error: "Invalid email or password" }
    }

    // Set authentication cookie (in a real app, use a proper session mechanism)
    cookies().set(
      "auth",
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      },
    )

    // Redirect to home page
    redirect("/")
  } catch (error) {
    console.error("Sign in error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signUp(formData) {
  try {
    // Extract form data
    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")
    const accountType = formData.get("accountType")

    console.log("Sign up data:", { name, email, password, accountType })

    // Basic validation
    if (!name || !email || !password || !accountType) {
      return { error: "All fields are required" }
    }

    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      return { error: "User with this email already exists" }
    }

    // Additional fields for technicians
    let additionalFields = {}
    if (accountType === "technician") {
      const phone = formData.get("phone")
      const address = formData.get("address")
      const specialties = formData.get("specialties")

      // Validate technician fields
      if (!phone || !address || !specialties) {
        return { error: "Phone, address, and specialties are required for technicians" }
      }

      additionalFields = { phone, address, specialties }
    }

    // Create new user (in a real app, this would be saved to a database)
    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      password,
      role: accountType,
      ...additionalFields,
    }

    // Add user to our "database"
    users.push(newUser)

    console.log("New user created:", newUser)

    // Set authentication cookie
    cookies().set(
      "auth",
      JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      },
    )

    // Redirect to home page
    redirect("/")
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  try {
    // Delete the authentication cookie
    cookies().delete("auth")

    // Redirect to home page
    redirect("/")
  } catch (error) {
    console.error("Sign out error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function getSession() {
  try {
    const authCookie = cookies().get("auth")

    if (!authCookie) {
      return null
    }

    return JSON.parse(authCookie.value)
  } catch (error) {
    console.error("Get session error:", error)
    return null
  }
}
