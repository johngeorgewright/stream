import { takeWhile } from '../utils/Iterable.js'
import { TimelineError, parseTimelineValue } from '../utils/Timeline.js'

/**
 * Calls an expectation function to compare a timeline against chunks.
 *
 * @see [timeline docs](/stream/extensions/timelines)
 * @see {@link fromTimeline:function}
 * @group Sinks
 * @example
 * ```
 * fromTimeline(`
 *   --1--2--3--4--
 * `)
 *   .pipeTo(expectTimeline(
 *     `
 *   --1--2--3--4--
 *     `,
 *     (expectation, chunk) =>
 *       expect(chunk).toBe(expectation)
 *   ))
 * ```
 */
export function expectTimeline(
  timeline: string,
  testExcpectation: (timelineValue: unknown, chunk: unknown) => void,
  queuingStrategy?: QueuingStrategy<unknown>
) {
  const iterator = generate(timeline.trim())

  return new WritableStream<unknown>(
    {
      close() {
        const todo = [...iterator]
        if (todo.length)
          throw new TimelineError(
            `There are more expectations left.\n${JSON.stringify(
              todo,
              null,
              2
            )}`
          )
      },

      write(chunk, controller) {
        const { done, value } = iterator.next()

        if (done)
          controller.error(
            new TimelineError(
              `Received more values than expected (at "${chunk}")`
            )
          )
        else if (value instanceof Error) controller.error(value)
        else testExcpectation(value, chunk)
      },
    },
    queuingStrategy
  )
}

function* generate(timeline: string): Generator<unknown> {
  const str = timeline.replace(/^-+/, '')
  if (!str.length) return
  const unparsed = [...takeWhile(str, (x) => x !== '-')]
  yield parseTimelineValue(unparsed.join(''))
  yield* generate(str.slice(unparsed.length))
}
