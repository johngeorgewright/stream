import { fromTimeline } from '@johngw/stream-jest'
import { pairwise } from '@johngw/stream/transformers/pairwise'

test('Queues the current value and previous values', async () => {
  await expect(
    fromTimeline(`
    --1--2------3------4------5------|
  `).pipeThrough(pairwise())
  ).toMatchTimeline(`
    -----[1,2]--[2,3]--[3,4]--[4,5]--
  `)
})
