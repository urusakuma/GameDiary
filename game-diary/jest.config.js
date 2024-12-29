module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testMatch: ['**/!(__mocks__)/**/?(*.)+(test).ts'],
  testPathIgnorePatterns: ['/node_modules/', '/old_data/'],
  roots: ['<rootDir>/src/app'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/app/$1',
  },
  setupFiles: ['<rootDir>/node_modules/reflect-metadata'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
};
