/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/stories'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'jest-transform-css'
  },
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/stories/editor/',
    '<rootDir>/stories/link/',
    'utils.ts',
    'testingUtils.ts'
  ]
};
