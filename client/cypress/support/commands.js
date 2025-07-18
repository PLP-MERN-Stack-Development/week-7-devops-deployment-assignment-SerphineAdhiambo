const Cypress = require("cypress")
const cy = Cypress.cy

Cypress.Commands.add("login", (email, password) => {
  cy.visit("/login")
  cy.get('[data-testid="email-input"]').type(email)
  cy.get('[data-testid="password-input"]').type(password)
  cy.get('[data-testid="submit-button"]').click()
})

Cypress.Commands.add("createUser", (userData) => {
  cy.request({
    method: "POST",
    url: "http://localhost:5000/api/auth/register",
    body: userData,
  })
})

Cypress.Commands.add("cleanupUsers", () => {
  cy.request({
    method: "DELETE",
    url: "http://localhost:5000/api/test/cleanup",
    failOnStatusCode: false,
  })
})
