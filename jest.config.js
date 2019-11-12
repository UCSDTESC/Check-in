module.exports = {
  preset: 'ts-jest',
  globals: {
    "ts-jest": {
      "tsConfig": "./src/server/tsconfig.json"
    }
  },
  testEnvironment: "node",
  moduleFileExtensions: [
    'js',
    'ts',
    'json',
    'node'
  ],
  moduleNameMapper: {
    "^@Shared/(.*)": "<rootDir>/src/shared/$1",
    "^@Config/(.*)": "<rootDir>/src/server/config/$1",
    "^@Models/(.*)": "<rootDir>/src/server/models/$1",
    "^@Services/(.*)": "<rootDir>/src/server/services/$1"
  },
  setupFilesAfterEnv: ["<rootDir>/src/server/setupTests.ts"],
  testMatch: ['<rootDir>/src/**/tests/api/*.ts'],
}