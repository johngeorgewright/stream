import { fromTimeline } from '@johngw/stream-test'
import { map } from '../../src/index.js'

test('transforms values', async () => {
  await expect(
    fromTimeline<number>(`
    -0-1-2-3-4-5-6-7-8-9--|
    `).pipeThrough(map((chunk) => chunk + 1))
  ).toMatchTimeline(`
    -1-2-3-4-5-6-7-8-9-10-|
  `)
})
