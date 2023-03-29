import { timeout } from './Async.js'
import { takeWhile } from './Iterable.js'

/**
 * Base TimelineError.
 *
 * @group Utils
 * @category Timeline
 */
export class TimelineError extends Error {
  constructor(message?: string) {
    super(message || 'Timeline Error')
  }
}

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

export class TimelineTimer {
  #finished = false
  readonly #start = Date.now()
  readonly #end: number
  readonly #ms: number
  readonly #promise: Promise<void>

  constructor(ms: number) {
    this.#ms = ms
    this.#end = this.#start + ms
    this.#promise = new Promise<void>((resolve) => {
      setTimeout(() => {
        this.#finished = true
        resolve()
      }, ms)
    })
  }

  toJSON() {
    return {
      name: 'TimelineTimer',
      finished: this.#finished,
      ms: this.#ms,
      timeLeft: this.timeLeft,
    }
  }

  get timeLeft() {
    return this.#end - Date.now()
  }

  get finished() {
    return this.#finished
  }

  get promise() {
    return this.#promise
  }

  get ms() {
    return this.#ms
  }
}

export type TimelineValue = ValueOrArrayOrObject<
  number | boolean | string | null | TimelineTimer | TimelineError
>

type ValueOrArrayOrObject<T> =
  | T
  | ValueOrArrayOrObject<T>[]
  | {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: keyof any]: ValueOrArrayOrObject<T>
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
): AsyncGenerator<TimelineValue> {
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
function parseTimelineValue(value: string): TimelineValue {
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

    case /^T\d+$/.test(value):
      return new TimelineTimer(Number(value.slice(1)))

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
