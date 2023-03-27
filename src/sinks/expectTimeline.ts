import { asyncIterableToArray } from '../utils/Iterable.js'
import { TimelineError, parseTimelineValues } from '../utils/Timeline.js'

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
  const iterator = parseTimelineValues(timeline)

  return new WritableStream<unknown>(
    {
      async close() {
        const todo = await asyncIterableToArray(iterator)
        if (todo.length)
          throw new TimelineError(
            `There are ${todo.length} more expectations left.\n${JSON.stringify(
              todo,
              null,
              2
            )}`
          )
      },

      async write(chunk, controller) {
        const { done, value } = await iterator.next()

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
