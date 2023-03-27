import { timeout } from './Async.js'
import { takeWhile } from './Iterable.js'

/**
 * Base TimelineError.
 *
 * @group Utils
 * @category Timeline
 */
export class TimelineError extends Error {}

/**
 * An error to represent that the stream requires closing.
 *
 * @group Utils
 * @category Timeline
 */
export class CloseTimelineError extends TimelineError {
  constructor() {
    super('The stream will now close')
  }
}

/**
 * An error to represent that the stream requires terminating.
 *
 * @group Utils
 * @category Timeline
 */
export class TerminateTimelineError extends TimelineError {
  constructor() {
    super('The stream was expected to have closed by now')
  }
}

/**
 * Iterates over a timeline, pausing on dashes and yielding
 * values.
 *
 * @group Utils
 * @category Timeline
 */
export async function* parseTimelineValues(
  timeline: string
): AsyncGenerator<unknown> {
  timeline = await timeBits(timeline.trim())
  if (!timeline.length) return
  const unparsed = [...takeWhile(timeline, (x) => x !== '-')]
  yield parseTimelineValue(unparsed.join(''))
  yield* parseTimelineValues(timeline.slice(unparsed.length))
}

async function timeBits(timeline: string): Promise<string> {
  let size = 0
  for (const _ of takeWhile(timeline, (x) => x === '-')) {
    size++
    await timeout(1)
  }
  return timeline.slice(size)
}

/**
 * Parses a single timeline value. Used when creating/parsing
 * streams with timelines.
 *
 * @see [timeline docs](/stream/extensions/timelines)
 * @see {@link fromTimeline:function}
 * @see {@link expectTimeline:function}
 * @group Utils
 * @category Timeline
 */
function parseTimelineValue(value: string): unknown {
  value = value.trim()

  switch (true) {
    case /^\d+(\.\d+)?$/.test(value):
      return Number(value)

    case value === 'true':
      return true

    case value === 'false':
      return false

    case value === 'null':
      return null

    case value === 'E':
      return new TimelineError()

    case value === '|':
      return new CloseTimelineError()

    case value === 'X':
      return new TerminateTimelineError()

    case /^\{.*\}$/.test(value):
      return value
        .slice(1, -1)
        .split(/\s*,\s*/g)
        .reduce((acc, x) => {
          const [key, value] = x.split(/\s*:\s*/g)
          return { ...acc, [key.trim()]: parseTimelineValue(value) }
        }, {})

    case /^\[.*\]$/.test(value):
      return value.slice(1, -1).split(',').map(parseTimelineValue)

    default:
      return value
  }
}
