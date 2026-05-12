const path = require('path');
const backendNodeModules = path.resolve(__dirname, 'src/backend/node_modules');

/** @type {import('jest').Config} */
module.exports = {
  projects: [
    // ── Frontend tests (jsdom, React, UI_prototype) ──────────────────────────
    {
      displayName: 'frontend',
      testEnvironment: 'jsdom',
      roots: ['<rootDir>/tests/frontend'],
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
      setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
      testMatch: [
        '**/tests/frontend/**/*.test.ts',
        '**/tests/frontend/**/*.test.tsx',
      ],
      collectCoverageFrom: [
        '<rootDir>/UI_prototype/src/**/*.{ts,tsx}',
        '!<rootDir>/UI_prototype/src/main.tsx',
        '!**/*.d.ts',
      ],
      coverageThreshold: {
        global: { branches: 60, functions: 40, lines: 60, statements: 60 },
      },
    },

    // ── Backend tests (node, NestJS, real services with mocked repos) ─────────
    {
      displayName: 'backend',
      testEnvironment: 'node',
      roots: ['<rootDir>/tests/backend'],
      transform: {
        '^.+\\.ts$': ['ts-jest', {
          tsconfig: '<rootDir>/tsconfig.backend-tests.json',
          diagnostics: false,
        }],
      },
      moduleFileExtensions: ['ts', 'js', 'json'],
      // modulePaths accepts absolute paths (equivalent to NODE_PATH), unlike moduleDirectories
      modulePaths: [backendNodeModules],
      setupFiles: ['<rootDir>/tests/backend/jest.setup.ts'],
      testMatch: ['**/tests/backend/**/*.test.ts'],
    },
  ],
};
