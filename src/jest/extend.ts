import { expect, JestAssertionError, MatcherContext } from 'expect'
import { expectTimeline } from '../sinks/expectTimeline.js'

expect.extend({
  toMatchTimeline: function toMatchTimeline<T>(
    this: MatcherContext,
    stream: ReadableStream<T>,
    timeline: string
  ) {
    return stream
      .pipeTo(
        expectTimeline(timeline, (timelineValue, chunk) => {
          expect(chunk).toStrictEqual(timelineValue)
        })
      )
      .then(
        () => ({
          message: () =>
            `expect ${this.utils.printExpected(
              stream
            )} to match timeline ${timeline}`,
          pass: true,
        }),
        (error: JestAssertionError) => ({
          message: () => error.matcherResult?.message || error.message,
          pass: error.matcherResult?.pass || false,
        })
      )
  },
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toMatchTimeline(timeline: string): Promise<R>
    }
  }
}
