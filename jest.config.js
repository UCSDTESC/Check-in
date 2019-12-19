const tsPreset = require('ts-jest/jest-preset');
const mongoPreset = require('@shelf/jest-mongodb/jest-preset');

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
  globalSetup: '<rootDir>/node_modules/@shelf/jest-mongodb/setup.js',
  globalTeardown: '<rootDir>/node_modules/@shelf/jest-mongodb/teardown.js',
  testEnvironment: '<rootDir>/node_modules/@shelf/jest-mongodb/environment.js',
  testMatch: ['<rootDir>/src/**/tests/api/*.ts'],
}