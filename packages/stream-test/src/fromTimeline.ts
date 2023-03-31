import {
  CloseTimeline,
  TimelineTimer,
  TimelineValue,
  parseTimelineValues,
} from './Timeline.js'

/**
 * Creates a ReadableStream from a "timeline".
 *
 * @see [timeline docs](/stream/timelines)
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
export function fromTimeline<T extends TimelineValue>(
  timeline: string,
  queuingStrategy?: QueuingStrategy<T>
) {
  const iterator = parseTimelineValues(timeline)

  return new ReadableStream<T>(
    {
      async pull(controller) {
        const { done, value } = await iterator.next()

        if (done) return
        else if (value === CloseTimeline) controller.close()
        else if (value instanceof Error) controller.error(value)
        else if (value instanceof TimelineTimer) {
          await value.promise
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return this.pull!(controller)
        } else controller.enqueue(value as T)
      },
    },
    queuingStrategy
  )
}
