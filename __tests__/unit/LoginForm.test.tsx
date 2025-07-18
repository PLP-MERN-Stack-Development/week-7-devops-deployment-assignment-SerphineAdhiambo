"use client"

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import LoginForm from "@/components/LoginForm"
import { jest } from "@jest/globals"

describe("LoginForm", () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it("renders login form correctly", () => {
    render(<LoginForm onSubmit={mockOnSubmit} />)

    expect(screen.getByText("Login")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument()
  })

  it("handles form input changes", async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={mockOnSubmit} />)

    const emailInput = screen.getByTestId("email-input")
    const passwordInput = screen.getByTestId("password-input")

    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "password123")

    expect(emailInput).toHaveValue("test@example.com")
    expect(passwordInput).toHaveValue("password123")
  })

  it("shows validation errors for empty fields", async () => {
    const user = userEvent.setup()
    render(<LoginForm onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByTestId("submit-button")
    await user.click(submitButton)

    expect(screen.getByTestId("error-message")).toHaveTextContent("Email and password are required")
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it("calls onSubmit with form data when valid", async () => {
    const user = userEvent.setup()
    mockOnSubmit.mockResolvedValue(undefined)

    render(<LoginForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByTestId("email-input"), "test@example.com")
    await user.type(screen.getByTestId("password-input"), "password123")
    await user.click(screen.getByTestId("submit-button"))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      })
    })
  })

  it("shows loading state when submitting", () => {
    render(<LoginForm onSubmit={mockOnSubmit} loading={true} />)

    const submitButton = screen.getByTestId("submit-button")
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveTextContent("Logging in...")
  })

  it("handles submission errors", async () => {
    const user = userEvent.setup()
    const errorMessage = "Invalid credentials"
    mockOnSubmit.mockRejectedValue(new Error(errorMessage))

    render(<LoginForm onSubmit={mockOnSubmit} />)

    await user.type(screen.getByTestId("email-input"), "test@example.com")
    await user.type(screen.getByTestId("password-input"), "wrongpassword")
    await user.click(screen.getByTestId("submit-button"))

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent(errorMessage)
    })
  })
})
