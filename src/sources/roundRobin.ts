import { without } from '../utils/Array'
import { immediatelyClosingReadableStream } from './immediatelyClosingReadableStream'

/**
 * Given an ordered list of streams, queue their items from one stream at a time.
 *
 * @group Sources
 * @see {@link merge:function}
 * @example
 * ```
 * --1------2------3------4-------
 * ----one-two--three-------------
 *
 * roundRobin([stream1, stream2])
 *
 * --1-one--2-two--3-three-4------
 * ```
 */
export function roundRobin<T>(
  streams: ReadableStream<T>[],
  queuingStrategy?: QueuingStrategy
) {
  if (!streams.length) return immediatelyClosingReadableStream()

  let readers = streams.map((stream) => stream.getReader())
  const readResultIterator = generateReadResults()

  return new ReadableStream<T>(
    {
      async pull(controller) {
        const result = await readResultIterator.next()
        if (result.done) return controller.close()
        controller.enqueue(result.value)
        if (controller.desiredSize)
          // Typescript still thinks that `this.pull` could be undefined.
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return this.pull!(controller)
      },

      async cancel(reason: unknown) {
        await Promise.all(readers.map((reader) => reader.cancel(reason)))
      },
    },
    queuingStrategy
  )

  async function* generateReadResults() {
    let index = 0

    while (readers.length) {
      if (!(index in readers)) index = 0
      const reader = readers[index]
      const result = await reader.read()
      if (result.done) readers = without(readers, reader)
      else {
        yield result.value
        index++
      }
    }
  }
}
