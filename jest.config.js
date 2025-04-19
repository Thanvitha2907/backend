// jest.config.js
export default {
  setupFilesAfterEnv: ['./jest.setup.js'],
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.jsx'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/tests/unit/**/*.test.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  // Improved ESM support
  moduleFileExtensions: ['js', 'mjs', 'jsx', 'json', 'node'],
  transformIgnorePatterns: [],
  // Force Jest to use dynamic ESM imports
  testRunner: 'jest-circus/runner',
  // Add this line to ensure Node.js handles ESM properly
  resolver: undefined
};