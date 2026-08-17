import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  testMatch: ['**/tests/**/*.spec.ts'],

  clearMocks: true,
  verbose: true,

  reporters: ['default'],

  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts'
  ],

  coverageDirectory: 'coverage',

  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov'
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};

export default config;
