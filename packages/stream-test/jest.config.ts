import { Config } from 'jest'

const config: Config = {
  moduleNameMapper: {
    '^(.+)\\.js$': ['$1.js', '$1.ts'],
  },
  setupFilesAfterEnv: ['<rootDir>/src/polyfill.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
}

export default config
