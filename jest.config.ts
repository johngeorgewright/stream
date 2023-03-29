import { Config } from 'jest'

const config: Config = {
  moduleNameMapper: {
    '^(.+)\\.js$': ['$1.js', '$1.ts'],
  },
  setupFilesAfterEnv: [
    '<rootDir>/test/polyfill.ts',
    '<rootDir>/src/jest/extend.ts',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
}

export default config
