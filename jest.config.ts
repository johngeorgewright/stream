import { Config } from 'jest'

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/test/polyfill.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
}

export default config
