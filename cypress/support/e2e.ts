// Import commands.js using ES2015 syntax:
import "./commands"

// Alternatively you can use CommonJS syntax:
// require('./commands')

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      createUser(userData: { email: string; password: string; name: string }): Chainable<void>
      cleanupUsers(): Chainable<void>
    }
  }
}
