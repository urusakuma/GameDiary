module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/!(__mocks__)/**/?(*.)+(test).ts'],
  testPathIgnorePatterns: ['/node_modules/', '/old_data/'],
  roots: ['<rootDir>/src/features'],
  moduleNameMapper: {
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
  },
  setupFiles: ['<rootDir>/node_modules/reflect-metadata'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};
