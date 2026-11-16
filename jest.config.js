export default {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  clearMocks: true,
  collectCoverageFrom: ['src/controllers/**/*.js', 'src/middleware/**/*.js'],
  coverageThreshold: {
    global: { branches: 45, functions: 55, lines: 60, statements: 60 }
  }
};
