import { expectTimeline, TimelineValue } from '@johngw/stream-test'
import { expect, JestAssertionError, MatcherContext } from 'expect'

expect.extend({
  toMatchTimeline: function toMatchTimeline<T extends TimelineValue>(
    this: MatcherContext,
    stream: ReadableStream<T>,
    timeline: string,
    streamPipeOptions?: StreamPipeOptions
  ) {
    return stream
      .pipeTo(
        expectTimeline(timeline, (timelineValue, chunk) => {
          expect(chunk).toStrictEqual(timelineValue)
        }),
        streamPipeOptions
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
      toMatchTimeline(
        timeline: string,
        streamPipeOptions?: StreamPipeOptions
      ): Promise<R>
    }
  }
}
