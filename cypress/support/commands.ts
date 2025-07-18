import { Cypress, cy } from "cypress"

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/login")
  cy.get('[data-testid="email-input"]').type(email)
  cy.get('[data-testid="password-input"]').type(password)
  cy.get('[data-testid="submit-button"]').click()
})

Cypress.Commands.add("createUser", (userData) => {
  cy.request({
    method: "POST",
    url: "/api/users",
    body: userData,
  })
})

Cypress.Commands.add("cleanupUsers", () => {
  cy.request({
    method: "DELETE",
    url: "/api/test/cleanup",
    failOnStatusCode: false,
  })
})
