import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import { validateUser } from "@/utils/validation"

export async function GET() {
  try {
    await connectDB()

    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 })

    return NextResponse.json({
      users,
      count: users.length,
    })
  } catch (error: any) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userData = await request.json()
    const validation = validateUser(userData)

    if (!validation.isValid) {
      return NextResponse.json({ error: "Validation failed", details: validation.errors }, { status: 400 })
    }

    const existingUser = await User.findOne({ email: userData.email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const user = new User(userData)
    await user.save()

    const userResponse = user.toObject()
    delete userResponse.password

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userResponse,
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
