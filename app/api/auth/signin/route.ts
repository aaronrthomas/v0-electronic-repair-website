import { NextResponse } from "next/server"
import { cookies } from "next/headers"

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

export async function POST(request) {
  try {
    // Get form data
    const formData = await request.formData()

    const email = formData.get("email")
    const password = formData.get("password")

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const user = users.find((u) => u.email === email)

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
