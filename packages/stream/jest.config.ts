import { Config } from 'jest'

const config: Config = {
  setupFilesAfterEnv: [require.resolve('@johngw/stream-test/polyfill')],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/test/tsconfig.json' }],
  },
}

export default config
