import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const authCookie = cookies().get("auth")

  if (!authCookie) {
    return NextResponse.json({ user: null })
  }

  try {
    const user = JSON.parse(authCookie.value)
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ user: null })
  }
}
