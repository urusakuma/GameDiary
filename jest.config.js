module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/old_data/'],
  roots: ['<rootDir>/game-diary/src/app'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/game-diary/src/app/$1',
  },
  setupFiles: ['<rootDir>/game-diary/node_modules/reflect-metadata'],
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/game-diary/tsconfig.json',
    },
  },
};
