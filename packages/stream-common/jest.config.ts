import { Config } from 'jest'

const config: Config = {
  setupFilesAfterEnv: ['<rootDir>/test/polyfill.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/test/tsconfig.json' }],
  },
}

export default config
