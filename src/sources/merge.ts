import { ReadableStreamsChunk, without } from '../utils'
import { immediatelyClosingReadableStream } from './immediatelyClosingReadableStream'

/**
 * Merges multiple streams in to 1 ReadableStream.
 *
 * Warning: this may create a bottleneck as the highwater mark
 * can easily be breached. This is because every pull will attempt to
 * read and queue at least one chunk from each incoming stream.
 *
 * @group Sources
 * @see {@link roundRobin:function}
 * @example
 * ```
 * --1----2----3-------4-|
 * ---one---two---three---four-|
 *
 * merge([stream1, stream2])
 *
 * -1-one-2-two-3-three-4-four-|
 * ```
 */
export function merge<RSs extends ReadableStream<unknown>[]>(
  readableStreams: RSs,
  queuingStrategy?: QueuingStrategy<ReadableStreamsChunk<RSs>>
) {
  if (!readableStreams.length) return immediatelyClosingReadableStream()

  let readers = readableStreams.map((stream) => stream.getReader())

  return new ReadableStream<ReadableStreamsChunk<RSs>>(
    {
      pull(controller) {
        // At first glance you may wonder why we're wrapping
        // the Promise.all in another Promise. This is because
        // we have no idea how long each reader is going to
        // take and we may want to fill the desired size before
        // all readers have resolved. Therefore we resolve
        // when the 1st reader queues an item so the stream
        // can request more if it needs.
        return new Promise((resolve) => {
          Promise.all(
            readers.map(async (reader) => {
              try {
                const result = await reader.read()
                if (result.done) readers = without(readers, reader)
                else {
                  controller.enqueue(result.value as ReadableStreamsChunk<RSs>)
                  resolve()
                }
              } catch (error) {
                controller.error(error)
                resolve()
              }
            })
          ).finally(() => {
            if (!readers.length) {
              try {
                controller.close()
              } catch (error) {
                // potentially closed already
              }
              resolve()
            }
          })
        })
      },

      async cancel(reason) {
        await Promise.all(readers.map((reader) => reader.cancel(reason)))
      },
    },
    queuingStrategy
  )
}
