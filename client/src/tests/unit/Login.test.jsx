import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { BrowserRouter } from "react-router-dom"
import Login from "../../components/Login"
import { AuthProvider } from "../../contexts/AuthContext"
import jest from "jest" // Import jest to declare it

// Mock the useNavigate hook
const mockNavigate = jest.fn()
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}))

// Mock API
jest.mock("../../utils/api")

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>,
  )
}

describe("Login Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  test("renders login form", () => {
    renderLogin()

    expect(screen.getByText("Login")).toBeInTheDocument()
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByLabelText("Password")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument()
  })

  test("handles input changes", async () => {
    const user = userEvent.setup()
    renderLogin()

    const emailInput = screen.getByTestId("email-input")
    const passwordInput = screen.getByTestId("password-input")

    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "password123")

    expect(emailInput).toHaveValue("test@example.com")
    expect(passwordInput).toHaveValue("password123")
  })

  test("shows validation errors for empty form", async () => {
    const user = userEvent.setup()
    renderLogin()

    const submitButton = screen.getByTestId("submit-button")
    await user.click(submitButton)

    // HTML5 validation will prevent form submission
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  test("shows loading state during submission", async () => {
    const user = userEvent.setup()
    renderLogin()

    const emailInput = screen.getByTestId("email-input")
    const passwordInput = screen.getByTestId("password-input")
    const submitButton = screen.getByTestId("submit-button")

    await user.type(emailInput, "test@example.com")
    await user.type(passwordInput, "password123")

    fireEvent.click(submitButton)

    expect(submitButton).toHaveTextContent("Logging in...")
    expect(submitButton).toBeDisabled()
  })
})
