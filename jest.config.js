module.exports = {
  projects: [
    {
      displayName: "client",
      testMatch: ["<rootDir>/client/src/tests/**/*.test.{js,jsx}"],
      testEnvironment: "jsdom",
      setupFilesAfterEnv: ["<rootDir>/client/src/setupTests.js"],
      moduleNameMapping: {
        "^@/(.*)$": "<rootDir>/client/src/$1",
      },
    },
    {
      displayName: "server",
      testMatch: ["<rootDir>/server/tests/**/*.test.js"],
      testEnvironment: "node",
      setupFilesAfterEnv: ["<rootDir>/server/tests/setup.js"],
    },
  ],
  collectCoverageFrom: [
    "client/src/**/*.{js,jsx}",
    "server/src/**/*.js",
    "!**/node_modules/**",
    "!**/build/**",
    "!**/coverage/**",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}
