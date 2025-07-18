const { MongoMemoryServer } = require("mongodb-memory-server")
const mongoose = require("mongoose")

let mongoServer

async function setupTestDB() {
  try {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()

    await mongoose.connect(mongoUri)
    console.log("✅ Test database connected")

    return mongoUri
  } catch (error) {
    console.error("❌ Test database setup failed:", error)
    process.exit(1)
  }
}

async function teardownTestDB() {
  try {
    await mongoose.disconnect()
    await mongoServer?.stop()
    console.log("✅ Test database disconnected")
  } catch (error) {
    console.error("❌ Test database teardown failed:", error)
  }
}

async function seedTestData() {
  const User = require("../lib/models/User").default

  const testUsers = [
    {
      email: "admin@test.com",
      password: "AdminPass123",
      name: "Admin User",
    },
    {
      email: "user@test.com",
      password: "UserPass123",
      name: "Regular User",
    },
  ]

  try {
    await User.deleteMany({})

    for (const userData of testUsers) {
      const user = new User(userData)
      await user.save()
    }

    console.log("✅ Test data seeded")
  } catch (error) {
    console.error("❌ Test data seeding failed:", error)
  }
}

module.exports = {
  setupTestDB,
  teardownTestDB,
  seedTestData,
}
