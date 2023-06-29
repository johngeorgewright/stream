import { Config } from 'jest'

const config: Config = {
  // moduleNameMapper: {
  //   '^(.+)\\.js$': ['$1.js', '$1.ts', '$1.cjs', '$1.cts'],
  // },
  setupFilesAfterEnv: [require.resolve('@johngw/stream-test/polyfill')],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/test/tsconfig.json' }],
  },
}

export default config
