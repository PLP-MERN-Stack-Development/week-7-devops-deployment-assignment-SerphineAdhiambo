"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Edit } from "lucide-react"

interface User {
  _id: string
  name: string
  email: string
  createdAt: string
}

interface UserListProps {
  onDelete?: (userId: string) => Promise<void>
  onEdit?: (user: User) => void
}

export default function UserList({ onDelete, onEdit }: UserListProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/users")
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data.users)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId: string) => {
    try {
      await onDelete?.(userId)
      setUsers((prev) => prev.filter((user) => user._id !== userId))
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (loading) {
    return <div data-testid="loading">Loading users...</div>
  }

  if (error) {
    return (
      <div data-testid="error" className="text-red-500">
        Error: {error}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div data-testid="no-users">No users found</div>
        ) : (
          <div className="space-y-2" data-testid="user-list">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-3 border rounded-lg"
                data-testid={`user-item-${user._id}`}
              >
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit?.(user)}
                    data-testid={`edit-user-${user._id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(user._id)}
                    data-testid={`delete-user-${user._id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
