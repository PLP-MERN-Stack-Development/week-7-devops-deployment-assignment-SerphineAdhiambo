import { describe, beforeEach, it } from "mocha"
import { cy } from "cypress"

describe("Authentication Flow", () => {
  beforeEach(() => {
    // Clear any existing data
    cy.request({
      method: "POST",
      url: "http://localhost:5000/api/test/cleanup",
      failOnStatusCode: false,
    })
  })

  it("should complete user registration flow", () => {
    cy.visit("/register")

    cy.get('[data-testid="name-input"]').type("Test User")
    cy.get('[data-testid="email-input"]').type("test@example.com")
    cy.get('[data-testid="password-input"]').type("TestPass123")
    cy.get('[data-testid="submit-button"]').click()

    cy.url().should("include", "/dashboard")
    cy.contains("Welcome, Test User").should("be.visible")
  })

  it("should login existing user", () => {
    // Create user first
    cy.request("POST", "http://localhost:5000/api/auth/register", {
      name: "Test User",
      email: "test@example.com",
      password: "TestPass123",
    })

    cy.visit("/login")
    cy.get('[data-testid="email-input"]').type("test@example.com")
    cy.get('[data-testid="password-input"]').type("TestPass123")
    cy.get('[data-testid="submit-button"]').click()

    cy.url().should("include", "/dashboard")
    cy.contains("Welcome").should("be.visible")
  })

  it("should display validation errors for invalid login", () => {
    cy.visit("/login")
    cy.get('[data-testid="submit-button"]').click()

    // HTML5 validation should prevent submission
    cy.url().should("include", "/login")
  })

  it("should handle server errors gracefully", () => {
    cy.intercept("POST", "/api/auth/login", { statusCode: 500 }).as("loginError")

    cy.visit("/login")
    cy.get('[data-testid="email-input"]').type("test@example.com")
    cy.get('[data-testid="password-input"]').type("TestPass123")
    cy.get('[data-testid="submit-button"]').click()

    cy.wait("@loginError")
    cy.get('[data-testid="error-messages"]').should("be.visible")
  })
})
