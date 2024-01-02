import { assertTimeline, fromTimeline } from '@johngw/stream-assert'

test('toMatchTimeline', async () => {
  await assertTimeline(
    fromTimeline(`
    --1--2--3--4--|
    `),
    `
    --1--2--3--4--
    `
  )
})
