// Import commands.js using ES2015 syntax:
import "./commands"
import Cypress from "cypress"

// Import global styles or component styles here
// import './commands'
import { mount } from "cypress/react18"

Cypress.Commands.add("mount", mount)
