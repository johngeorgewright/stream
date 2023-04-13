import { timeout } from '@johngw/stream-common/Async'
import { TimelineItemFactoryResult } from './TimelineItem/TimelineItemFactory.js'
import { Timeline } from './Timeline.js'
import { TimelineItemDash } from './TimelineItem/TimelineItemDash.js'
import { TimelineItemClose } from './TimelineItem/TimelineItemClose.js'
import {
  TimelineError,
  TimelineItemError,
} from './TimelineItem/TimelineItemError.js'
import { TimelineItemNeverReach } from './TimelineItem/TimelineItemNeverReach.js'
import { TimelineItemTimer } from './TimelineItem/TimelineItemTimer.js'
import {
  TimelineItemDefault,
  TimelineItemDefaultValue,
} from './TimelineItem/TimelineItemDefault.js'
import { TimelineItemBoolean } from './TimelineItem/TimelineItemBoolean.js'
import { TimelineItemNull } from './TimelineItem/TimelineItemNull.js'
import { assertNever } from 'assert-never'
import { TimelineItemValue } from './TimelineItem/TimelineItemValue.js'

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
export function expectTimeline<T extends TimelineItemDefaultValue>(
  timelineString: string,
  testExcpectation: (timelineValue: T, chunk: unknown) => void | Promise<void>,
  queuingStrategy?: QueuingStrategy<T>
) {
  const timeline = new Timeline(timelineString)
  let nextResult: Promise<IteratorResult<TimelineItemFactoryResult, undefined>>

  return new WritableStream<T>(
    {
      start(controller) {
        nextResult = next(controller)
      },

      async close() {
        if (timeline.hasMoreItems())
          throw new TimelineExpectedMoreValuesError(await timeline.toTimeline())
      },

      async write(chunk, controller) {
        const { done, value } = await nextResult

        if (done) {
          return controller.error(new TimelineReceivedExtraValueError(chunk))
        } else if (value instanceof TimelineItemDash) {
          //
        } else if (value instanceof TimelineItemClose) {
          return controller.error(new TimelineEarlyCloseError())
        } else if (
          value instanceof TimelineItemError ||
          value instanceof TimelineItemNeverReach
        ) {
          return controller.error(value.get())
        } else if (value instanceof TimelineItemTimer) {
          const timer = value.get()
          await timeout()
          if (!timer.finished)
            controller.error(new TimelineTimerError(timer.ms, timer.timeLeft))
          nextResult = next(controller)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return this.write!(chunk, controller)
        } else if (
          value instanceof TimelineItemDefault ||
          value instanceof TimelineItemBoolean ||
          value instanceof TimelineItemNull
        ) {
          await testExcpectation(value.get() as T, chunk)
        } else {
          assertNever(value)
        }

        nextResult = next(controller)
      },
    },
    queuingStrategy
  )

  async function next(
    controller: WritableStreamDefaultController
  ): Promise<IteratorResult<TimelineItemFactoryResult>> {
    return timeline.next().then((result) => {
      if (result.value instanceof TimelineItemError)
        controller.error(result.value.get())
      else if (result.value instanceof TimelineItemDash) return next(controller)
      return result
    })
  }
}

class TimelineExpectedMoreValuesError extends TimelineError {
  constructor(timeline: string) {
    super(`There are more expectations left.\n${timeline}`)
  }
}

class TimelineReceivedExtraValueError extends TimelineError {
  constructor(chunk: TimelineItemValue) {
    super(
      `Received a value after the expected timeline:\n${JSON.stringify(
        chunk,
        null,
        2
      )}`
    )
  }
}

class TimelineEarlyCloseError extends TimelineError {
  constructor() {
    super('The writer received a signal to close the stream')
  }
}

class TimelineTimerError extends TimelineError {
  constructor(ms: number, timeLeft: number) {
    super(
      `Expected ${ms}ms timer to have finished. There is ${timeLeft}ms left.`
    )
  }
}
