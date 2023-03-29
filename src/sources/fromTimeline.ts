import {
  CloseTimelineError,
  TimelineTimer,
  parseTimelineValues,
} from '../utils/Timeline.js'

/**
 * Creates a ReadableStream from a "timeline".
 *
 * @see [timeline docs](/stream/extensions/timelines)
 * @see {@link expectTimeline:function}
 * @group Sources
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
export function fromTimeline<T>(
  timeline: string,
  queuingStrategy?: QueuingStrategy<T>
) {
  const iterator = parseTimelineValues(timeline)

  return new ReadableStream<T>(
    {
      async pull(controller) {
        while (controller.desiredSize) {
          const { done, value } = await iterator.next()

          if (done) controller.close()
          else if (value instanceof CloseTimelineError) controller.close()
          else if (value instanceof Error) controller.error(value)
          else if (value instanceof TimelineTimer) await value.promise
          else controller.enqueue(value as T)
        }
      },
    },
    queuingStrategy
  )
}
