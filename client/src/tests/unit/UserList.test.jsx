import { render, screen, waitFor } from "@testing-library/react"
import UserList from "../../components/UserList"
import { AuthProvider } from "../../contexts/AuthContext"
import api from "../../utils/api"
import jest from "jest" // Import jest to declare the variable

jest.mock("../../utils/api")

const mockUsers = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "admin",
    createdAt: "2023-01-02T00:00:00.000Z",
  },
]

const renderUserList = (authValue = {}) => {
  return render(
    <AuthProvider value={authValue}>
      <UserList />
    </AuthProvider>,
  )
}

describe("UserList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("shows loading state initially", () => {
    api.get.mockImplementation(() => new Promise(() => {}))
    renderUserList()

    expect(screen.getByTestId("loading")).toBeInTheDocument()
  })

  test("displays users after successful fetch", async () => {
    api.get.mockResolvedValue({
      data: { users: mockUsers },
    })

    renderUserList()

    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument()
    })

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("jane@example.com")).toBeInTheDocument()
    expect(screen.getByText("Users (2)")).toBeInTheDocument()
  })

  test("shows error message on fetch failure", async () => {
    api.get.mockRejectedValue({
      response: { data: { error: "Failed to fetch users" } },
    })

    renderUserList()

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument()
    })

    expect(screen.getByText("Error: Failed to fetch users")).toBeInTheDocument()
  })

  test("shows no users message when list is empty", async () => {
    api.get.mockResolvedValue({
      data: { users: [] },
    })

    renderUserList()

    await waitFor(() => {
      expect(screen.getByTestId("no-users")).toBeInTheDocument()
    })
  })
})
