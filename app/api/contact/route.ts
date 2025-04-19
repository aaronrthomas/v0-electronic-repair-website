import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    // Get form data
    const formData = await request.formData()

    const name = formData.get("name")
    const email = formData.get("email")
    const subject = formData.get("subject")
    const message = formData.get("message")

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Send an email notification
    // 2. Store the message in a database
    // 3. Maybe send an auto-reply to the user

    console.log("Contact form submission:", { name, email, subject, message })

    // For demo purposes, we'll just return a success response
    return NextResponse.json({
      success: true,
      message: "Thank you for your message. We'll get back to you soon!",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
