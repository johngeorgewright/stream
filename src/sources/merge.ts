/**
 * Merges multiple streams in to 1 ReadableStream.
 *
 * Warning: this will always create a bottleneck... the highwater mark
 * will always be breached. This is because every pull will attempt to
 * read and queue at least one chunk from each incoming stream.
 *
 * @group Sources
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
export function merge<T>(
  ...readableStreams: ReadableStream<T>[]
): ReadableStream<T> {
  const readers = readableStreams.map((stream) => stream.getReader())

  return new ReadableStream<T>({
    pull(controller) {
      // At first glance you may wonder why we're wrapping
      // the Promise.all in another Promise. This is because
      // we have no idea how long each reader is going to
      // take and we may want to fill the desired size before
      // all readers have resolved. Therefore we resolve
      // when the 1st reader queues an item so the stream
      // can request more if it needs.
      return new Promise((resolve, reject) => {
        let done = 0

        Promise.all(
          readers.map((reader) =>
            reader
              .read()
              .then((result) => {
                if (result.done) done++
                else {
                  controller.enqueue(result.value)
                  resolve()
                }
              })
              .catch((error) => {
                controller.error(error)
                // TODO: do we need to reject if the error is in the stream?
                reject(error)
              })
          )
        ).finally(() => {
          if (done === readableStreams.length) {
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
  })
}
