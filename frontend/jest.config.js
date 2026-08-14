/**
 * Jest configuration for the Angular frontend.
 *
 * Kept minimal on purpose (issue #113): only sets up `jest-preset-angular`
 * so we can run unit tests against standalone components / inject() / signals
 * without pulling in Karma. CI runs this via `npm test`.
 */
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['node'],
  },
  testMatch: ['<rootDir>/src/**/*.(spec|test).ts'],
  moduleNameMapper: {
    // Map Angular's @imports of CSS/SCSS to a stub. Loading CSS in JSDOM is meaningless.
    '\\.(css|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(?:@angular|@angular-common|rxjs)/)',
  ],
  collectCoverageFrom: [
    'src/app/**/*.{ts,html}',
    '!src/app/**/*.spec.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
  ],
  coverageReporters: ['text', 'lcov'],
};
