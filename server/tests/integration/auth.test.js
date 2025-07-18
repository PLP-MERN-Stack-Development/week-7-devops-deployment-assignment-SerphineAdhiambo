const request = require("supertest")
const mongoose = require("mongoose")
const { MongoMemoryServer } = require("mongodb-memory-server")
const app = require("../../src/index")
const User = require("../../src/models/User")

let mongoServer

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

describe("Auth Integration Tests", () => {
  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "TestPass123",
  }

  describe("User Registration and Login Flow", () => {
    test("should complete full registration and login flow", async () => {
      // Register user
      const registerResponse = await request(app).post("/api/auth/register").send(testUser)

      expect(registerResponse.status).toBe(201)
      expect(registerResponse.body.user.email).toBe(testUser.email)
      expect(registerResponse.body.token).toBeDefined()

      // Verify user was created in database
      const createdUser = await User.findOne({ email: testUser.email })
      expect(createdUser).toBeTruthy()
      expect(createdUser.name).toBe(testUser.name)

      // Login with created user
      const loginResponse = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      })

      expect(loginResponse.status).toBe(200)
      expect(loginResponse.body.token).toBeDefined()
      expect(loginResponse.body.user.email).toBe(testUser.email)
    })

    test("should prevent duplicate user registration", async () => {
      // Create first user
      await new User(testUser).save()

      // Try to register duplicate user
      const response = await request(app).post("/api/auth/register").send(testUser)

      expect(response.status).toBe(409)
      expect(response.body.error).toBe("User already exists with this email")
    })

    test("should hash password correctly", async () => {
      // Register user
      await request(app).post("/api/auth/register").send(testUser)

      // Check that password is hashed in database
      const user = await User.findOne({ email: testUser.email })
      expect(user.password).not.toBe(testUser.password)
      expect(user.password.length).toBeGreaterThan(20) // Hashed password should be longer
    })
  })
})
