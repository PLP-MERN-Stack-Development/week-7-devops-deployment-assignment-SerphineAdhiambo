import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ErrorBoundary from "@/components/ErrorBoundary"

export default function HomePage() {
  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">MERN Testing Suite</h1>
            <p className="text-xl text-gray-600 mb-8">Comprehensive testing environment for MERN stack applications</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Unit Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Jest and React Testing Library for component and utility testing
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Component isolation testing</li>
                  <li>• Utility function validation</li>
                  <li>• Mock implementations</li>
                  <li>• Code coverage reporting</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">API endpoint testing with Supertest and test database</p>
                <ul className="text-sm space-y-1">
                  <li>• API route testing</li>
                  <li>• Database operations</li>
                  <li>• Authentication flows</li>
                  <li>• Data validation</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>E2E Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Cypress for complete user flow testing</p>
                <ul className="text-sm space-y-1">
                  <li>• User journey testing</li>
                  <li>• Cross-browser compatibility</li>
                  <li>• Visual regression testing</li>
                  <li>• Error handling validation</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-semibold mb-6">Test Commands</h2>

            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <Card>
                <CardContent className="p-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">npm run test</code>
                  <p className="text-xs text-gray-600 mt-2">Run all unit tests</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">npm run test:coverage</code>
                  <p className="text-xs text-gray-600 mt-2">Run tests with coverage</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">npm run test:integration</code>
                  <p className="text-xs text-gray-600 mt-2">Run integration tests</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">npm run test:e2e</code>
                  <p className="text-xs text-gray-600 mt-2">Run E2E tests</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <Link href="/demo">
                <Button size="lg">View Demo Components</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
