// Import commands.js using ES2015 syntax:
import "./commands"
import { Chainable } from "cypress"

// Alternatively you can use CommonJS syntax:
// require('./commands')

declare namespace Cypress {
  interface Chainable {
    login(email: string, password: string): Chainable<void>
    createUser(userData: { email: string; password: string; name: string }): Chainable<void>
    cleanupUsers(): Chainable<void>
  }
}
