import { takeWhile } from '../utils/Iterable.js'
import { timeout } from '../utils/Async.js'
import {
  CloseTimelineError,
  TerminateTimelineError,
  parseTimelineValue,
} from '../utils/Timeline.js'

/**
 * Creates a ReadableStream from a "timeline".
 *
 * @example
 * ```
 * fromTimeline('--1--2--3--4--')
 *   .pipeTo(write(console.info))
 * // 1
 * // 2
 * // 3
 * // 4
 * ```
 *
 * Each dash is considered a timeout of 1ms.
 *
 * ```
 * merge([
 *   fromTimeline('--1---2---3---4--'),
 *   fromTimeline('----a---b---c----'),
 * ])
 *   .pipeTo(write(console.info))
 * // 1
 * // a
 * // 2
 * // b
 * // 3
 * // c
 * // 4
 * ```
 */
export function fromTimeline(
  timeline: string,
  queuingStrategy?: QueuingStrategy<unknown>
) {
  const iterator = generate(timeline.trim())

  return new ReadableStream(
    {
      async pull(controller) {
        while (controller.desiredSize) {
          const { done, value } = await iterator.next()

          if (done) controller.close()
          else if (value instanceof CloseTimelineError) controller.close()
          else if (value instanceof TerminateTimelineError)
            controller.error(TerminateTimelineError)
          else if (value instanceof Error) controller.error(value)
          else controller.enqueue(value)
        }
      },
    },
    queuingStrategy
  )
}

async function* generate(timeline: string): AsyncGenerator<unknown> {
  timeline = await timeBits(timeline)
  if (!timeline.length) return
  const unparsed = [...takeWhile(timeline, (x) => x !== '-')]
  yield parseTimelineValue(unparsed.join(''))
  yield* generate(timeline.slice(unparsed.length))
}

async function timeBits(timeline: string): Promise<string> {
  let size = 0
  for (const _ of takeWhile(timeline, (x) => x === '-')) {
    size++
    await timeout(1)
  }
  return timeline.slice(size)
}
