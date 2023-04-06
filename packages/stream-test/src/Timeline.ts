import yaml from 'js-yaml'
import { defer, timeout } from '@johngw/stream-common/Async'
import { takeCharsWhile } from '@johngw/stream-common/String'

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
 * A symbol to represent that the stream requires closing.
 *
 * @group Utils
 * @category Timeline
 */
export const CloseTimeline = Symbol('close timeline')

/**
 * An error to represent that the stream requires terminating.
 *
 * @group Utils
 * @category Timeline
 */
export class NeverReachTimelineError extends TimelineError {
  constructor() {
    super('The stream was expected to have closed by now')
  }
}

/**
 * Represents a timer in a timeline.
 *
 * @group Utils
 * @category Timeline
 */
export class TimelineTimer {
  #finished = false
  readonly #start = Date.now()
  readonly #end: number
  readonly #ms: number
  readonly #promise: Promise<void>

  constructor(ms: number) {
    this.#ms = ms
    this.#end = this.#start + ms
    const { promise, resolve } = defer()
    this.#promise = promise
    setTimeout(() => {
      this.#finished = true
      resolve()
    }, ms)
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

/**
 * Values that can be added in a timeline.
 *
 * @group Utils
 * @category Timeline
 */
export type TimelineValue = ValueOrArrayOrObject<
  | number
  | boolean
  | string
  | null
  | TimelineTimer
  | TimelineError
  | typeof CloseTimeline
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
 * @see [timeline docs](/stream/timelines)
 * @see {@link fromTimeline:function}
 * @see {@link expectTimeline:function}
 * @group Utils
 * @category Timeline
 * @example
 * ```
 * parseTimelineValues('-1-2-[{ foo: bar }]-|')
 * ```
 *
 * The above will do the following:
 * 1. wait for 1ms
 * 2. yield `1`
 * 3. wait for 1ms
 * 4. yield `2`
 * 5. wait for 1ms
 * 6. yield `[{ foo: 'bar' }]`
 * 7. wait for 1ms
 * 8. yield the `CloseTimeline` symbol
 */
export async function* parseTimelineValues(
  timeline: string
): AsyncGenerator<TimelineValue> {
  timeline = await timeBits(timeline.trim())
  if (!timeline.length) return
  const unparsed = takeCharsWhile(timeline, (x) => x !== '-')
  yield parseTimelineValue(unparsed)
  yield* parseTimelineValues(timeline.slice(unparsed.length))
}

async function timeBits(timeline: string): Promise<string> {
  let size = 0
  for (const _ of takeCharsWhile(timeline, (x) => x === '-')) {
    size++
    await timeout(1)
  }
  return timeline.slice(size)
}

function parseTimelineValue(value: string): TimelineValue {
  value = value.trim()

  switch (true) {
    case /^T\d+$/.test(value):
      return new TimelineTimer(Number(value.slice(1)))

    case /^E(\([^)]*\))?$/.test(value):
      return new TimelineError(
        value.length > 1 ? value.slice(2, -1) : undefined
      )

    case value === 'T':
      return true

    case value === 'F':
      return false

    case value === 'N':
      return null

    case value === '|':
      return CloseTimeline

    case value === 'X':
      return new NeverReachTimelineError()

    default:
      return yaml.load(value) as TimelineValue
  }
}
