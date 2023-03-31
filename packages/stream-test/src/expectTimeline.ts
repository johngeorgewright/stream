import { timeout } from '@johngw/stream-common/Async'
import { asyncIterableToArray } from '@johngw/stream-common/Iterable'
import {
  CloseTimeline,
  NeverReachTimelineError,
  TimelineError,
  TimelineTimer,
  TimelineValue,
  parseTimelineValues,
} from './Timeline.js'

/**
 * Calls an expectation function to compare a timeline against chunks.
 *
 * @see [timeline docs](/stream/timelines)
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
export function expectTimeline<T extends TimelineValue>(
  timeline: string,
  testExcpectation: (
    timelineValue: unknown,
    chunk: unknown
  ) => void | Promise<void>,
  queuingStrategy?: QueuingStrategy<unknown>
) {
  const iterator = parseTimelineValues(timeline)
  let nextResult: Promise<IteratorResult<unknown>>

  return new WritableStream<T>(
    {
      start(controller) {
        next(controller)
      },

      async close() {
        const { done, value } = await nextResult
        const todo = done
          ? []
          : [value, ...(await asyncIterableToArray(iterator))].filter(
              (value) =>
                !(value === CloseTimeline) &&
                !(value instanceof NeverReachTimelineError) &&
                !(value instanceof TimelineTimer && value.finished)
            )
        if (todo.length)
          throw new TimelineError(
            `There are ${todo.length} more expectations left.\n- ${todo
              .map((value) => JSON.stringify(value, null, 2))
              .join('\n- ')}`
          )
      },

      async write(chunk, controller) {
        const { done, value } = await nextResult

        if (done)
          controller.error(
            new TimelineError(
              `Received a value after the expected timeline:\n${JSON.stringify(
                chunk,
                null,
                2
              )}`
            )
          )
        else if (value instanceof Error) controller.error(value)
        else if (value === CloseTimeline)
          controller.error(
            new TimelineError(
              'The writer received a signal to close the stream'
            )
          )
        else if (value instanceof TimelineTimer) {
          await timeout()
          if (!value.finished)
            controller.error(
              new TimelineError(
                `Expected ${value.ms}ms timer to have finished. There is ${value.timeLeft}ms left.`
              )
            )
          next(controller)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return this.write!(chunk, controller)
        } else await testExcpectation(value, chunk)

        next(controller)
      },
    },
    queuingStrategy
  )

  function next(controller: WritableStreamDefaultController) {
    nextResult = iterator.next().then((result) => {
      if (result.value instanceof TimelineError) controller.error(result.value)
      return result
    })
  }
}
