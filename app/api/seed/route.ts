import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 })
  }

  try {
    await connectDB()

    // Clear existing users
    await User.deleteMany({})

    // Create test users
    const testUsers = [
      {
        email: "test@example.com",
        password: "TestPass123",
        name: "Test User",
      },
      {
        email: "admin@example.com",
        password: "AdminPass123",
        name: "Admin User",
      },
    ]

    const createdUsers = []
    for (const userData of testUsers) {
      const user = new User(userData)
      await user.save()
      createdUsers.push({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      })
    }

    return NextResponse.json({
      message: "Test data seeded successfully",
      users: createdUsers,
    })
  } catch (error: any) {
    console.error("Seed error:", error)
    return NextResponse.json(
      {
        error: "Failed to seed data",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
