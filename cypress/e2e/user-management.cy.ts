import { describe, beforeEach, it } from "cypress"
import { cy } from "cypress"

describe("User Management E2E", () => {
  const testUser = {
    email: "test@example.com",
    password: "TestPass123",
    name: "Test User",
  }

  beforeEach(() => {
    cy.cleanupUsers()
  })

  it("should complete user registration flow", () => {
    cy.visit("/register")

    cy.get('[data-testid="name-input"]').type(testUser.name)
    cy.get('[data-testid="email-input"]').type(testUser.email)
    cy.get('[data-testid="password-input"]').type(testUser.password)
    cy.get('[data-testid="submit-button"]').click()

    cy.url().should("include", "/dashboard")
    cy.contains("Welcome, Test User").should("be.visible")
  })

  it("should login existing user", () => {
    cy.createUser(testUser)

    cy.login(testUser.email, testUser.password)

    cy.url().should("include", "/dashboard")
    cy.contains("Welcome").should("be.visible")
  })

  it("should display validation errors for invalid login", () => {
    cy.visit("/login")

    cy.get('[data-testid="submit-button"]').click()

    cy.get('[data-testid="error-message"]').should("be.visible").and("contain", "Email and password are required")
  })

  it("should manage users in admin panel", () => {
    cy.createUser(testUser)
    cy.createUser({
      email: "admin@example.com",
      password: "AdminPass123",
      name: "Admin User",
    })

    cy.login("admin@example.com", "AdminPass123")
    cy.visit("/admin/users")

    cy.get('[data-testid="user-list"]').should("be.visible")
    cy.get('[data-testid="user-item-1"]').should("contain", testUser.name)

    // Test user deletion
    cy.get('[data-testid="delete-user-1"]').click()
    cy.get('[data-testid="confirm-delete"]').click()

    cy.get('[data-testid="user-item-1"]').should("not.exist")
  })

  it("should handle network errors gracefully", () => {
    cy.intercept("POST", "/api/auth/login", { forceNetworkError: true })

    cy.visit("/login")
    cy.get('[data-testid="email-input"]').type(testUser.email)
    cy.get('[data-testid="password-input"]').type(testUser.password)
    cy.get('[data-testid="submit-button"]').click()

    cy.get('[data-testid="error-message"]').should("be.visible").and("contain", "Network error")
  })
})
