// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom"
import { beforeEach } from "@jest/globals"

// Mock environment variables
process.env.REACT_APP_API_URL = "http://localhost:5000/api"

// Global test setup
beforeEach(() => {
  // Clear localStorage before each test
  localStorage.clear()
})

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  // Uncomment to ignore specific console methods in tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
}
