import { fromTimeline } from '@johngw/stream-jest'

test('toMatchTimeline', async () => {
  await expect(
    fromTimeline(`
    --1--2--3--4--|
    `)
  ).toMatchTimeline(`
    --1--2--3--4--
  `)
})
