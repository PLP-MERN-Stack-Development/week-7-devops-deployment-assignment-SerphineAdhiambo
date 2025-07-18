import { NextRequest } from "next/server"
import { POST } from "@/app/api/auth/login/route"
import connectDB from "@/lib/db"
import User from "@/lib/models/User"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock dependencies
jest.mock("@/lib/db")
jest.mock("@/lib/models/User")

const mockConnectDB = connectDB as jest.MockedFunction<typeof connectDB>
const mockUser = User as jest.Mocked<typeof User>

describe("/api/auth/login", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should login user with valid credentials", async () => {
    const mockUserData = {
      _id: "user123",
      email: "test@example.com",
      name: "Test User",
      comparePassword: jest.fn().mockResolvedValue(true),
    }

    mockConnectDB.mockResolvedValue(undefined)
    mockUser.findOne.mockResolvedValue(mockUserData)

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe("Login successful")
    expect(data.token).toBeDefined()
    expect(data.user.email).toBe("test@example.com")
  })

  it("should return 400 for missing credentials", async () => {
    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("Email and password are required")
  })

  it("should return 401 for invalid credentials", async () => {
    mockConnectDB.mockResolvedValue(undefined)
    mockUser.findOne.mockResolvedValue(null)

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "wrongpassword",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe("Invalid credentials")
  })

  it("should return 401 for wrong password", async () => {
    const mockUserData = {
      _id: "user123",
      email: "test@example.com",
      name: "Test User",
      comparePassword: jest.fn().mockResolvedValue(false),
    }

    mockConnectDB.mockResolvedValue(undefined)
    mockUser.findOne.mockResolvedValue(mockUserData)

    const request = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "test@example.com",
        password: "wrongpassword",
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe("Invalid credentials")
  })
})
