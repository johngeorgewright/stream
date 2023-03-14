import { ReadableStreamsChunk } from '../utils'
import { without } from '../utils/Array'
import { IteratorSource } from './fromCollection'
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
export function roundRobin<RSs extends ReadableStream<unknown>[]>(
  streams: RSs,
  queuingStrategy?: QueuingStrategy
) {
  let readers = streams.map((stream) => stream.getReader())

  return !streams.length
    ? immediatelyClosingReadableStream()
    : new ReadableStream<ReadableStreamsChunk<RSs>>(
        new IteratorSource(generateReadResults(), async (reason) => {
          await Promise.all(readers.map((reader) => reader.cancel(reason)))
        }),
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
