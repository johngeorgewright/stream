import { first, fromTimeline } from '../../src/index.js'
import '../../src/jest/extend.js'

test('gets only the first chunk', async () => {
  await expect(
    fromTimeline(`
    -1-X
    `).pipeThrough(first())
  ).toMatchTimeline(`
    -1-X
  `)
})
