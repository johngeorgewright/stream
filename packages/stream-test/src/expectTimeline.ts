import { timeout } from '@johngw/stream-common/Async'
import { asyncIterableToArray } from '@johngw/stream-common/Iterable'
import { when } from '@johngw/stream-common/Logic'
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
  let nextResult: Promise<IteratorResult<TimelineValue>>

  return new WritableStream<T>(
    {
      start(controller) {
        next(controller)
      },

      async close() {
        const rest = await getRest()
        if (rest.length) throw new TimelineExpectedMoreValuesError(rest)
      },

      async write(chunk, controller) {
        const { done, value } = await nextResult

        switch (true) {
          case done:
            return controller.error(new TimelineReceivedExtraValueError(chunk))

          case value instanceof Error:
            return controller.error(value)

          case value === CloseTimeline:
            return controller.error(new TimelineEarlyCloseError())

          case value instanceof TimelineTimer:
            await timeout()
            if (!value.finished)
              controller.error(new TimelineTimerError(value.ms, value.timeLeft))
            next(controller)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.write!(chunk, controller)

          default:
            await testExcpectation(value, chunk)
        }

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

  async function getRest() {
    const { done, value } = await nextResult
    return (
      done
        ? []
        : [value, ...(await asyncIterableToArray(iterator))].filter(
            (value) =>
              !(value === CloseTimeline) &&
              !(value instanceof NeverReachTimelineError) &&
              !(value instanceof TimelineTimer && value.finished)
          )
    ) as TimelineValue[]
  }
}

class TimelineExpectedMoreValuesError extends TimelineError {
  constructor(values: TimelineValue[]) {
    super(
      `There ${when({ _: 'are', 1: 'is' }, values.length)} ${
        values.length
      } more ${when(
        {
          _: 'expectations',
          1: 'expectation',
        },
        values.length
      )} left.\n- ${values
        .map((value) => JSON.stringify(value, null, 2))
        .join('\n- ')}`
    )
  }
}

class TimelineReceivedExtraValueError extends TimelineError {
  constructor(chunk: TimelineValue) {
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
