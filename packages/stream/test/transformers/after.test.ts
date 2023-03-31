import { after, fromTimeline } from '../../src/index.js'

test('prevents chunks until predicate', async () => {
  await expect(
    fromTimeline<number>(`
    -0-1-2-3-4-5-6-1-2-3-4-|
    `).pipeThrough(after((x) => x > 4))
  ).toMatchTimeline(`
    -----------5-6-1-2-3-4-
  `)
})
