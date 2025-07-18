import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import { NextRequest } from "next/server"
import { POST as loginPost } from "@/app/api/auth/login/route"
import { GET as usersGet, POST as usersPost } from "@/app/api/users/route"
import User from "@/lib/models/User"

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()
  await mongoose.connect(mongoUri)
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

beforeEach(async () => {
  await User.deleteMany({})
})

describe("User Flow Integration Tests", () => {
  const testUser = {
    email: "test@example.com",
    password: "TestPass123",
    name: "Test User",
  }

  it("should complete full user registration and login flow", async () => {
    // 1. Create user
    const createRequest = new NextRequest("http://localhost:3000/api/users", {
      method: "POST",
      body: JSON.stringify(testUser),
    })

    const createResponse = await usersPost(createRequest)
    const createData = await createResponse.json()

    expect(createResponse.status).toBe(201)
    expect(createData.user.email).toBe(testUser.email)
    expect(createData.user.password).toBeUndefined()

    // 2. Login with created user
    const loginRequest = new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    })

    const loginResponse = await loginPost(loginRequest)
    const loginData = await loginResponse.json()

    expect(loginResponse.status).toBe(200)
    expect(loginData.token).toBeDefined()
    expect(loginData.user.email).toBe(testUser.email)

    // 3. Fetch users list
    const usersResponse = await usersGet()
    const usersData = await usersResponse.json()

    expect(usersResponse.status).toBe(200)
    expect(usersData.users).toHaveLength(1)
    expect(usersData.users[0].email).toBe(testUser.email)
  })

  it("should prevent duplicate user registration", async () => {
    // Create first user
    await new User(testUser).save()

    // Try to create duplicate user
    const request = new NextRequest("http://localhost:3000/api/users", {
      method: "POST",
      body: JSON.stringify(testUser),
    })

    const response = await usersPost(request)
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data.error).toBe("User already exists")
  })

  it("should validate user data on registration", async () => {
    const invalidUser = {
      email: "invalid-email",
      password: "123",
      name: "A",
    }

    const request = new NextRequest("http://localhost:3000/api/users", {
      method: "POST",
      body: JSON.stringify(invalidUser),
    })

    const response = await usersPost(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("Validation failed")
    expect(data.details).toContain("Invalid email format")
    expect(data.details).toContain("Password must be at least 6 characters")
    expect(data.details).toContain("Name must be at least 2 characters")
  })
})
