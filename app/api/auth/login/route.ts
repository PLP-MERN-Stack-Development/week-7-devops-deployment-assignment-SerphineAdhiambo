import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB()

    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key-for-development"
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      jwtSecret,
      { expiresIn: "7d" },
    )

    // Return success response
    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    })
  } catch (error: any) {
    console.error("Login error:", error)

    // Return detailed error in development
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(
        {
          error: "Internal server error",
          details: error.message,
          stack: error.stack,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
