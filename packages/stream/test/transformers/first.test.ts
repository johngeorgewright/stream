import { fromTimeline } from '@johngw/stream-jest'
import { first } from '@johngw/stream/transformers/first'

test('gets only the first chunk', async () => {
  await expect(
    fromTimeline(`
    -1-X
    `).pipeThrough(first())
  ).toMatchTimeline(`
    -1-X
  `)
})
