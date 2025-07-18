import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import UserList from "@/components/UserList"
import { jest } from "@jest/globals"

// Mock fetch
global.fetch = jest.fn()

const mockUsers = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    createdAt: "2023-01-02T00:00:00.000Z",
  },
]

describe("UserList", () => {
  const mockOnDelete = jest.fn()
  const mockOnEdit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows loading state initially", () => {
    ;(fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))

    render(<UserList onDelete={mockOnDelete} onEdit={mockOnEdit} />)

    expect(screen.getByTestId("loading")).toBeInTheDocument()
  })

  it("displays users after successful fetch", async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ users: mockUsers }),
    })

    render(<UserList onDelete={mockOnDelete} onEdit={mockOnEdit} />)

    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument()
    })

    expect(screen.getByText("John Doe")).toBeInTheDocument()
    expect(screen.getByText("jane@example.com")).toBeInTheDocument()
    expect(screen.getByText("Users (2)")).toBeInTheDocument()
  })

  it("shows error message on fetch failure", async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
    })

    render(<UserList onDelete={mockOnDelete} onEdit={mockOnEdit} />)

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument()
    })
  })

  it("shows no users message when list is empty", async () => {
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ users: [] }),
    })

    render(<UserList onDelete={mockOnDelete} onEdit={mockOnEdit} />)

    await waitFor(() => {
      expect(screen.getByTestId("no-users")).toBeInTheDocument()
    })
  })

  it("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup()
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ users: mockUsers }),
    })

    render(<UserList onDelete={mockOnDelete} onEdit={mockOnEdit} />)

    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument()
    })

    const editButton = screen.getByTestId("edit-user-1")
    await user.click(editButton)

    expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[0])
  })

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup()
    mockOnDelete.mockResolvedValue(undefined)
    ;(fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ users: mockUsers }),
    })

    render(<UserList onDelete={mockOnDelete} onEdit={mockOnEdit} />)

    await waitFor(() => {
      expect(screen.getByTestId("user-list")).toBeInTheDocument()
    })

    const deleteButton = screen.getByTestId("delete-user-1")
    await user.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith("1")
  })
})
