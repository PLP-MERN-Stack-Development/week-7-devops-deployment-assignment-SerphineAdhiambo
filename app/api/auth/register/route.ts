import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { validateUser } from "@/utils/validation"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userData = await request.json()

    // Validate user data
    const validation = validateUser(userData)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: userData.email.toLowerCase(),
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    // Create new user
    const user = new User({
      ...userData,
      email: userData.email.toLowerCase(),
    })

    await user.save()

    // Return user without password
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userResponse,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Registration error:", error)

    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(
        {
          error: "Failed to create user",
          details: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
