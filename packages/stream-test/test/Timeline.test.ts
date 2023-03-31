import { asyncIterableToArray } from '@johngw/stream-common'
import {
  CloseTimeline,
  NeverReachTimelineError,
  TimelineError,
  TimelineTimer,
  parseTimelineValues,
} from '../src/index.js'

test('parseTimelineValues', async () => {
  expect(
    await asyncIterableToArray(
      parseTimelineValues(
        '--1--{foo: bar}--[a,b]--true--E--E(err foo)--T10--X-|'
      )
    )
  ).toStrictEqual([
    1,
    { foo: 'bar' },
    ['a', 'b'],
    true,
    new TimelineError(),
    new TimelineError('err foo'),
    expect.any(TimelineTimer),
    new NeverReachTimelineError(),
    CloseTimeline,
  ])
})
