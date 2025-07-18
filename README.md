# MERN Stack Testing Suite

A comprehensive testing environment for MERN (MongoDB, Express.js, React, Node.js) stack applications.

## Features

### 🧪 Testing Framework
- **Jest** - JavaScript testing framework
- **React Testing Library** - React component testing
- **Supertest** - HTTP assertion library
- **Cypress** - End-to-end testing
- **MongoDB Memory Server** - In-memory database for testing

### 🔧 Testing Types
- **Unit Testing** - Individual component and function testing
- **Integration Testing** - API endpoints and database operations
- **End-to-End Testing** - Complete user workflows
- **Component Testing** - React component behavior

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd mern-testing
\`\`\`

2. Install all dependencies
\`\`\`bash
npm run install:all
\`\`\`

3. Set up environment variables
\`\`\`bash
# Create server/.env
cd server
cp .env.example .env
\`\`\`

4. Start the development servers
\`\`\`bash
# From root directory
npm run dev
\`\`\`

This will start:
- React client on http://localhost:3000
- Express server on http://localhost:5000

## Testing Commands

### All Tests
\`\`\`bash
# Run all tests (client + server)
npm test

# Run tests with coverage
npm run test:coverage

# Run complete test suite including E2E
npm run test:all
\`\`\`

### Client Tests
\`\`\`bash
# Run client tests
npm run client:test

# Run client tests in watch mode
cd client && npm test
\`\`\`

### Server Tests
\`\`\`bash
# Run server tests
npm run server:test

# Run server tests in watch mode
cd server && npm run test:watch
\`\`\`

### End-to-End Tests
\`\`\`bash
# Open Cypress test runner
npm run test:e2e

# Run E2E tests headlessly
npm run test:e2e:headless
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Users
- `GET /api/users` - Get all users (protected)
- `GET /api/users/:id` - Get user by ID (protected)
- `PUT /api/users/:id` - Update user (protected)
- `DELETE /api/users/:id` - Delete user (admin only)

## Environment Variables

### Server (.env)
\`\`\`
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mern-testing
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000
\`\`\`

### Client (.env)
\`\`\`
REACT_APP_API_URL=http://localhost:5000/api
\`\`\`

## Testing Strategies

### Unit Testing
- **Components**: Rendering, props, user interactions
- **Utilities**: Function inputs/outputs, edge cases
- **Controllers**: Business logic, error handling
- **Models**: Data validation, methods

### Integration Testing
- **API Endpoints**: Request/response cycles
- **Database Operations**: CRUD operations
- **Authentication**: Login/logout flows
- **Component Integration**: API interactions

### End-to-End Testing
- **User Flows**: Registration, login, navigation
- **Error Handling**: Network failures, validation
- **Cross-browser**: Compatibility testing
- **Visual Testing**: UI consistency

## Development Workflow

1. **Start Development**
   \`\`\`bash
   npm run dev
   \`\`\`

2. **Run Tests During Development**
   \`\`\`bash
   # Terminal 1: Run client tests in watch mode
   cd client && npm test

   # Terminal 2: Run server tests in watch mode
   cd server && npm run test:watch
   \`\`\`

3. **Before Committing**
   \`\`\`bash
   npm run test:all
   \`\`\`

## Debugging

### Client-Side
- React Developer Tools
- Browser DevTools
- Error boundaries for graceful error handling

### Server-Side
- Structured logging with different levels
- Error handling middleware
- Request/response logging

### Testing
- Jest debugging with `--verbose` flag
- Cypress debugging with browser DevTools
- Test isolation and cleanup

## Contributing

1. Write tests for new features
2. Maintain code coverage above 70%
3. Follow existing code patterns
4. Update documentation

## Troubleshooting

### Common Issues

**Port conflicts**
- Change ports in package.json scripts
- Check if ports 3000/5000 are available

**Database connection**
- Ensure MongoDB is running
- Check connection string in .env

**Test failures**
- Clear test database between runs
- Check for async/await issues
- Verify mock implementations

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both client and server |
| `npm run build` | Build both applications |
| `npm test` | Run all tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Open Cypress test runner |
| `npm run install:all` | Install all dependencies |

## License

MIT License - see LICENSE file for details
