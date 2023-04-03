# @johngw/stream-jest

Jest extension for testing streams.

## Usage

```typescript
// jest.config.ts

import { Config } from 'jest'

const conig: Config = {
  // ...
  setupFilesAfterEnv: [
    require.resolve('@johngw/stream-test/polyfill'),
    require.resolve('@johngw/stream-jest'),
  ],
}
```

```
/* test/tsconfig.json */
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "rootDir": "../",
    "types": ["@types/jest", "@johngw/stream-jest"]
  }
}
```

## API

### `toMatchTimeline()`

```typescript
// test/pairwise.ts

import { fromTimeline, pairwise } from '@johngw/stream'

test('Queues the current value and previous values', async () => {
  await expect(
    fromTimeline(`
    --1--2------3------4------5------|
  `).pipeThrough(pairwise())
  ).toMatchTimeline(`
    -----[1,2]--[2,3]--[3,4]--[4,5]--
  `)
})
```
