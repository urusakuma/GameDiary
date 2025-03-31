module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/!(__mocks__)/**/?(*.)+(test).ts'],
  testPathIgnorePatterns: ['/node_modules/', '/old_data/'],
  roots: ['<rootDir>/src/lib'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/lib/$1',
  },
  setupFiles: ['<rootDir>/node_modules/reflect-metadata'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};
