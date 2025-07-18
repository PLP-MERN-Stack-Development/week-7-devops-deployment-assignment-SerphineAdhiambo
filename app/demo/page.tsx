"use client"

import { useState } from "react"
import LoginForm from "@/components/LoginForm"
import UserList from "@/components/UserList"
import ErrorBoundary from "@/components/ErrorBoundary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function DemoPage() {
  const [loginResult, setLoginResult] = useState<string>("")
  const [registerResult, setRegisterResult] = useState<string>("")

  const handleRegister = async (data: { email: string; password: string; name: string }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setRegisterResult(`Registration successful! Welcome ${result.user.name}`)
      } else {
        throw new Error(result.error || "Registration failed")
      }
    } catch (error: any) {
      setRegisterResult(`Registration failed: ${error.message}`)
      throw error
    }
  }

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setLoginResult(`Login successful! Welcome ${result.user.name}`)
      } else {
        throw new Error(result.error)
      }
    } catch (error: any) {
      setLoginResult(`Login failed: ${error.message}`)
      throw error
    }
  }

  const handleDeleteUser = async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error)
    }
  }

  const handleEditUser = (user: any) => {
    console.log("Edit user:", user)
    alert(`Edit user: ${user.name}`)
  }

  const seedTestData = async () => {
    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      })

      const result = await response.json()

      if (response.ok) {
        alert(`Test data seeded! Created ${result.users.length} users`)
      } else {
        alert(`Seed failed: ${result.error}`)
      }
    } catch (error: any) {
      alert(`Seed failed: ${error.message}`)
    }
  }

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Demo Components</h1>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="login">Login Form</TabsTrigger>
              <TabsTrigger value="users">User List</TabsTrigger>
              <TabsTrigger value="testing">Testing Info</TabsTrigger>
              <TabsTrigger value="setup">Setup</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Login Form Component</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <LoginForm onSubmit={handleLogin} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Test Credentials:</h3>
                      <div className="text-sm space-y-2">
                        <div>
                          <strong>Email:</strong> test@example.com
                          <br />
                          <strong>Password:</strong> TestPass123
                        </div>
                      </div>
                      {loginResult && (
                        <div className="mt-4 p-3 bg-gray-100 rounded">
                          <strong>Result:</strong> {loginResult}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User List Component</CardTitle>
                </CardHeader>
                <CardContent>
                  <UserList onDelete={handleDeleteUser} onEdit={handleEditUser} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Testing Coverage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Unit Tests</h3>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• LoginForm component rendering and interactions</li>
                        <li>• UserList component with mocked API calls</li>
                        <li>• Validation utility functions</li>
                        <li>• Error boundary functionality</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Integration Tests</h3>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• API authentication endpoints</li>
                        <li>• User CRUD operations</li>
                        <li>• Database operations with test DB</li>
                        <li>• Complete user registration flow</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">E2E Tests</h3>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Complete user registration and login flows</li>
                        <li>• User management interface interactions</li>
                        <li>• Form validation and error handling</li>
                        <li>• Cross-browser compatibility testing</li>
                        <li>• Visual regression testing</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Debugging Tools</h3>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• Error boundaries for React components</li>
                        <li>• Comprehensive logging system</li>
                        <li>• Performance monitoring utilities</li>
                        <li>• Development vs production error handling</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="setup" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Development Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Seed Test Data</h3>
                    <p className="text-sm text-gray-600 mb-4">Create test users for development and testing</p>
                    <Button onClick={seedTestData}>Seed Test Users</Button>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Test Credentials</h3>
                    <div className="text-sm space-y-2 bg-gray-50 p-3 rounded">
                      <div>
                        <strong>Test User:</strong>
                        <br />
                        Email: test@example.com
                        <br />
                        Password: TestPass123
                      </div>
                      <div>
                        <strong>Admin User:</strong>
                        <br />
                        Email: admin@example.com
                        <br />
                        Password: AdminPass123
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  )
}
