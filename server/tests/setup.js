const { MongoMemoryServer } = require("mongodb-memory-server")
const mongoose = require("mongoose")

let mongoServer

// Setup test database before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const mongoUri = mongoServer.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
})

// Cleanup after all tests
afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

// Clear database before each test
beforeEach(async () => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany({})
  }
})

// Set test environment variables
process.env.NODE_ENV = "test"
process.env.JWT_SECRET = "test-secret-key"
process.env.MONGODB_URI = "mongodb://localhost:27017/test"
