import { validateEmail, validatePassword, validateUser } from "@/utils/validation"

describe("Validation Utils", () => {
  describe("validateEmail", () => {
    it("should validate correct email addresses", () => {
      const result = validateEmail("test@example.com")
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("should reject invalid email addresses", () => {
      const result = validateEmail("invalid-email")
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Invalid email format")
    })

    it("should reject empty email", () => {
      const result = validateEmail("")
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Email is required")
    })
  })

  describe("validatePassword", () => {
    it("should validate strong passwords", () => {
      const result = validatePassword("StrongPass123")
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("should reject weak passwords", () => {
      const result = validatePassword("weak")
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it("should require minimum length", () => {
      const result = validatePassword("12345")
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Password must be at least 6 characters")
    })
  })

  describe("validateUser", () => {
    const validUser = {
      email: "test@example.com",
      password: "StrongPass123",
      name: "John Doe",
    }

    it("should validate complete user data", () => {
      const result = validateUser(validUser)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it("should reject user with invalid email", () => {
      const result = validateUser({
        ...validUser,
        email: "invalid-email",
      })
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Invalid email format")
    })

    it("should reject user with short name", () => {
      const result = validateUser({
        ...validUser,
        name: "A",
      })
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain("Name must be at least 2 characters")
    })
  })
})
