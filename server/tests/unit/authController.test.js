const request = require("supertest")
const app = require("../../src/index")
const User = require("../../src/models/User")
const jest = require("jest")

jest.mock("../../src/models/User")

describe("Auth Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST /api/auth/register", () => {
    test("should register a new user successfully", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "TestPass123",
      }

      User.findOne.mockResolvedValue(null)
      User.prototype.save = jest.fn().mockResolvedValue({
        _id: "user123",
        ...userData,
        toJSON: () => ({ _id: "user123", name: userData.name, email: userData.email }),
      })

      const response = await request(app).post("/api/auth/register").send(userData)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe("User registered successfully")
      expect(response.body.token).toBeDefined()
      expect(response.body.user.email).toBe(userData.email)
    })

    test("should return 409 if user already exists", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "TestPass123",
      }

      User.findOne.mockResolvedValue({ email: userData.email })

      const response = await request(app).post("/api/auth/register").send(userData)

      expect(response.status).toBe(409)
      expect(response.body.error).toBe("User already exists with this email")
    })

    test("should return 400 for invalid data", async () => {
      const invalidData = {
        name: "A",
        email: "invalid-email",
        password: "123",
      }

      const response = await request(app).post("/api/auth/register").send(invalidData)

      expect(response.status).toBe(400)
      expect(response.body.error).toBe("Validation failed")
    })
  })

  describe("POST /api/auth/login", () => {
    test("should login user with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "TestPass123",
      }

      const mockUser = {
        _id: "user123",
        email: loginData.email,
        name: "Test User",
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON: () => ({ _id: "user123", email: loginData.email, name: "Test User" }),
      }

      User.findOne.mockResolvedValue(mockUser)

      const response = await request(app).post("/api/auth/login").send(loginData)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe("Login successful")
      expect(response.body.token).toBeDefined()
      expect(response.body.user.email).toBe(loginData.email)
    })

    test("should return 401 for invalid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      }

      User.findOne.mockResolvedValue(null)

      const response = await request(app).post("/api/auth/login").send(loginData)

      expect(response.status).toBe(401)
      expect(response.body.error).toBe("Invalid credentials")
    })
  })
})
