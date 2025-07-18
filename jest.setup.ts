"use client"

import jest from "jest"
import "@testing-library/jest-dom"
import { TextEncoder, TextDecoder } from "util"

// Polyfill for Node.js environment
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return "/"
  },
}))

// Mock environment variables
process.env.NODE_ENV = "test"
process.env.MONGODB_URI = "mongodb://localhost:27017/test"
process.env.JWT_SECRET = "test-secret"

// Global test utilities
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
}
