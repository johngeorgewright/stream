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
        '--1--{foo: bar}--[a,b]--true--T--false--F--null--N--E--E(err foo)--T10--X-|'
      )
    )
  ).toStrictEqual([
    1,
    { foo: 'bar' },
    ['a', 'b'],
    true,
    true,
    false,
    false,
    null,
    null,
    new TimelineError(),
    new TimelineError('err foo'),
    expect.any(TimelineTimer),
    new NeverReachTimelineError(),
    CloseTimeline,
  ])
})
