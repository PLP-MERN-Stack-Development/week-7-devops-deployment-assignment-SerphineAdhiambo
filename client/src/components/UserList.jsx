"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import api from "../utils/api"
import "./UserList.css"

const UserList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get("/users")
      setUsers(response.data.users)
    } catch (error) {
      setError(error.response?.data?.error || "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }

    try {
      await api.delete(`/users/${userId}`)
      setUsers(users.filter((u) => u._id !== userId))
    } catch (error) {
      setError(error.response?.data?.error || "Failed to delete user")
    }
  }

  if (loading) {
    return (
      <div className="loading" data-testid="loading">
        Loading users...
      </div>
    )
  }

  if (error) {
    return (
      <div className="error" data-testid="error">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="user-list-container">
      <h2>Users ({users.length})</h2>

      {users.length === 0 ? (
        <div data-testid="no-users">No users found</div>
      ) : (
        <div className="user-grid" data-testid="user-list">
          {users.map((userItem) => (
            <div key={userItem._id} className="user-card" data-testid={`user-item-${userItem._id}`}>
              <div className="user-info">
                <h3>{userItem.name}</h3>
                <p>{userItem.email}</p>
                <p className="user-role">{userItem.role}</p>
                <p className="user-date">Joined: {new Date(userItem.createdAt).toLocaleDateString()}</p>
              </div>

              {user?.role === "admin" && userItem._id !== user._id && (
                <div className="user-actions">
                  <button
                    onClick={() => handleDeleteUser(userItem._id)}
                    className="btn btn-danger"
                    data-testid={`delete-user-${userItem._id}`}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserList
