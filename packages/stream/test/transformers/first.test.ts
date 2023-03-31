import { fromTimeline } from '@johngw/stream-test'
import { first } from '../../src/index.js'

test('gets only the first chunk', async () => {
  await expect(
    fromTimeline(`
    -1-X
    `).pipeThrough(first())
  ).toMatchTimeline(`
    -1-X
  `)
})
