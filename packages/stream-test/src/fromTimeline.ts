import { assertNever } from 'assert-never'
import { Timeline } from './Timeline.js'
import { TimelineItemValue } from './TimelineItem/TimelineItemValue.js'
import { TimelineItemClose } from './TimelineItem/TimelineItemClose.js'
import { TimelineItemError } from './TimelineItem/TimelineItemError.js'
import { TimelineItemTimer } from './TimelineItem/TimelineItemTimer.js'
import { TimelineItemDefault } from './TimelineItem/TimelineItemDefault.js'
import { TimelineItemDash } from './TimelineItem/TimelineItemDash.js'
import { TimelineItemBoolean } from './TimelineItem/TimelineItemBoolean.js'
import { TimelineItemNeverReach } from './TimelineItem/TimelineItemNeverReach.js'
import { TimelineItemNull } from './TimelineItem/TimelineItemNull.js'

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
export function fromTimeline<T extends TimelineItemValue>(
  timelineString: string,
  queuingStrategy?: QueuingStrategy<T>
) {
  const timeline = new Timeline(timelineString)

  return new ReadableStream<T>(
    {
      async pull(controller) {
        const { done, value } = await timeline.next()

        if (done) {
          return
        } else if (value instanceof TimelineItemDash) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return this.pull!(controller)
        } else if (value instanceof TimelineItemClose) {
          return controller.close()
        } else if (
          value instanceof TimelineItemError ||
          value instanceof TimelineItemNeverReach
        ) {
          return controller.error(value.get())
        } else if (value instanceof TimelineItemTimer) {
          await value.get().promise
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return this.pull!(controller)
        } else if (
          value instanceof TimelineItemDefault ||
          value instanceof TimelineItemBoolean ||
          value instanceof TimelineItemNull
        ) {
          return controller.enqueue(value.get() as T)
        } else {
          assertNever(value)
        }
      },
    },
    queuingStrategy
  )
}
