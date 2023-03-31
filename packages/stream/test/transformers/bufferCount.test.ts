import { bufferCount, fromTimeline } from '../../src/index.js'

test('bufferCount in 2s', async () => {
  await expect(
    fromTimeline(`
    -1-2---3-4---5-6---7-8-----|
    `).pipeThrough(bufferCount(2))
  ).toMatchTimeline(`
    ---[1,2]-[3,4]-[5,6]-[7,8]-
  `)
})

test('queues whatever remains after stream has closed', async () => {
  await expect(
    fromTimeline(`
    -1-2-3-4-5-------6-7-8-|
    `).pipeThrough(bufferCount(5))
  ).toMatchTimeline(`
    ---------[1,2,3,4,5]---[6,7,8]-
  `)
})
