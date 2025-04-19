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

    // Extract form data
    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")
    const accountType = formData.get("accountType")

    console.log("Sign up data:", { name, email, accountType })

    // Basic validation
    if (!name || !email || !password || !accountType) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Additional fields for technicians
    let additionalFields = {}
    if (accountType === "technician") {
      const phone = formData.get("phone")
      const address = formData.get("address")
      const specialties = formData.get("specialties")

      // Validate technician fields
      if (!phone || !address || !specialties) {
        return NextResponse.json(
          { error: "Phone, address, and specialties are required for technicians" },
          { status: 400 },
        )
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Sign up error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
