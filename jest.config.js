/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        module: 'commonjs',
        target: 'ES2020',
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        esModuleInterop: true,
        strict: true,
        skipLibCheck: true,
        moduleResolution: 'node',
      },
    }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/UI_prototype/src/$1',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterSetup: ['<rootDir>/tests/setup.ts'],
  collectCoverageFrom: [
    'UI_prototype/src/**/*.{ts,tsx}',
    '!UI_prototype/src/main.tsx',
    '!**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.test.tsx',
    '**/tests/**/*.spec.ts',
    '**/tests/**/*.spec.tsx',
  ],
};

