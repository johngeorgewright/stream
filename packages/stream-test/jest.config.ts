import { Config } from 'jest'

const config: Config = {
  moduleNameMapper: {
    '^(.+)\\.js$': ['$1.js', '$1.ts', '$1.cjs', '$1.cts'],
  },
  setupFilesAfterEnv: ['<rootDir>/src/polyfill.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/test/tsconfig.json' }],
  },
}

export default config
