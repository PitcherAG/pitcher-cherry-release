module.exports = {
  // preset: '@vue/cli-plugin-unit-jest',
  testMatch: ['**/?(*.)+(spec|test).js'],
  moduleFileExtensions: ['js'],

  moduleNameMapper: {
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '/^@/(.*)$/': '<rootDic>/src/$1',
  },
  setupFilesAfterEnv: ['./tests/helpers/setup.js'],
  // collectCoverageFrom: ['src/**/*.{js}'],
  // coverageReporters: ['text', 'text-summary'],
}
