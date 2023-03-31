import { fromTimeline } from '@johngw/stream-test'
import '../src/index.js'

test('toMatchTimeline', async () => {
  await expect(
    fromTimeline(`
    --1--2--3--4--|
    `)
  ).toMatchTimeline(`
    --1--2--3--4--
  `)
})
