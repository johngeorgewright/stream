import { Config } from 'jest'

const config: Config = {
  moduleNameMapper: {
    '^(.+)\\.js$': ['$1.js', '$1.ts'],
  },
  setupFilesAfterEnv: [
    require.resolve('@johngw/stream-test/polyfill'),
    require.resolve('@johngw/stream-jest'),
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
}

export default config
