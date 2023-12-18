import { fromTimeline } from '@johngw/stream-jest'
import { sampleTime } from '@johngw/stream/transformers/sampleTime'

test('produces samples of the last state sent', async () => {
  await expect(
    fromTimeline(`
    --{foo: bar}--------------{foo: rab}-T10-|
    `).pipeThrough(sampleTime(20))
  ).toMatchTimeline(`
    --{foo: bar}--{foo: bar}--{foo: rab}-
  `)
})
